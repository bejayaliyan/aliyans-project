import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchRedirects } from '../../../redux/actions/UserstateActions';
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import { useTranslation } from "react-i18next";
import Confirm_modal from "../modal/confirm_modal";
import { ToastProvider } from "react-toast-notifications";
import "./dashboard.scss";
import "./book_rider.scss";

const Redirects = ({userName}) => {
  const dispatch = useDispatch();
  const [oldUrl, setOldUrl] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const [modalId, setModalId] = useState();
  const [errors, setErrors] = useState([]);
  const [modalshow, setModalshow] = useState(false);
  const [modaltitle, setModaltitle] = useState("add new blog");
  const [redirects, setRedirects] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();
  const [loadingShow, setLoadingShow] = useState(false);
  const [blogKey, setBlogKey] = useState();
  const { t } = useTranslation();
  const handleConfirmModalClose = () => setConfirmModalShow(false);
  const handleModalClose = () => setModalshow(false);
  const handleModalShow = () => {
    setModalshow(true);
    setModaltitle("add new blog");
  };

  // const handleCommentModalShow = () => {
  //   setModalshow(true);
  //   setModaltitle("Comments");
  // };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!redirects) getRedirects();
  }, []);

  const getRedirects = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/redirects/get`).then((res) => {
      dispatch(fetchRedirects(res.data));
      setRedirects(res.data);
    });
  };

  const handleDelete = (id) => {
      setDeleteId(id);
      setBlogKey(null)
      setConfirmModalShow(true)
  }

  const handleUpdate = (val) => {
    setModalId(val.id)
    setOldUrl(val.newUrl)
    setNewUrl(val.newUrl)
  };

  const delete_item = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    setNotifyContent("Blog has been Cancelled Successfully");
    setNotifyModalTitle("Blog deleted");
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/redirect/delete`, { id: deleteId })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
        }
        getRedirects();
      });
  };

  const handleOldUrlChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setOldUrl(inputValue);
      setErrors({});
    } else {
      setErrors({ title: "Page url must be less than 160 characters." });
    }
  };

  const handleNewUrlChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setNewUrl(inputValue);
      setErrors({});
    } else {
      setErrors({ title: "Page url must be less than 160 characters." });
    }
  };

  const validate = (value) => {
    if (!value) {
      return "Field is required";
    }
  };

  const next = () => {
    const validationErrors = {};
    let error = validate(oldUrl);
    if (error && error.length > 0) validationErrors["oldUrl"] = error;
    validate(newUrl);
    if (error && error.length > 0) validationErrors["newUrl"] = error;
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else if (errors && errors.file && errors.file.length > 0) {
      //console.log('error')
    } else {
      // setActive(true);
      submit();
    }
  };

  const submit = async () => {
    let temp = {};
    temp.oldUrl = oldUrl;
    temp.newUrl = newUrl;
    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);
      // axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/update`, temp)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/redirect/update`, temp)
        .then((res) => {
          getRedirects();
          // PageClose();
          setLoadingShow(false);
        });
    } else {
      setLoadingShow(true);

      // axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/create`, temp)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/redirect/create`, temp)
        .then((res) => {
          getRedirects();
          setLoadingShow(false);
        })
        .catch((err) => {
          // addToast(err.response.data.message, {
          //   appearance: "error",
          //   autoDismiss: true,
          // });
        });
      setLoadingShow(false);
    }
    setOldUrl('')
    setNewUrl('')
  };

  return (
    <div className="dashboard cms">
      <Sidebar />
      <div className="content book_rider service-page">
        <div className="content-panel">
          <div className="content-panel__heading">
            <div className="caption cms-caption">
              <h5>Welcome, {userName}</h5>
              <DynamicTimer />
            </div>
            <div className="dropdown">
              <div className="nav-item bell">
                <div className="svg-container">
                    <BellPic />
                </div>
              </div>

              <UserIcon></UserIcon>
            </div>
          </div>
          <div className="content-panel__content">
            <Row>
              <Col xs={12}>
                <div className="card" style={{ border: 'none' }}>
                  <div className="card-body p-3" >
                    <div className="card-body__header">
                    </div>
                    <div className="card-body__content">
                      <div
                        className="input-wrapper mb-0"
                        style={{
                          width: '100%',
                          marginBottom: '15px',
                          marginLeft: '0',
                        }}
                      >
                        <h5 style={{ width: '110px' }}>Old URL:</h5>
                        <input
                          type="text"
                          placeholder="blog"
                          style={{ width: '100%' }}
                          value={oldUrl}
                          onChange={e => setOldUrl(e.target.value)}
                        ></input>
                      </div>
                      <span className="text-danger">{errors.oldUrl}</span>

                      <div
                        className="input-wrapper mt-3 mb-0"
                        style={{
                          width: '100%',
                          marginBottom: '15px',
                          marginLeft: '0',
                        }}
                      >
                        <h5 style={{ width: '110px' }}>New URL:</h5>
                        <input
                          type="text"
                          placeholder="blogs"
                          style={{ width: '100%' }}
                          value={newUrl}
                          onChange={e => setNewUrl(e.target.value)}
                        ></input>
                      </div>
                      <span className="text-danger">{errors.newUrl}</span>

                      <div
                        className="row mt-3"
                        style={{
                          justifyContent: 'end',
                          marginRight: '15px',
                          marginBottom: '20px',
                        }}
                      >
                        <h6 className="update" style={{fontSize: "18px", fontWeight: "700"}} onClick={next}>
                          Add
                        </h6>
                      </div>
                       <div className="table-responsive">
                       <table className="blog" style={{ width: '100%' }}>
                        <thead>
                          <tr className="cms-tr">
                            <th className="cms-th">ID</th>
                            <th className="cms-th">Old URL’s</th>
                            <th className="cms-th">New URL’s</th>
                            <th className="cms-th text-center" colSpan="2">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {redirects?.map((val, key) => {
                            return (
                              <tr key={key} className="cms-tr">
                                <td className="cms-td" style={{ width: '10%' }}>
                                  <span className="cms-id">{val.id}</span>
                                </td>
                                <td className="cms-td" style={{ width: '40%' }}>
                                  {val.oldUrl}
                                </td>
                                <td className="cms-td" style={{ width: '40%' }}>
                                  {val.newUrl}
                                </td>
                                <td className="cms-td d-flex">
                                <div
                                    className="update cms-action-button cms-edit-button"
                                    onClick={() => handleUpdate(val)}
                                  >
                                    <i className="fa-regular fa-floppy-disk cms-action-button-icon"></i>
                                    <h6>Edit</h6>
                                  </div>
                                  <div
                                    className="delete cms-action-button cms-delete-button"
                                    onClick={() => handleDelete(val.id)}
                                  >
                                    <i className="fa-regular fa-trash-can cms-action-button-icon"></i>
                                    <h6>Delete</h6>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                       </div>
                     
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <ToastProvider>
        <Confirm_modal
          classProp="modal"
          content="This action will your url"
          button_name="Delete url"
          modalTitle="Delete URL?"
          delete_vehicle={delete_item}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  );
};

export { Redirects };
