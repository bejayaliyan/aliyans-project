import { useEffect, useState } from "react";
import { Row, Col, Pagination, Tabs, Tab, Accordion } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../pages/sidebar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DynamicTimer } from "../components/timer";
import { BellPic } from "../components/bellPic";
import UserIcon from "../components/userIcon";
import { useDispatch } from "react-redux";
import { fetchFields } from "../../../redux/actions/UserstateActions";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Confirm_modal from "./confirm_modal";
import "./driver_modal.scss";
import "../pages/cms.scss";

const NewPage = ({ userName }) => {
  const location = useLocation();
  const data = location.state ? location.state.data : null;

  const maxNumber = 69;
  const dispatch = useDispatch();

  // SEO States
  const [metaRobot, setMetaRobot] = useState();
  const [pageUrl, setPageUrl] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const [globalStructureMarkup, setGlobalStructureMarkup] = useState();
  const [twitterTitle, setTwitterTitle] = useState();
  const [twitterDescription, setTwitterDescription] = useState();
  const [facebookTitle, setFacebookTitle] = useState();
  const [facebookDescription, setFacebookDescription] = useState();
  const [youtubeTitle, setYoutubeTitle] = useState();
  const [youtubeDescription, setYoutubeDescription] = useState();

  // Content States
  const { id } = useParams();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  const [pages, setPages] = useState();
  const [fields, setFields] = useState();
  const [name, setName] = useState();
  const [title, setTitle] = useState();
  const [shortDescription, setShortDescription] = useState();
  const [modalId, setModalId] = useState();

  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);

  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();
  const handleConfirmModalClose = () => setConfirmModalShow(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const cancelHandler = () => {
    navigate(`/admin/pages`);
  };

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setName(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Page title must be less than 60 characters.",
      }));
    }
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setTitle(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "Page title must be less than 60 characters.",
      }));
    }
  };

  const statusHandler = (id, status) => {
    let temp = {};
    temp.id = id;
    if (status == 1) temp.action = 1;
    if (status == 0) temp.action = 0;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/field/update`, temp)
      .then((res) => {
        if (res.status === 200) {
          addToast("Field status updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getFields();
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });
      });
  };

  const handleShortDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 160) {
      setShortDescription(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        shortDescription: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        shortDescription:
          "Page short description must be less than 160 characters.",
      }));
    }
  };

  const validate = (value) => {
    if (!value) {
      return "Field is required";
    }
  };

  const next = () => {
    const validationErrors = {};
    let error = validate(name);
    if (error && error.length > 0) validationErrors["name"] = error;
    error = validate(shortDescription);
    if (error && error.length > 0) validationErrors["shortDescription"] = error;
    error = validate(title);
    if (error && error.length > 0) validationErrors["title"] = error;
    if (modalId) {
      error = validate(metaRobot);
      if (error && error.length > 0) validationErrors["metaRobot"] = error;
      error = validate(pageUrl);
      if (error && error.length > 0) validationErrors["pageUrl"] = error;
      error = validate(metaDescription);
      if (error && error.length > 0)
        validationErrors["metaDescription"] = error;
      error = validate(globalStructureMarkup);
      if (error && error.length > 0)
        validationErrors["globalStructureMarkup"] = error;
    }
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
    temp.name = name;
    temp.title = title;
    temp.short_description = shortDescription;
    temp.meta_robot = metaRobot;
    temp.page_url = pageUrl;
    temp.meta_description = metaDescription;
    temp.global_structure_markup = globalStructureMarkup;
    temp.twitter_title = twitterTitle;
    temp.twitter_description = twitterDescription;
    temp.facebook_title = facebookTitle;
    temp.facebook_description = facebookDescription;
    temp.youtube_title = youtubeTitle;
    temp.youtube_description = youtubeDescription;

    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/page/update`, temp)
        .then((res) => {
          addToast("Page updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          setLoadingShow(false);
          navigate(`/admin/pages`);
        });
    } else {
      setLoadingShow(true);

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/page/create`, temp)
        .then((res) => {
          setLoadingShow(false);
          addToast("Page created successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/pages`);
        })
        .catch((err) => {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
      setLoadingShow(false);
    }
  };

  const addNewFieldHandler = () => {
    navigate(`/admin/pages/new_page/new_field/${id}`);
  };

  const getFields = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/pages/${id}`)
      .then((res) => {
        dispatch(fetchFields(res.data));
        setErrors([]);
        setFields(res.data);
        setName(res.data?.name);
        setShortDescription(res.data?.short_description);
        setModalId(res.data?.id);
        setMetaRobot(res.data?.meta_robot);
        setPageUrl(res.data?.page_url);
        setMetaDescription(res.data?.meta_description);
        setGlobalStructureMarkup(res.data?.global_structure_markup);
        setTwitterTitle(res.data?.twitter_title);
        setTwitterDescription(res.data?.twitter_description);
        setFacebookTitle(res.data?.facebook_title);
        setFacebookDescription(res.data?.facebook_description);
        setYoutubeTitle(res.data?.youtube_title);
        setYoutubeDescription(res.data?.youtube_description);
        setTitle(res.data?.title);
      });
  };

  useEffect(() => {
    if (!fields) getFields();
  }, []);

  // Pagination start
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const totalFields = Math.ceil(fields?.fields?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = fields?.fields?.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Pagination end

  const updateHandler = (val) => {
    navigate(`/admin/pages/new_page/new_field/${id}`, { state: { data: val } });
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setConfirmModalShow(true);
  };

  const deleteItem = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    setNotifyContent("Field has been Cancelled Successfully");
    setNotifyModalTitle("Field deleted");
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/field/delete`, {
        id: deleteId,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
          addToast("Field deleted successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getFields();
        }
      });
  };

  return (
    <>
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
                    <Link to="/admin/notification">
                      <BellPic />
                    </Link>
                  </div>
                </div>

                <UserIcon></UserIcon>
              </div>
            </div>
            <div className="content-panel__content">
              <Row>
                <Col xs={12}>
                  <div className="card">
                    <div
                      className="card-body"
                      style={{ padding: "23px 40px" }}
                    >
                      <div className="card-body__header">
                        <div
                          className="caption"
                          style={{ paddingBottom: "70px" }}
                        >
                          <h5
                            style={{
                              textTransform: "capitalize",
                              fontSize: "24px",
                            }}
                          >
                            Create New Page
                          </h5>
                        </div>
                      </div>
                      <div className="card-body__content">
                        <div
                          className="input-wrapper"
                          style={{ marginBottom: "0", padding: "18px 24px" }}
                        >
                          <h5 className="p-0">Page Name:</h5>
                          <input
                            type="text"
                            placeholder="Enter Page Name"
                            value={name}
                            onChange={handleNameChange}
                          ></input>
                        </div>
                        <span className="text-danger">{errors.name}</span>

                        <div
                          className="input-wrapper"
                          style={{ marginBottom: "0", padding: "18px 24px",marginTop: "17px" }}
                        >
                        <h5 className="p-0">Page Title:</h5>
                          <input
                            type="text"
                            placeholder="Enter Page Title (25 out of 60 max recommended characters.)"
                            value={title}
                            onChange={handleTitleChange}
                          ></input>
                        </div>
                        <span className="text-danger">{errors.name}</span>

                        <h5
                          style={{
                            backgroundColor: "rgba(242, 242, 242, 0.4)",
                            marginBottom: "0",
                            padding: "20px 24px",
                            fontSize: "16px",
                            fontWeight: "700",
                            marginTop: "17px",
                            fontFamily: "Lato",
                          }}
                        >
                          Page Short Description:
                        </h5>
                        <div
                          className="input-wrapper"
                          style={{ marginBottom: "0" }}
                        >
                          <textarea
                            type="text"
                            rows={6}
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              paddingLeft: "24px",
                              paddingRight: "24px",
                            }}
                            placeholder="Enter Page Title (25 out of 60 max recommended characters.)"
                            value={shortDescription}
                            onChange={handleShortDescriptionChange}
                          />
                        </div>

                        <span className="text-danger">
                          {errors.shortDescription}
                        </span>
                      </div>

                      {!modalId && (
                        <div
                          className="row"
                          style={{
                            justifyContent: "end",
                            marginRight: "15px",
                            marginTop: "25px",
                          }}
                        >
                          <h6
                            className="delete"
                            style={{
                              border: "1px solid",
                              borderRadius: "12px",
                              padding: "10px 20px",
                              width: "fit-content",
                              marginRight: "15px",
                              fontSize: "18px",
                              fontWeight: "700",
                            }}
                            onClick={cancelHandler}
                          >
                            Cancel
                          </h6>
                          <h6
                            className="update"
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              width: "fit-content",
                              padding: "10px 20px",
                            }}
                            onClick={next}
                          >
                            Submit
                          </h6>
                        </div>
                      )}

                      {fields && (
                        <div className="card-body blogtab  mt-4">
                        <Tabs
                          defaultActiveKey="field"
                          id="uncontrolled-tab-example"
                          className="mb-3 font32 border-0"
                        >
                          <Tab eventKey="field" title="Fields">
                            <Row className="mb-4">
                              <Col xs={12}>
                                <div
                                  className="add-new-field"
                                  onClick={addNewFieldHandler}
                                >
                                  <h6>Add Field</h6>
                                </div>
                              </Col>
                            </Row>
                            <Row className="customPagination">
                              <Col xs={12}>
                              <div className=" table-responsive">
                                <table
                                  className="blog"
                                  style={{ width: "100%" }}
                                >
                                  <thead>
                                    <tr className="cms-tr">
                                      <th className="cms-th">Field ID</th>
                                      <th className="cms-th">Section Name</th>
                                      <th className="cms-th">Type</th>
                                      <th
                                        colSpan="2"
                                        className="text-center cms-th"
                                      >
                                        Action
                                      </th>
                                      <th className="cms-th">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentValues?.map((val, key) => {
                                      return (
                                        <tr key={key} className="cms-tr">
                                          <td
                                            className="cms-td"
                                            style={{
                                              width: "10%",
                                            }}
                                          >
                                            {10 * (currentPage - 1) + (key + 1)}
                                          </td>
                                          <td
                                            className="cms-td"
                                            style={{ width: "40%" }}
                                          >
                                            {val.field_name}
                                          </td>
                                          <td
                                            className="cms-td"
                                            style={{ width: "40%" }}
                                          >
                                            {val.field_type
                                              .charAt(0)
                                              .toUpperCase() +
                                              val.field_type.slice(1)}
                                          </td>
                                          <td className="cms-td">
                                            <div
                                              className="update cms-action-button cms-edit-button"
                                              onClick={() => updateHandler(val)}
                                            >
                                              <i className="fa-regular fa-floppy-disk cms-action-button-icon"></i>
                                              <h6>Edit</h6>
                                            </div>
                                          </td>
                                          <td className="cms-td">
                                            <div
                                              className="delete cms-action-button cms-delete-button"
                                              onClick={() =>
                                                deleteHandler(val.id)
                                              }
                                            >
                                              <i className="fa-regular fa-trash-can cms-action-button-icon"></i>
                                              <h6>Delete</h6>
                                            </div>
                                          </td>
                                          <td className="cms-td">
                                            <div
                                              className="delete cms-action-button cms-delete-button"
                                              style={{
                                                paddingTop: "5px",
                                                paddingBottom: "5px",
                                              }}
                                            >
                                              <button
                                                className={`field-action ${
                                                  val.action == 1 ? "disabled" : ""
                                                }`}
                                                disabled={val.action == 1}
                                                onClick={() => {
                                                  if (val.action == 0) {
                                                    statusHandler(val.id, 1);
                                                  }
                                                }}
                                              >
                                                <i
                                                  className="fa-solid fa-eye"
                                                  style={{
                                                    color: "#0d2576",
                                                    paddingRight: "15px",
                                                  }}
                                                ></i>
                                              </button>
                                              <button
                                                className={`field-action ${
                                                  val.action == 0 ? "disabled" : ""
                                                }`}
                                                disabled={val.action == 0}
                                                onClick={() => {
                                                  if (val.action == 1) {
                                                    statusHandler(val.id, 0);
                                                  }
                                                }}
                                              >
                                                <i
                                                  className="fa-solid fa-eye-slash"
                                                  style={{ color: "#ffffff" }}
                                                  disabled={val.action == 0}
                                                ></i>
                                              </button>
                                              {/* <h6>Delete</h6> */}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                                </div>
                                <Pagination>
                                  <Pagination.Prev className="customPrev" />
                                  {Array.from({ length: totalFields }).map(
                                    (_, index) => (
                                      <Pagination.Item
                                        key={index}
                                        active={index + 1 === currentPage}
                                        onClick={() =>
                                          handlePageChange(index + 1)
                                        }
                                      >
                                        {index + 1}
                                      </Pagination.Item>
                                    )
                                  )}
                                  <Pagination.Next className="customNext" />
                                </Pagination>
                              </Col>
                            </Row>
                          </Tab>
                          <Tab eventKey="seo" title="SEO">
                            <Row
                              className="m-0"
                              style={{ backgroundColor: "#F2F2F2" }}
                            >
                              <Col xs={12}>
                                <div
                                  className="card"
                                  style={{
                                    border: "none",
                                    backgroundColor: "#F2F2F2",
                                  }}
                                >
                                  <div className="card-body">
                                    <div className="card-body__content">
                                      <h5 className="seo-titles">
                                        Meta Robots
                                      </h5>

                                      <div
                                        className="input-wrapper"
                                        style={{
                                          width: "100%",
                                          marginBottom: "26px",
                                        }}
                                      >
                                        <select
                                          placeholder="Please select the page from dropdown to enable Global Structure Markup"
                                          className="custom-dropdown"
                                          value={metaRobot}
                                          style={{
                                            border: "none",
                                            width: "100%",
                                            marginLeft: "0",
                                            padding: "15px 20px",
                                            backgroundColor: "#fff",
                                          }}
                                          onChange={(e) =>
                                            setMetaRobot(e.target.value)
                                          }
                                        >
                                          <option value="">Select Type</option>
                                          <option value="index, follow">
                                            index, follow
                                          </option>
                                          <option value="noindex, nofollow">
                                            noindex, nofollow
                                          </option>
                                        </select>
                                      </div>
                                      <span className="text-danger">
                                        {errors.metaRobot}
                                      </span>
                                      <div
                                        style={{
                                          display: "flex",
                                          marginBottom: "20px",
                                          alignItems: "center",
                                        }}
                                      >
                                        <h5 className="m-0 seo-titles">
                                          Permalink:{" "}
                                        </h5>

                                        <div
                                          className="input-wrapper"
                                          style={{
                                           
                                            paddingLeft: "15px",
                                            marginBottom: "0px",
                                            textDecoration: "underline",
                                          }}
                                        >
                                          limousine4hire.net
                                        </div>
                                      </div>

                                      <div
                                        className="input-wrapper"
                                        style={{
                                          marginBottom: "29px",
                                          backgroundColor: "#fff",
                                          height: "100px",
                                          paddingTop:"15px",
                                          paddingBottom:"10px"
                                        }}
                                      >
                                        <h5
                                          className="seo-titles"
                                          style={{ verticalAlign: "middle" }}
                                        >
                                          Page URL:
                                        </h5>
                                        <textarea
                                          type="text"
                                          style={{
                                            border: "none",
                                            paddingLeft: "24px",
                                            height: "100px",
                                          }}
                                          placeholder="Use Short URLs / SEO Friendly. Should be simple to digest for both readers and search engines.
                                          • Remove the extra, unnecessary words.
                                          • Use only one or two keywords.
                                          • Use HTTPS only, as Google now uses that as a positive ranking factor."
                                          value={pageUrl}
                                          onChange={(e) =>
                                            setPageUrl(e.target.value)
                                          }
                                        />
                                        {/* <ul
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          <li>
                                            Remove the extra, unnecessary words.
                                          </li>
                                          <li>Use only one or two keywords.</li>
                                          <li>
                                            Use HTTPS only, as Google now uses
                                            that as a positive ranking factor.
                                          </li>
                                        </ul> */}
                                      </div>
                                      <span className="text-danger">
                                        {errors.pageUrl}
                                      </span>
                                      <div
                                        style={{
                                          backgroundColor: "#fff",
                                          marginBottom: "0",
                                          paddingLeft: "24px",
                                          borderRadius: "5px",
                                        }}
                                        className="d-flex flex-column gap-1 mb-4"
                                      >
                                        <h5
                                          className="seo-titles"
                                          style={{
                                            marginBottom: "0",
                                            paddingTop: "15px",
                                          }}
                                        >
                                          Meta Description
                                        </h5>
                                        <div className="input-wrapper bg-transparent">
                                          <textarea
                                            type="text"
                                            style={{
                                              border: "none",
                                              background: "transparent",
                                            }}
                                            placeholder="Enter Page Meta Description (Keep under 160 characters including spaces, include entire keyword or keyword phrase and including spaces. (Use a complete, compelling sentence (or two)"
                                            value={metaDescription}
                                            onChange={(e) =>
                                              setMetaDescription(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>

                                      <span className="text-danger">
                                        {errors.metaDescription}
                                      </span>
                                      <div
                                        style={{
                                          backgroundColor: "#fff",
                                          marginBottom: "0",
                                          paddingTop: "20px",
                                          paddingLeft: "24px",
                                        }}
                                        className="d-flex flex-column gap-1 mb-4"
                                      >
                                        <h5 className="seo-titles">
                                          Structure Markup:
                                        </h5>
                                        <span>
                                          SEO will provide/ create a JSON code
                                          that needs to be implemented on the
                                          web page either on the header or
                                          footer. So on the CMS, we need a Front
                                          end Field so that we can enter this
                                          code.
                                        </span>
                                        <div className="input-wrapper bg-transparent">
                                          <textarea
                                            type="text"
                                            style={{
                                              border: "none",
                                              paddingLeft: "24px",
                                              height: "270px",
                                            }}
                                            className="bg-transparent"
                                            placeholder="Example:  (JSON Code) <script type='application/ld+json'>
                                            {
                                              '@context': 'https://schema.org',
                                              '@type': 'Organization',
                                              'name': '',
                                              'url': '',
                                              'logo': ''
                                            }
                                            </script>
                                            "
                                            value={globalStructureMarkup}
                                            onChange={(e) =>
                                              setGlobalStructureMarkup(
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>

                                      <span className="text-danger">
                                        {errors.globalStructureMarkup}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <Row className="accordion m-0">
                              <Col
                                className="accordion-col"
                                xs={12}
                                style={{ paddingLeft: "0", paddingRight: "0" }}
                              >
                                <Accordion
                                  className="custom-accordion"
                                  defaultActiveKey={["0"]}
                                  alwaysOpen
                                >
                                  <Accordion.Item
                                    eventKey="0"
                                    style={{ borderRadius: "0px" }}
                                  >
                                    <Accordion.Header className="social-media-links">
                                      Social Media Links
                                    </Accordion.Header>
                                    <Accordion.Body
                                      style={{ backgroundColor: "#fff" }}
                                    >
                                      <Tabs
                                        defaultActiveKey="twitter"
                                        id="uncontrolled-tab-example"
                                        className="mb-3 sub-tabs no-border"
                                      >
                                        <Tab eventKey="twitter" title="Twitter">
                                          <div
                                            className="input-wrapper"
                                            style={{
                                              marginBottom: "25px",
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <h5 className="seo-titles">
                                              Twitter Title:
                                            </h5>
                                            <input
                                              style={{ paddingLeft: "10px" }}
                                              type="text"
                                              placeholder="Enter Twitter title here..."
                                              value={twitterTitle}
                                              onChange={(e) =>
                                                setTwitterTitle(e.target.value)
                                              }
                                            ></input>
                                          </div>
                                          <span className="text-danger">
                                            {errors.twitterTitle}
                                          </span>

                                          <div
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                              marginBottom: "0",
                                              paddingLeft: "10px",
                                              borderRadius: "5px",
                                            }}
                                          >
                                            <h5
                                              className="seo-titles"
                                              style={{
                                                marginBottom: "0",
                                                paddingTop: "15px",
                                              }}
                                            >
                                              Twitter Description :
                                            </h5>
                                            <div className="input-wrapper">
                                              <textarea
                                                type="text"
                                                style={{
                                                  backgroundColor: "#f2f2f2",
                                                  border: "none",
                                                  height: "270px",
                                                }}
                                                value={twitterDescription}
                                                onChange={(e) =>
                                                  setTwitterDescription(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <span className="text-danger">
                                              {errors.twitterDescription}
                                            </span>
                                          </div>
                                        </Tab>
                                        <Tab
                                          eventKey="facebook"
                                          title="Facebook"
                                        >
                                          <div
                                            className="input-wrapper"
                                            style={{
                                              marginBottom: "25px",
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <h5 className="seo-titles">
                                              Facebook Title:
                                            </h5>
                                            <input
                                              style={{ paddingLeft: "10px" }}
                                              type="text"
                                              placeholder="Enter Facebook title here..."
                                              value={facebookTitle}
                                              onChange={(e) =>
                                                setFacebookTitle(e.target.value)
                                              }
                                            ></input>
                                          </div>
                                          <span className="text-danger">
                                            {errors.facebookTitle}
                                          </span>
                                          <div
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                              marginBottom: "0",
                                              paddingLeft: "10px",
                                              borderRadius: "5px",
                                            }}
                                          >
                                            <h5
                                              className="seo-titles"
                                              style={{
                                                marginBottom: "0",
                                                paddingTop: "15px",
                                              }}
                                            >
                                              Facebook Description :
                                            </h5>
                                            <div className="input-wrapper">
                                              <textarea
                                                type="text"
                                                style={{
                                                  backgroundColor: "#f2f2f2",
                                                  border: "none",
                                                  height: "270px",
                                                }}
                                                value={facebookDescription}
                                                onChange={(e) =>
                                                  setFacebookDescription(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <span className="text-danger">
                                              {errors.facebookDescription}
                                            </span>
                                          </div>
                                        </Tab>
                                        <Tab eventKey="youtube" title="Youtube">
                                          <div
                                            className="input-wrapper"
                                            style={{
                                              marginBottom: "25px",
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <h5 className="seo-titles">
                                              Youtube Title:
                                            </h5>
                                            <input
                                              style={{ paddingLeft: "10px" }}
                                              type="text"
                                              placeholder="Enter Youtube title here..."
                                              value={youtubeTitle}
                                              onChange={(e) =>
                                                setYoutubeTitle(e.target.value)
                                              }
                                            ></input>
                                          </div>
                                          <span className="text-danger">
                                            {errors.youtubeTitle}
                                          </span>
                                          <div
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                              marginBottom: "0",
                                              paddingLeft: "10px",
                                              borderRadius: "5px",
                                            }}
                                          >
                                            <h5
                                              className="seo-titles"
                                              style={{
                                                marginBottom: "0",
                                                paddingTop: "15px",
                                              }}
                                            >
                                              Youtube Description :
                                            </h5>
                                            <div className="input-wrapper">
                                              <textarea
                                                type="text"
                                                style={{
                                                  backgroundColor: "#f2f2f2",
                                                  border: "none",
                                                  height: "270px",
                                                }}
                                                value={youtubeDescription}
                                                onChange={(e) =>
                                                  setYoutubeDescription(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <span className="text-danger">
                                              {errors.youtubeDescription}
                                            </span>
                                          </div>
                                        </Tab>
                                      </Tabs>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                </Accordion>
                              </Col>
                            </Row>
                            <Row>
                              {modalId && (
                                <div
                                  className="row"
                                  style={{
                                    justifyContent: "end",
                                    marginRight: "15px",
                                    marginTop: "15px",
                                  }}
                                >
                                  <h6
                                    className="delete"
                                    style={{
                                      border: "1px solid",
                                      borderRadius: "12px",
                                      padding: "10px 20px",
                                      width: "fit-content",
                                      marginRight: "15px",
                                      marginBottom: "0",
                                      fontSize: "18px",
                                      fontWeight: "700",
                                    }}
                                    onClick={cancelHandler}
                                  >
                                    Cancel
                                  </h6>
                                  <h6
                                    className="update"
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "700",
                                      width: "fit-content",
                                      padding: "10px 20px",
                                    }}
                                    onClick={next}
                                  >
                                    Update
                                  </h6>
                                </div>
                              )}
                            </Row>
                          </Tab>
                        </Tabs>
                        </div>
                      )}
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
            content="This action will delete this field"
            button_name="Delete Field"
            modalTitle="Delete Field?"
            delete_vehicle={deleteItem}
            show={confirmModalShow}
            onHide={handleConfirmModalClose}
          ></Confirm_modal>
        </ToastProvider>
      </div>
    </>
  );
};
export default NewPage;
