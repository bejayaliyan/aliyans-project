import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchComments } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import Confirm_modal from "../modal/confirm_modal";
import { ToastProvider } from "react-toast-notifications";

const Comment = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();
  const [loadingShow, setLoadingShow] = useState(false);
  const [blogKey, setBlogKey] = useState();
  const handleConfirmModalClose = () => setConfirmModalShow(false);

  useEffect(() => {
    if (!blogs) getComments();
  }, []);

  const getComments = () => {
    // axios.get(`${process.env.REACT_APP_API_BASE_URL}/page/get`)
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/blogs/${id}`).then((res) => {
      dispatch(fetchComments(res.data));
      setBlogs(res.data);
    });
  };

  const delete_comment_modal = (id) => {
    setDeleteId(id);
    setBlogKey(null);
    setConfirmModalShow(true);
  };

  const delete_comment = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    setNotifyContent("Comment has been Cancelled Successfully");
    setNotifyModalTitle("Comment deleted");
    // axios.post(`${process.env.REACT_APP_API_BASE_URL}/page/delete`,{id:deleteId})
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/comment/delete`, { id: deleteId })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
        }
      });
    getComments();
  };
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content book_rider">
        <div className="content-panel">
          <div className="content-panel__heading">
            <div className="caption">
              <h5>Comments</h5>
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
                  <div className="card-body">
                    <div className="card-body__header">
                      <div className="caption">
                        <h5 style={{ textTransform: "capitalize" }}>
                          comments
                        </h5>
                      </div>
                    </div>
                    <div className="card-body__content">
                      <table className="blog" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Author</th>
                            <th>Comment</th>
                            <th></th>
                            {/* <th></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {blogs?.comments?.length ? (
                            blogs?.comments?.map((val, key) => {
                              return (
                                <tr key={key}>
                                  <td>
                                    {val?.comment_user?.first_name || "N/A"}
                                  </td>
                                  <td>{val?.text || "N/A"}</td>
                                  <td>
                                    <h6
                                      className="update"
                                      onClick={() => delete_comment_modal(val.id)}
                                    >
                                      Delete
                                    </h6>
                                  </td>
                                  {/* <td><h6 className='update' onClick={() => handleUpdateModal(val)}>Update</h6></td> */}
                                </tr>
                              );
                            })
                          ) : (
                            <div className="text-center">No Comments</div>
                          )}
                        </tbody>
                      </table>
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
          modalTitle="Delete this Comment"
          delete_vehicle={delete_comment}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  );
};

export { Comment };