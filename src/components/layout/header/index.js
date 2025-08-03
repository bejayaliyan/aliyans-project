import React, { useEffect, useRef, useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../../../images/logo.svg";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";
import { useTranslation } from "react-i18next";
import {
  getToken,
  flushUserSession,
  logout,
  getAuthUser,
  profile_change,
} from "../../../auth";
import { fetchUserLogin } from "../../../redux/actions/UserstateActions";
import { add_badge } from "../../../redux/actions/NotificationstateActions";
import { Profile_modal } from "./profile_modal";
import i18n from "../../../i18n";
import axios from "axios";
import { BellPic } from "../../admin/components/bellPic";

const defaultLangFlag = (
  <img src={`./images/country-flag/en.png`} height="25" width="30" alt="nope" />
);

const languages = [
  { id: 1, value: "en", text: "Options" },
  { id: 2, value: "en", text: "English" },
  { id: 3, value: "nl", text: "Dutch" },
];
const Header = (props) => {
  const login_status = useSelector((state) => state.userState.login_status);
  const AuthUser = getAuthUser();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  //const { i18n, change } = props;
  const [modalShow, setModalShow] = useState();
  const navigate = useNavigate();
  const [active, setActive] = useState();
  const [click, setClick] = useState(false);
  const location = useLocation();
  const [lang, setLang] = useState("en");
  const handleChange = (e) => {
    setLang(e.target.value);
    i18n.changeLanguage(e.target.value);
  };
  const [username, setUserName] = useState(AuthUser?.name);
  const [userimg, setUserImg] = useState("default.svg");
  const [cssDisplay, setCssDisplay] = useState("none");
  const [langFlag, setLangFlag] = useState(defaultLangFlag);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    // Close the dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setClick(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const AuthUser = getAuthUser();
    setUserName(AuthUser?.name);
    const pathname = location.pathname;
    const token = getToken();
    if (pathname == "/notification") setActive(true);
    if (!AuthUser) {
      flushUserSession();
    } else {
      dispatch(fetchUserLogin(AuthUser));
    }
    if (token?.length > 0) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/notification/get`, {
          headers: {
            "x-access-token": token,
          },
        })
        .then((res) => {
          if (res.data.length > 0) dispatch(add_badge(true));
          else dispatch(add_badge(false));
        });
    }
    if (AuthUser)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/auth/info`, {
          email: AuthUser?.email,
        })
        .then((res) => {
          const data = res.data;
          if (data.imgurl) setUserImg(data.imgurl);
        });
  }, []);
  const onHide = (data) => {
    setUserName(data);
    profile_change(data);
    closeModal();
  };
  const closeModal = () => {
    setModalShow(false);
  };

  const showDropdown = () => {
    if (cssDisplay === "none") {
      setCssDisplay("block");
    } else {
      setCssDisplay("none");
    }
  };

  const selectListItem = (event) => {
    handleLanguageChange(event);
    setCssDisplay("none");
    setLangFlag(
      <img src={event.target.src} height="25" width="30" alt="nope" />
    );
  };

  const handleLanguageChange = (event) => userLanguageChange(event);
  const userLanguageChange = (event) => {
    console.log("Here grab event.target.id and propagate lang change to app");
  };

  return (
    <div>
      <div className="header">
        <Navbar bg="white" variant="white" expand="lg" className="py-3">
          <Container className="navbar-container">
            <Profile_modal
              show={modalShow}
              onHide={onHide}
              data={AuthUser}
              closeModal={closeModal}
              setUserImg={setUserImg}
            />
            <Navbar.Brand href="/">
              <img src={Logo} alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto  align-items-center">
                <NavLink to="/home" className="nav-link"> {t("book_ride")}</NavLink>
                <NavLink to="/price-qoute" className="nav-link">{t("price quote")}</NavLink>
                <NavLink to="/sale-receipt" className="nav-link">{t("sales receipt")}</NavLink>
                <NavLink to="/history" className="nav-link">{t("book history")}</NavLink>
              </Nav>
              <Nav className="d-flex justify-content-end">
                {login_status ? (
                  <div className="rside icon-group" style={{ gridArea: "button" }}>
                    <div className="nav-item">
                      <div
                        className={active ? "svg-container active" : "svg-container"}>
                        <NavLink className="nav-link">
                          <div className="notifications">
                            <BellPic />
                            <div className="d-none">Notifications</div>
                          </div>
                        </NavLink>
                      </div>
                    </div>
                    <div ref={profileDropdownRef} className="nav-item profile-dropdown" onClick={() => (click ? setClick(false) : setClick(true))}>
                      <span className="ProfilImgIcon">
                        <img
                          src={`${userimg.includes("amazonaws.com")
                              ? userimg
                              : 'https://limousine4hire.s3.dualstack.us-west-1.amazonaws.com/EmailTemplateImages/DefultUser.png'
                            }`}
                          alt="profile"
                          className="profile-icon"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        // width="48px"
                        // height="48px"
                        />
                      </span>

                      <h6 className="userName">
                        {username}
                        <span>
                          <i className="fas fa-chevron-down"></i>
                        </span>
                      </h6>
                      <div className={click ? "profile active" : "profile"}>
                        <h3 onClick={() => { setModalShow(true); setClick(false); }}>My Profile</h3>
                        <h3 onClick={logout}>logout</h3>
                        <div className="triangle"></div>
                      </div>
                    </div>
                    <NavDropdown title={username} id="basic-nav-dropdown">
                      <NavDropdown.Item><h3 onClick={() => { setModalShow(true); setClick(false); }}>My Profile</h3></NavDropdown.Item>
                      <NavDropdown.Item><h3 onClick={logout}>logout</h3></NavDropdown.Item>
                    </NavDropdown>

                    <div className="nav-item language-dropdown">
                      <button className="flag-btn" onClick={showDropdown} >{langFlag}  <span>
                        <i className="fas fa-chevron-down"></i>
                      </span> </button>
                      <ul style={{ display: cssDisplay }} className="flag-ul">
                        {languages.map((lang) => (
                          <li key={lang.id} value={lang.value}>
                            <img onClick={selectListItem} src={`/images/country-flag/${lang.value}.png`} height="25" width="30" alt="flagpic" id={lang.value} />
                            {lang.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <NavDropdown title="Language" id="basic-nav-dropdown">
                      {languages.map((lang) => (
                        <NavDropdown.Item key={lang.id} value={lang.value}>
                          <img onClick={selectListItem} src={`/images/country-flag/${lang.value}.png`} height="25" width="30" alt="flagpic" id={lang.value} />
                          {lang.name}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                  </div>
                ) : (
                  <Nav className="align-items-center " style={{ gridArea: "button" }}>
                    <NavLink to="/home" className="nav-link get-started">
                      {t("get_started")}
                    </NavLink>
                    <NavLink
                      to="/login"
                      className="nav-link login"
                      onClick={() => dispatch(fetchUserLogin(true))}
                    >
                      {t("login")}
                    </NavLink>
                  </Nav>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

export { Header };
