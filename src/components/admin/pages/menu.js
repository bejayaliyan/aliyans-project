import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";

import "./dashboard.scss";
import "./book_rider.scss";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar";
import { useDispatch } from "react-redux";
import { fetchValues } from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import { useTranslation } from "react-i18next";
import Confirm_modal from "../modal/confirm_modal";
import MenuModal from "../modal/menu_modal";

const Menu = () => {
  const dispatch = useDispatch();
  const [modalshow, setModalshow] = useState(false);
  const [modaltitle, setModaltitle] = useState("add new menu");
  const [modalButtonName, setModalButtonName] = useState();
  const [modalData, setModalData] = useState();
  const [menu, setValues] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState("");
  const [confirmModalTitle, setconfirmModalTitle] = useState("");
  const [confirmButtonName, setConfirmButtonName] = useState("");
  const [notificationModalShow, setNotificationModalShow] = useState(false);
  const [notifyContent, setNotifyContent] = useState();
  const [notifyModalTitle, setNotifyModalTitle] = useState();

  const [loadingShow, setLoadingShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { t } = useTranslation();
  const handleConfirmModalClose = () => setConfirmModalShow(false);
  const handleModalClose = () => setModalshow(false);
  const handleModalShow = () => {
    setModalshow(true);
    setModaltitle("add new menu");
  };

  useEffect(() => {
    if (!menu) getMenu();
  }, []);

  const itemsPerPage = 10; // Number of items per page

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentValues = menu?.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(menu?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getMenu = () => {
    // axios.get(`${process.env.REACT_APP_API_BASE_URL}/menu/get`)
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/menus/get`)
      .then((res) => {
        // dispatch(fetchValues(res.data));
        setValues(res.data);
      });
  };
  const openMenuModal = () => {
    setModalButtonName("add menu");
    handleModalShow();
  };
  const delete_menu_modal = (id) => {
    setDeleteId(id);
    // setPageKey(null)
    setConfirmModalShow(true);
  };
  const handleUpdateModal = (val) => {
    setModalshow(true);
    setModalData(val);
    setModaltitle("Update Vale Information");
    setModalButtonName("Menu menu");
  };
  const notify = () => {
    setNotificationModalShow(true);
    setNotifyContent("Menu has been Added Successfully");
    setNotifyModalTitle("Menu added");
  };
  const delete_menu = () => {
    setConfirmModalShow(false);
    setLoadingShow(true);
    setNotifyContent("Menu has been Cancelled Successfully");
    setNotifyModalTitle("Menu deleted");
    // axios.post(`${process.env.REACT_APP_API_BASE_URL}/menu/delete`,{id:deleteId})
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/menu/delete`, { id: deleteId })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          // getMenu()
          setNotificationModalShow(true);
        }
      });
    getMenu();
  };
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content book_rider">
        <div className="content-panel">
          <div className="content-panel__heading">
            <div className="caption">
              <h5>Menus</h5>
              <DynamicTimer />
            </div>
            <div className="dropdown">
              <div className="nav-item">
                <div className="button" onClick={openMenuModal}>
                  <i className="fa fa-plus"></i>
                  <h6>Add Menu</h6>
                </div>
              </div>
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
                        <h5 style={{ textTransform: "capitalize" }}>menu</h5>
                      </div>
                    </div>
                    <div className="card-body__content">
                      <table className="menu" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Label</th>
                            <th>Link</th>
                            <th>Item</th>
                            <th>Position</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentValues?.map((val, key) => {
                            return (
                              <tr key={key}>
                                <td>{val.type || "N/A"}</td>
                                <td>{val.label || "N/A"}</td>
                                <td>{val.link || "N/A"}</td>
                                <td>{val.item || "N/A"}</td>
                                <td>{val.position || "N/A"}</td>
                                <td>
                                  <h6
                                    className="delete"
                                    onClick={() => delete_menu_modal(val.id)}
                                  >
                                    Delete
                                  </h6>
                                </td>
                                <td>
                                  <h6
                                    className="update"
                                    onClick={() => handleUpdateModal(val)}
                                  >
                                    Update
                                  </h6>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <Pagination className="pagination">
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <MenuModal
        modalshow={modalshow}
        val={modalData}
        getValues={getMenu}
        handleModalClose={handleModalClose}
        modaltitle={modaltitle}
        buttonName={modalButtonName}
        notify={notify}
      ></MenuModal>
      <Confirm_modal
        classProp="modal"
        content={confirmModalContent}
        button_name={confirmButtonName}
        modalTitle={confirmModalTitle}
        delete_vehicle={delete_menu}
        show={confirmModalShow}
        onHide={handleConfirmModalClose}
      ></Confirm_modal>
    </div>
  );
};

export { Menu };
