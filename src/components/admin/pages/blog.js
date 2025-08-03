import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchBlogs } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import Confirm_modal from "../modal/confirm_modal";
import { ToastProvider, useToasts } from "react-toast-notifications";
import IconPlane from "../../../images/image 19.png";
import "./dashboard.scss";
import "./book_rider.scss";

const Blog = ({ userName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const [blogs, setBlogs] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfirmModalClose = () => setConfirmModalShow(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!blogs) getBlogs();
  }, []);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(blogs?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = blogs?.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getBlogs = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/blogs/get`).then((res) => {
      dispatch(fetchBlogs(res.data));
      setBlogs(res.data.reverse());
    });
  };

  const addNewBlogHandler = () => {
    navigate(`/admin/blogs/new_blog`);
  };

  const handleUpdateModal = (val) => {
    navigate("/admin/blogs/new_blog", { state: { data: val } });
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setConfirmModalShow(true);
  };

  const delete_item = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    // axios.post(`${process.env.REACT_APP_API_BASE_URL}/page/delete`,{id:deleteId})
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/blog/delete`, { id: deleteId })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
          getBlogs();
        }
      });
  };

  const statusHandler = (id, status) => {
    let temp = {};
    temp.id = id;
    if (status == 1) temp.action = 1;
    if (status == 0) temp.action = 0;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/blog/update`, temp)
      .then((res) => {
        if (res.status === 200) {
          addToast("Blog status updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getBlogs();
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

  const previewPageHandler = (id) => {    
    var url = process.env.REACT_APP_SITE_URL + "/blog-detail/" + id;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="dashboard cms">
      <Sidebar />
      <div className="content book_rider">
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
                <div className="card">
                  <div className="card-body ">
                    <div className="card-body__header cms-table-header">
                      <div className="caption ">
                        <h5
                          style={{
                            textTransform: "capitalize",
                            fontSize: "24px",
                            fontWeight: "700",
                          }}
                        >
                          blogs pages
                        </h5>
                      </div>
                      <div
                        className="button add-new-item"
                        onClick={addNewBlogHandler}
                      >
                        <i className="fa fa-plus" style={{color: "#673622", fontSize: "13px"}}></i>
                        <h6>Add New Blog</h6>
                      </div>
                    </div>
                    <div className="card-body__content customPagination">
                      <div className="table-responsive">
                      <table className="blog" style={{ width: "100%" }}>
                        <thead>
                          <tr className="cms-tr">
                            <th className="cms-th">ID No</th>
                            <th className="cms-th">Icon</th>
                            <th className="cms-th">Author</th>
                            <th className="cms-th">Blog Page Name</th>
                            <th className="cms-th">Preview</th>
                            <th className="cms-th">Status</th>
                            <th className="cms-th text-center" colSpan="2">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentValues?.map((val, key) => {
                            const imageUrl = val.urls
                              ? JSON.parse(val.urls)[0]?.name
                              : null;
                            return (
                              <tr key={key} className="cms-tr">
                                <td
                                  className="cms-td"
                                  style={{
                                    width: "10%",
                                    textAlign: "center",fontSize: "18px", fontWeight: "400" 
                                  }}
                                >
                                  {10 * (currentPage - 1) + (key + 1)}
                                </td>
                                <td
                                  className="cms-td"
                                  style={{
                                    width: "10%",
                                  }}
                                >
                                  <div style={{
                                      border: "1.5px solid",
                                      padding: "6px",
                                      borderRadius: "10px", width: "fit-content"}}>
                                  <img
                                    src={IconPlane}
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                      borderRadius: "50%",
                                      
                                    }}
                                    alt="image44"
                                  />
                                  </div>
                                </td>
                                <td className="cms-td" style={{ width: "10%", fontSize: "18px", fontWeight: "400" }}>
                                  {val.title}
                                </td>
                                <td
                                  className="cms-td table-right-padding"
                                  style={{ width: "60%",fontSize: "16px", fontWeight: "500"  }}
                                >
                                  {val.name}
                                </td>
                                <td className="cms-td"
                                onClick={() => {                                  
                                  previewPageHandler(val.id);
                                  // if (val.page_url != "" && val.page_url) {
                                  //   previewPageHandler(val.page_url,val.id);
                                  // }
                                  // else{
                                  //   addToast("Invalid url", {
                                  //     appearance: "error",
                                  //     autoDismiss: true,
                                  //     autoDismissTimeout: 3000,
                                  //   });
                                  // }
                                }}
                                ><span className="Previewbtn">Preview</span></td>
                                <td className="cms-td d-flex m-auto">
                                  <h6
                                    className={`cms-action-button status  ${
                                      val.action == 1 ? "disabled" : ""
                                    }`}
                                    disabled={val.action == 1}
                                    onClick={() => {
                                      if (val.action == 0) {
                                        statusHandler(val.id, 1);
                                      } else {
                                        statusHandler(val.id, 0);
                                      }
                                    }}
                                  >
                                    Active
                                  </h6>
                                  <h6
                                    className={`cms-action-button status  ${
                                      val.action == 0 ? "disabled" : ""
                                    }`}
                                    disabled={val.action == 0}
                                    onClick={() => {
                                      if (val.action == 1) {
                                        statusHandler(val.id, 0);
                                      } else {
                                        statusHandler(val.id, 1);
                                      }
                                    }}
                                  >
                                    Inactive
                                  </h6>
                                </td>
                                <td className="cms-td">
                                  <div
                                    className="update cms-action-button cms-edit-button"
                                    onClick={() => handleUpdateModal(val)}
                                  >
                                    <i className="fa-regular fa-floppy-disk cms-action-button-icon"></i>
                                    <h6>Edit</h6>
                                  </div>
                                </td>
                                <td className="cms-td d-flex">
                                  <div
                                    className="delete cms-action-button cms-delete-button"
                                    onClick={() => deleteHandler(val.id)}
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
      <ToastProvider>
        <Confirm_modal
          classProp="modal"
          content="This action will delete this blog"
          button_name="Delete Blog"
          modalTitle="Delete Blog?"
          delete_vehicle={delete_item}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  );
};

export { Blog };
