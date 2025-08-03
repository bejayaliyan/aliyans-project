import React, { useEffect, useState } from 'react'
import Sidebar from "../pages/sidebar";
import { DynamicTimer } from '../components/timer';
import { BellPic } from '../components/bellPic';
import { Link } from 'react-router-dom';
import UserIcon from '../components/userIcon';
import { Col, Pagination, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchPages } from "../../../redux/actions/UserstateActions";
import "./cms.scss";
import "./dashboard.scss";
import "./book_rider.scss";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Confirm_modal from "../modal/confirm_modal";

const Manage_meta_tag = ({ userName }) => {
  const dispatch = useDispatch();
  const [metaTagName, setMetaTagName] = useState();
  const [metaTagNameContant, setMetaTagNameContant] = useState();
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { pathname } = useLocation();
  const [errors, setErrors] = useState([]);
  const [modalId, setModalId] = useState(0);
  const { addToast } = useToasts();
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();
  const handleConfirmModalClose = () => setConfirmModalShow(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!pages) getMetaTags();
  }, []);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(pages?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = pages?.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getMetaTags = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/metatag/get`).then((res) => {
      dispatch(fetchPages(res.data));
      setPages(res.data);
    });
  };

  const updateHandler = (val) => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/metatag/${val.id}`)
      .then((res) => {
        setErrors([]);
        setMetaTagName(res.data?.tag_name);
        setMetaTagNameContant(res.data?.tag_content);
        setModalId(res.data?.id);
      });
  };

  const validate = (value) => {
    if (!value) {
      return "Field is required";
    }
  };

  const next = () => {
    const validationErrors = {};
    let error = validate(metaTagName);
    if (error && error.length > 0) validationErrors["metaTagName"] = error;

    error = validate(metaTagNameContant);
    if (error && error.length > 0) validationErrors["metaTagNameContant"] = error;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else if (errors && errors.file && errors.file.length > 0) {
    } else {
      // setActive(true);
      submit();
    }
  }

  const submit = async () => {

    let temp = {};
    temp.tag_name = metaTagName;
    temp.tag_content = metaTagNameContant;

    if (errors && errors.file && errors.file.length > 0) {
    }
    else if (modalId > 0) {
      temp.id = modalId;
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/metatag/update`, temp)
        .then((res) => {
          setMetaTagName('');
          setMetaTagNameContant('');
          setModalId(0);
          addToast("Meta tag updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getMetaTags();
        });
    }
    else {

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/metatag/create`, temp)
        .then((res) => {
          setMetaTagName('');
          setMetaTagNameContant('');
          setModalId(0);
          addToast("Meta tag created successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getMetaTags();
        })
        .catch((err) => {
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
    }
  }

  const deleteHandler = (id) => {    
    setDeleteId(id);
    setConfirmModalShow(true);
  };

  const deleteItem = () => {
    setConfirmModalShow(false);
    setNotifyContent("MetaTag has been Cancelled Successfully");
    setNotifyModalTitle("MetaTag deleted");
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/metatag/delete`, { id: deleteId })
      .then((res) => {
        if (res.status === 200) {
          getMetaTags();
        }
      });
  };

  return (
    <div>
      <>
        <div className="dashboard">
          <Sidebar />
          <div className="content book_rider service-page">
            <div className="content-panel">
              <div className="content-panel__heading">
                <div
                  className="caption cms-caption"
                  style={{ paddingBottom: "0" }}
                >
                  <h5>Welcome, {userName}</h5>
                  <DynamicTimer />
                </div>
                <div className="dropdown gap-5">
                  <div className="nav-item bell m-0">
                    <div className="svg-container">
                      <Link to="/admin/notification">
                        <BellPic />
                      </Link>
                    </div>
                  </div>

                  <UserIcon></UserIcon>
                </div>
              </div>

              <div className="cms content-panel__content">
                <Row>
                  <Col xs={12}>
                    <div className="card" style={{ border: "none" }}>
                      <div className="card-body" style={{ padding: "30px 20px" }}>
                        <div
                          className="card-body__content"
                          style={{ marginBottom: "60px" }}
                        >
                          <div className="input-wrapper">
                            <h5>Name:</h5>
                            <input
                              type="text"
                              placeholder="Enter Meta Tag Name"
                              className="ml24"
                              value={metaTagName}
                              onChange={(e) => setMetaTagName(e.target.value)}
                            ></input>
                          </div>
                          <span className="text-danger">{errors.metaTagName}</span>

                          <div className="input-wrapper">
                            <h5>Content:</h5>
                            <input
                              type="text"
                              placeholder="Enter Meta Tag Content"
                              className="ml24"
                              value={metaTagNameContant}
                              onChange={(e) => setMetaTagNameContant(e.target.value)}
                            ></input>
                          </div>
                          <span className="text-danger">{errors.metaTagNameContant}</span>
                        </div>
                        <div className="card-body__content  customTable customPagination">
                          <div className='d-flex justify-content-end mb-4'>
                            <a href='javascript:;' style={{ background: "#F4730E", color: "#fff", fontSize: "18px", padding: "14px 53px", borderRadius: "12px", textDecoration: "none" }}
                              onClick={next}
                            >Add</a>
                          </div>
                          <div className="table-responsive">
                            <table className="blog" style={{ width: "100%" }}>
                              <thead>
                                <tr className="cms-tr">
                                  <th className="cms-th" style={{ width: "112px" }}>ID</th>
                                  <th className="cms-th" style={{ width: "330px" }}>Name</th>
                                  <th className="cms-th" style={{ width: "414px" }}>Content</th>
                                  <th colSpan="2" className="cms-th">
                                    Actions
                                  </th>
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
                                        <span className="cms-id">{10 * (currentPage - 1) + (key + 1)}</span>
                                      </td>
                                      <td className="cms-td" style={{ width: "10%" }}>
                                        {val.tag_name}
                                      </td>
                                      <td className="cms-td table-right-padding" style={{ width: "50%" }}>
                                        {val.tag_content}
                                      </td>
                                      <td className="cms-td">
                                        <div
                                          className="cms-action-button cms-edit-button d-inline-flex gap-1 update"
                                          onClick={() => updateHandler(val)}
                                        >
                                          <i className="fa-regular fa-floppy-disk cms-action-button-icon p-0"></i>
                                          <h6>Edit</h6>
                                        </div>
                                      </td>
                                      <td className="cms-td">
                                        <div
                                          className="cms-action-button cms-delete-button delete d-inline-flex gap-1"
                                          onClick={() => deleteHandler(val.id)}
                                        >
                                          <i className="fa-regular fa-trash-can cms-action-button-icon p-0"></i>
                                          <h6>Delete</h6>
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
                            {Array.from({ length: totalPages }).map((_, index) => (
                              <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                              >
                                {" "}
                                {index + 1}
                              </Pagination.Item>
                            ))}
                            <Pagination.Next className="customNext" />
                          </Pagination>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </>
      <ToastProvider>
        <Confirm_modal
          classProp="modal"
          content="This action will delete this meta tag"
          button_name="Delete Meta Tag"
          modalTitle="Delete Meta Tag?"
          delete_vehicle={deleteItem}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  )
}
export { Manage_meta_tag };

