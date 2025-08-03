import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchComments } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import "./dashboard.scss";
import "./book_rider.scss";
import { useToasts } from "react-toast-notifications";

const CommentApproval = ({ userName }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [isApproveComment, setIsApproveComment] = useState();
  const [rejectComment, setRejectComment] = useState();
  const [comments, setComments] = useState(null);
  const [loadingShow, setLoadingShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(comments?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = comments?.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (!comments) getComments();
  }, []);

  const getComments = () => {
    // axios.get(`${process.env.REACT_APP_API_BASE_URL}/page/get`)
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/comments/get`)
      .then((res) => {
        dispatch(fetchComments(res.data));
        setComments(res.data.reverse());
      });
  };

  const acceptHandler = (id) => {
    let temp = {};
    temp.id = id;
    temp.action = 1;
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/comment/update`, temp)
      .then((res) => {
        if (res.status === 200) {
          addToast("Comment approved successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
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

  const statusHandler = (id, status) => {
    let temp = {};
    temp.id = id;
    if (status === 0) temp.action = 0;
    if (status === 1) temp.action = 1;

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/comment/update`, temp)
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          if (status === 1) {
            addToast("Comment approved successfully!", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 3000,
            });
          } else {
            addToast("Comment rejected successfully!", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 3000,
            });

          }
          getComments();
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
          <div className="cms content-panel__content">
            <Row>
              <Col xs={12}>
                <div className="card">
                  <div className="card-body p-3">
                    <div className="card-body__header">
                      <div className="caption mb-4">
                        <h5 style={{ textTransform: "capitalize" }}>
                          Approval Requests
                        </h5>
                      </div>
                    </div>
                    <div className="card-body__content">
                      <table className="blog" style={{ width: "100%" }}>
                        <thead>
                          <tr className="cms-tr">
                            <th className="cms-th">ID No.</th>
                            <th className="cms-th">Comments</th>
                            <th className="cms-th">Status</th>
                            <th className="cms-th text-center" colSpan={6}>
                              Action
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
                                  {10 * (currentPage - 1) + (key + 1)}
                                </td>
                                <td
                                  className="cms-td table-right-padding"
                                  style={{
                                    width: "70%",
                                  }}
                                >
                                  {val.text}
                                </td>
                                <td
                                  className="cms-td"
                                  style={{
                                    width: "10%",
                                  }}
                                >
                                  {val.action == 1 ? "Approved" : "Rejected"}
                                </td>
                                <td className="cms-td"></td>
                                <td className="cms-td d-flex">
                                  <div
                                    className={`update cms-action-button cms-edit-button ${
                                      val.action == 1 ? "disabled" : ""
                                    }`}
                                    onClick={() => {
                                      if (val.action == 0) {
                                        statusHandler(val.id, 1);
                                      }
                                    }}
                                  >
                                    <h6>Approve</h6>
                                  </div>
                                  <div
                                    className={`delete cms-action-button cms-delete-button ${
                                      val.action == 0 ? "disabled" : ""
                                    }`}
                                    onClick={() => {
                                      if (val.action == 1) {
                                        statusHandler(val.id, 0);
                                      }
                                    }}
                                  >
                                    <h6>Reject</h6>
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
      {/* <ToastProvider>
        <Confirm_modal
          classProp="modal"
          content={confirmModalContent}
          button_name={confirmButtonName}
          modalTitle={confirmModalTitle}
          delete_vehicle={delete_blogs}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider> */}
    </div>
  );
};

export { CommentApproval };
