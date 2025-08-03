import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchServices } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import Confirm_modal from "../modal/confirm_modal";
import { ToastProvider } from "react-toast-notifications";
import { useToasts } from "react-toast-notifications";
import "./dashboard.scss";
import "./book_rider.scss";
import "./service_page.scss";

const Services = ({ userName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [services, setServices] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();
  const [loadingShow, setLoadingShow] = useState(false);
  const [pageKey, setPageKey] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfirmModalClose = () => setConfirmModalShow(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(services?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = services?.slice(firstIndex, lastIndex);
  console.log("What is this: ", services?.slice(firstIndex, lastIndex));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (!services) getServices();
  }, []);

  const getServices = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/services/get`)
      .then((res) => {
        dispatch(fetchServices(res.data));
        setServices(res.data.reverse());
      });
  };

  const addNewServiceHandler = () => {
    navigate(`/admin/services/new_service`);
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setPageKey(null);
    setConfirmModalShow(true);
  };

  const updateHandler = (val) => {
    navigate("/admin/services/new_service", { state: { data: val } });
  };

  const deleteItem = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    setNotifyContent("Service has been Cancelled Successfully");
    setNotifyModalTitle("Service deleted");
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/service/delete`, {
        id: deleteId,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
          getServices();
        }
      });
  };

  const statusHandler = (id, status) => {
    let temp = {};
    temp.id = id;
    if (status == 1) temp.action = 1;
    if (status == 0) temp.action = 0;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/service/update`, temp)
      .then((res) => {
        if (res.status === 200) {
          addToast("Service status updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getServices();
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

  const previewPageHandler = (paglink) => {    
    var url = process.env.REACT_APP_SITE_URL + paglink;
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
                  <div className="card-body p-3">
                    <div className="card-body__header cms-table-header">
                      <div className="caption">
                        <h5
                          style={{
                            textTransform: "capitalize",
                            fontSize: "24px",
                            fontWeight: "700",
                            paddingLeft: "20px",
                          }}
                        >
                          services page
                        </h5>
                      </div>
                      <div
                        className="button add-new-item"
                        onClick={addNewServiceHandler}
                      >
                        <i className="fa fa-plus" style={{ color: "#673622", fontSize:"13px"}}></i>
                        <h6>Add New Service</h6>
                      </div>
                    </div>
                    <div className="card-body__content customPagination">
                      <table className="page" style={{ width: "100%" }}>
                        <thead>
                          <tr className="cms-tr">
                            <th className="cms-th">ID No.</th>
                            <th className="cms-th">Icon</th>
                            <th className="cms-th">Service Names</th>
                            <th className="cms-th">Meta Description</th>
                            <th className="cms-th">Preview</th>
                            <th className="cms-th text-center" style={{paddingRight:"30px"}} colSpan="2">
                              Status
                            </th>
                            <th className="cms-th text-center" style={{paddingRight:"30px"}} colSpan="2">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentValues?.map((val, key) => {
                            console.log("Valuew: ", val.urls);
                            // const imageUrl = ''
                            const imageUrl = val?.urls
                              ? JSON.parse(val.urls).filter((el) =>
                                  el.name.includes("iconImage")
                                )
                              : null;
                              
                            return (
                              <tr key={key} className="cms-tr">
                                <td
                                  className="cms-td"
                                  style={{
                                    width: "10%",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    fontWeight:"400"
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
                                  {val?.urls ? (
                                    <span className="cms-id">
                                      <img
                                        src={`${process.env.REACT_APP_IMAGE_BASE_URL + imageUrl[0]?.name}`}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "50%",
                                        }}
                                        alt="image44"
                                      ></img>
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td
                                  className="cms-td"
                                  style={{ width: "10%", fontSize: "18px",
                                  fontWeight:"400" }}
                                >
                                  {val.service_name}
                                </td>
                                <td
                                  className="cms-td table-right-padding"
                                  style={{ width: "60%" }}
                                >
                                  {val.heading_two}
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
                                <td className="cms-td"></td>
                                <td className="cms-td d-flex">
                                  <div
                                    className="update cms-action-button cms-edit-button"
                                    onClick={() => updateHandler(val)}
                                  >
                                    <i className="fa-regular fa-floppy-disk cms-action-button-icon"></i>
                                    <h6>Edit</h6>
                                  </div>
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
          content="This action will delete this service"
          button_name="Delete Service"
          modalTitle="Delete Service?"
          delete_vehicle={deleteItem}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  );
};

export { Services };
