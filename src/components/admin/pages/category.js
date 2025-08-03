import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import Confirm_modal from "../modal/confirm_modal";
import { ToastProvider, useToasts } from "react-toast-notifications";
import "./dashboard.scss";
import "./book_rider.scss";

const Category = ({ userName }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  const [blogKey, setBlogKey] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfirmModalClose = () => setConfirmModalShow(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(categories?.length / itemsPerPage);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = categories?.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (!categories) getCatogories();
  }, []);

  const getCatogories = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/categories/get`)
      .then((res) => {
        dispatch(fetchCategories(res.data));
        setCategories(res.data.reverse());
      });
  };

  const addNewCategoryHandler = () => {
    navigate(`/admin/blogs/categories/new_category`);
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setBlogKey(null);
    setConfirmModalShow(true);
  };
  const updateHandler = (val) => {
    navigate("/admin/blogs/categories/new_category", { state: { data: val } });
  };

  const delete_item = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/category/delete`, {
        id: deleteId,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          setNotificationModalShow(true);
          addToast("Category deleted successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getCatogories();
        }
      });
    getCatogories();
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
                    <div className="card-body__header cms-table-header">
                      <div className="caption">
                        <h5
                          style={{
                            textTransform: "capitalize",
                            textTransform: "capitalize",
                            fontSize: "24px",
                          }}
                        >
                          Categories
                        </h5>
                      </div>
                      <div
                        className="button add-new-item"
                        onClick={addNewCategoryHandler}
                      >
                        <i className="fa fa-plus" style={{fontSize: "13px", color: "#673622"}}></i>
                        <h6>Create Caterories</h6>
                      </div>
                    </div>
                    <div className="card-body__content">
                      <table className="blog" style={{ width: "100%" }}>
                        <thead>
                          <tr className="cms-tr">
                            <th className="cms-th">ID No</th>
                            <th className="cms-th">Name</th>
                            <th className="cms-th text-center" colSpan={2}>
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
                                    width: "10%",fontSize: "18px", fontWeight: "400"
                                  }}
                                >
                                  {10 * (currentPage - 1) + (key + 1)}
                                </td>
                                <td
                                  className="cms-td table-right-padding"
                                  style={{ width: "80%", fontSize: "18px", fontWeight: "400" }}
                                >
                                  {val.category}
                                </td>
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
          content="This action will delete this category"
          button_name="Delete Category"
          modalTitle="Delete Category?"
          delete_vehicle={delete_item}
          show={confirmModalShow}
          onHide={handleConfirmModalClose}
        ></Confirm_modal>
      </ToastProvider>
    </div>
  );
};

export { Category };
