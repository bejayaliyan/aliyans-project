import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchPages } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import Confirm_modal from "../modal/confirm_modal";
import { ToastProvider } from "react-toast-notifications";
import { useToasts } from "react-toast-notifications";
import { useLocation } from 'react-router-dom';
import "./cms.scss";
import "./dashboard.scss";
import "./book_rider.scss";

const Pages = ({ userName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [pages, setPages] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();
  const [loadingShow, setLoadingShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfirmModalClose = () => setConfirmModalShow(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  useEffect(() => {
    if (!pages) getPages();
  }, []);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(pages?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = pages?.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPages = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/pages/get`).then((res) => {
      dispatch(fetchPages(res.data));
      setPages(res.data);
    });
  };

  const addNewPageHandler = () => {
    navigate(`/admin/pages/new_page`);
  };

  const updateHandler = (val) => {
    navigate(`/admin/pages/new_page/${val.id}`);
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setConfirmModalShow(true);
  };

  const deleteItem = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    setNotifyContent("Page has been Cancelled Successfully");
    setNotifyModalTitle("Page deleted");
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/page/delete`, { id: deleteId })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
          getPages();
        }
      });
  };

  const previewPageHandler = (paglink) => {    
    var url = process.env.REACT_APP_SITE_URL + paglink;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const statusHandler = (id, status) => {    
    let temp = {};
    temp.id = id;
    if (status == 1) temp.action = 1;
    if (status == 0) temp.action = 0;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/page/update`, temp)
      .then((res) => {
        if (res.status === 200) {
          addToast("Page status updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getPages();
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

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content book_rider">
        <div className="content-panel">
          <div className="content-panel__heading">
            <div className="caption cms-caption" style={{paddingBottom: "58px"}}>
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
          <div className="cms content-panel__content">
            <Row>
              <Col xs={12}>
                <div className="card">
                  <div className="card-body" style={{ padding: "42px 32px"}}>
                    <div className="card-body__header cms-table-header">
                      <div className="caption">
                        <h4
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "700",
                          }}
                        >
                          All Pages
                        </h4>
                      </div>
                      <div
                        className="button add-new-item"
                        onClick={addNewPageHandler}
                      >
                        <i className="fa fa-plus" style={{ color: "#673622"}}></i>
                        <h6>Add New Page</h6>
                      </div>
                    </div>
                    <div className="card-body__content customTable customPagination">
                      <div className="table-responsive">
                      <table className="blog" style={{ width: "100%" }}>
                        <thead>
                          <tr className="cms-tr">
                            <th className="cms-th">Page No.</th>
                            <th className="cms-th">Page Title</th>
                            <th className="cms-th">Page Description</th>
                            <th className="cms-th">Preview</th>
                            <th className="cms-th " style={{paddingRight:"30px"}} colSpan="2">
                              Status
                            </th>
                            <th colSpan="2" className="text-center cms-th">
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
                                  {val.name}
                                </td>
                                <td className="cms-td table-right-padding" style={{ width: "50%" }}>
                                  {val.short_description}
                                </td>
                                <td className="cms-td"
                                onClick={() => {                                  
                                  if (val.page_url != "" && val.page_url) {
                                    previewPageHandler(val.page_url);
                                  }
                                  else{
                                    addToast("Invalid url", {
                                      appearance: "error",
                                      autoDismiss: true,
                                      autoDismissTimeout: 3000,
                                    });
                                  }
                                }}
                                ><span className="Previewbtn">Preview</span></td>
                                <td className="cms-td d-flex justify-content-center">
                                  <h6
                                    className={`cms-action-button status  ${
                                      val.action == 1 ? "disabled" : ""
                                    }`}
                                    disabled={val.action == 1}
                                    onClick={() => {
                                      if (val.action == 0) {
                                        statusHandler(val.id, 1);
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
                                      }
                                    }}
                                  >
                                    Inactive
                                  </h6>
                                </td>
                                <td className="cms-td">
                                  <div
                                    className="cms-action-button cms-edit-button d-flex gap-1 update m-0"
                                    onClick={() => updateHandler(val)}
                                  >
                                    <i className="fa-regular fa-floppy-disk cms-action-button-icon p-0"></i>
                                    <h6>Edit</h6>
                                  </div>
                                </td>
                                <td className="cms-td">
                                  <div
                                    className="cms-action-button cms-delete-button delete gap-1"
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
                        <Pagination.Prev className="customPrev"/>
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
          content="This action will delete this page"
          button_name="Delete Page"
          modalTitle="Delete Page?"
          delete_vehicle={deleteItem}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  );
};

export { Pages };
