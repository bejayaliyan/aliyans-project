import React, { useState, useEffect } from "react";
import { Row, Col, CloseButton, Modal } from "react-bootstrap";
import Confirm_modal from "../modal/confirm_modal";
import Notification_modal from "../modal/notification_modal";
import "./dashboard.scss";
import "./vehicle.scss";
import { Link } from "react-router-dom";
import Sidebar from "./sidebar.js";
import { useDispatch } from "react-redux";
import { select_vehicle } from "../../../redux/actions/VehiclestateActions";
import axios from "axios";
import ImageUploading from "react-images-uploading";
import UserIcon from "../components/userIcon";
import { BellPic } from "../components/bellPic";
import { DynamicTimer } from "../components/timer";
import LoadingShow from "../components/LoadingShow";
import ReactQuill from "react-quill";
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const Vehicle = () => {
  const [loadingShow, setLoadingShow] = useState(false);
  const [modalshow, setModalshow] = useState(false);
  const [modaltitle, setModaltitle] = useState("Add New Vehicel");  
  const handleModalClose = () => setModalshow(false);
  const [modalId, setModalId] = useState();
  const [modalImageurl, setModalImageUrl] = useState([]);
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState([]);
  const [modalName, setModalName] = useState();
  const [modalRate, setModalRate] = useState();
  const [modalPassenger, setModalPassenger] = useState();
  const [modalBag, setModalBag] = useState();
  const [modalCarDetails, setModalCarDetails] = useState();
  // const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const handleConfirmModalClose = () => setConfirmModalShow(false);
  const maxNumber = 10;
  const [errors, setErrors] = useState([]);
  const handleEditorChange = (html) => {
    setModalCarDetails(html);
  };
  const handleUpdateModal = (key) => {
    // setImages([]);
    setCoverImage([]);
    setDetailImages([]);
    setModalImageUrl(vehicles[key].imgurls);
    setModalBag(vehicles[key].max_bags);
    setModalRate(vehicles[key].rate);
    setModalCarDetails(vehicles[key].car_details);
    setModalName(vehicles[key].name);
    setModalPassenger(vehicles[key].max_passenger);
    setModalId(vehicles[key].id);
    setModalshow(true);
    setModaltitle("Update this Vehicle");
  };

  const handleModalShow = () => {
    setModalshow(true);
    setModaltitle("Add new vehicle");

    // setImages([]);
    setCoverImage([]);
    setDetailImages([]);
    setModalImageUrl([]);
    setModalBag("");
    setModalRate("");
    setModalCarDetails("");
    setModalName("");
    setModalPassenger("");
    //updateVehicle();
    setModalId("");
  };

  const [notificationModalShow, setNotificationModalShow] = useState(false);
  
  const delete_vehicle = () => {    
    setLoadingShow(true);
    setConfirmModalShow(false);
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/delete`, {
        // .post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/delete`, {
        id: deleteId,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoadingShow(false);
          dispatch(select_vehicle(res.data));
          setVehicles(res.data);
          setNotificationModalShow(true);

          let vehicleName = vehicles.find(v=>v.id == deleteId).name;
          let dateTime = notificationDateTimeFormat(new Date());
          let notificationObj = {
            data:"Delete Vehicle",
            is_read: 0,
            user_to_notify:0,
            notification_type: 15, // VEHICLE DELETED
            tagline: JSON.stringify({
              VehicleName: vehicleName,
              AdminTagline:"Deleted Vehicle " + vehicleName + " at " + dateTime,
              UserTagline:"",
              DriverTagline:"",                 
            })
          }
          postToNotification(notificationObj)
        }
      });
  };
  const onImageTempRemove = (index) => {
    var updatedList = Array.from(modalImageurl);
    const currentindex = updatedList.findIndex(x => x.id == index);
    if (Array.isArray(currentindex)) {
      currentindex.forEach(function (i) {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(currentindex, 1);
    }
    setModalImageUrl(updatedList);
  };
  const onChange = (customValue) => (imageList, addUpdateIndex) => {
    if (customValue == "coverImage") setCoverImage(imageList);
    if (customValue == "detailImages") setDetailImages(imageList);

    // setImages(imageList);
    let filesize = 0;
    for (let i = 0; i < imageList.length; i++) {
      filesize = filesize + imageList[i].file.size;
    }
    // if (filesize > 500 * 1024 * 5) setErrors({ file: "image size is too big" });
    if (filesize > 500 * 1024) setErrors({ file: "image size is too big" });
    else if (!imageList) setErrors({ file: "image file is required" });
    else setErrors({ file: "" });
  };
  const validate = (value) => {
    if (!value) {
      return "Field is required";
    }
  };
  const checkIfnum = (e) => {
    if (e.target.value == "") return true;
    if (Number(e.target.value) != e.target.value) return false;
    if (e.target.value < 1) return false;
    return true;
  };
  const updateVehicle = async () => {
    const formData = new FormData();
    // let temp_files = []
    let temp_cover_files = [];
    let temp_detail_files = [];
    // if (images)
    //     images.map((image)=>{
    //         temp_files.push(image.file)
    //     })
    if (coverImage)
      coverImage.map((image) => {
        temp_cover_files.push({ title: "coverImage", file: image.file });
      });
    if (detailImages)
      detailImages.map((image) => {
        temp_detail_files.push({ title: "detailImages", file: image.file });
      });

    // {temp_files.map(file=>{
    //     formData.append("uploadImages", file);
    //   });}
    {
      temp_cover_files.map((file) => {
        formData.append("uploadImages", file.file, file.title);
      });
    }
    {
      temp_detail_files.map((file) => {
        formData.append("uploadImages", file.file, file.title);
      });
    }
    let temp = {};
    temp.name = modalName;
    temp.max_passenger = modalPassenger;
    temp.rate = modalRate;
    temp.max_bags = modalBag;
    temp.car_details = modalCarDetails;
    // temp.images = images;
    temp.coverImage = coverImage;
    temp.detailImages = detailImages;
    const validationErrors = {};
    let error = validate(modalName);
    // if (!images)
    if (!coverImage || !detailImages)
      validationErrors["file"] = "image is required";
    if (error && error.length > 0) validationErrors["vehicleName"] = error;
    error = validate(modalRate);
    if (error && error.length > 0) validationErrors["rate"] = error;
    error = validate(modalPassenger);
    if (error && error.length > 0) validationErrors["passenger"] = error;
    error = validate(modalBag);
    if (error && error.length > 0) validationErrors["bag"] = error;
    // error = validate(modalCarDetails);
    // if (error && error.length > 0) validationErrors["carDetails"] = error;
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else if (errors && errors.file && errors.file.length > 0) {
      console.log("error");
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);
      // const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/upload`,formData, {
      const result = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/vehicle/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            boundary: "${form_data._boundary}",
          },
        }
      );
      temp.urls = [];
      if (modalImageurl) modalImageurl.map((val) => temp.urls.push(val.id));
      if (result.data.data)
        result.data.data.map((val) => temp.urls.push(val.id));

      // axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/update`,temp)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/update`, temp)
        .then((res) => {
          Fetchdata();
          // setImages([]);
          setCoverImage([]);
          setDetailImages([]);
          setModalImageUrl([]);
          setModalBag("");
          setModalRate("");
          setModalCarDetails("");
          setModalName("");
          setModalPassenger("");
          setModalshow(false);
          //updateVehicle();

            let dateTime = notificationDateTimeFormat(new Date());
            let notificationObj = {
              data: "Update Vehicle",
              is_read: 0,
              user_to_notify:0,
              notification_type: 14, // VEHICLE UPDATED
              tagline: JSON.stringify({
                VehicleName: temp.name,  
                AdminTagline:"Updated Vehicle " + temp.name + " at " + dateTime,
                UserTagline:"",
                DriverTagline:"",               
              })
            }
            postToNotification(notificationObj);
        });
    } else {
      setLoadingShow(true);
      // const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/upload`,formData, {
      const result = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/vehicle/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            boundary: "${form_data._boundary}",
          },
        }
      );
      temp.urls = [...result.data.data];
      // axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/create`,temp)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/create`, temp)
        .then((res) => {
          Fetchdata();
          setModalshow(false);

            let dateTime = notificationDateTimeFormat(new Date());
            let notificationObj = {
              data: "New Vehicle Added",
              is_read: 0,
              user_to_notify:0,
              notification_type: 5, // VEHICLE ADDED
              tagline: JSON.stringify({
                VehicleName: temp.name,       
                AdminTagline:"New Vehicle Added " + temp.name + " at " + dateTime,                      
                UserTagline:"",
                DriverTagline:"",
              })
            }
            postToNotification(notificationObj)
        });
    }
  };
  const handleNotificationModalClose = () => setNotificationModalShow(false);
  const [deleteId, setDeleteId] = useState();
  const handleDeleteModal = (id) => {
    setDeleteId(id);
    setConfirmModalShow(true);
  };
  const Fetchdata = () => {
    // axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicle/get`)
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicle/get`).then((res) => {
      dispatch(select_vehicle(res.data));
      setVehicles(res.data);
      setLoadingShow(false);
    });
  };
  useEffect(() => {
    Fetchdata();
  }, []);

  const postToNotification = (data) => {        
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
}

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="admin-vehicle content">
        <div className="content-panel">
          <div className="content-panel__heading">
            <div className="caption">
              <h5>Registered Vehicles</h5>
              <DynamicTimer />
            </div>
            <div className="dropdown">
              <div className="nav-item">
                <div className="button" onClick={handleModalShow}>
                  <i className="fa fa-plus"></i>
                  <h6>Add vehicle</h6>
                </div>
              </div>
              <div className="nav-item">
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
                  <div className="card-body">
                    <div className="card-body__header">
                      <div className="caption">
                        <h5 style={{ textTransform: "capitalize" }}>Cars</h5>
                      </div>
                    </div>
                    <div className="card-body__content">
                      <table className="vehicle">
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Rate</th>
                          <th>Max Passenger</th>
                          <th>Max Bags</th>
                          <th></th>
                          <th></th>
                        </tr>
                        {vehicles.map((val, key) => {
                          return (
                            <tr key={key}>
                              {/* <td>
                                {val.imgurls[0] ? (
                                  <img
                                    src={`${
                                      process.env.REACT_APP_IMAGE_BASE_URL +
                                      val.imgurls[0].name
                                    }`}
                                    alt="image11"
                                    width="195px"
                                    height="112px"
                                  />
                                ) : (
                                  ""
                                )}
                              </td> */}
                              <td>
                                {val.imgurls[0] ? (
                                  <div style={{width:'178px', height: '120px'}}>
                                    <img
                                      src={`${val.imgurls[0].name}`}
                                      alt="image11"
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                      }}
                                      height="120px"
                                    />
                                  </div>

                                ) : (
                                  ""
                                )}
                              </td>
                              <td>{val.name}</td>
                              <td>${val.rate}</td>
                              <td>{val.max_passenger}</td>
                              <td>{val.max_bags}</td>
                              <td>
                                <h6
                                  className="delete"
                                  onClick={() => handleDeleteModal(val.id)}
                                >
                                  delete
                                </h6>
                              </td>
                              <td>
                                <h6
                                  className="update"
                                  onClick={() => handleUpdateModal(key)}
                                >
                                  update
                                </h6>
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Modal
        className="vehicle-modal driver-modal"
        show={modalshow}
        onHide={handleModalClose}
        dialogClassName="modal-100w"
        centered
      >
        <Modal.Body>
          <Row>
            <Col md={6}>
              <div className="modal-left pd84">
                <h5>{modaltitle}</h5>

                <div
                  className="modal-left__thumb"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div style={{ width: "100%" }}>
                    <ImageUploading
                      multiple
                      value={coverImage}
                      onChange={onChange("coverImage")}
                      maxNumber={maxNumber}
                      dataURLKey="data_url"
                      acceptType={['jpg','png', 'jpeg']}
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        dragProps,
                      }) => (
                        <div>
                          <div
                            className=""
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              position: "relative",
                            }}
                          >
                            <h6
                              onClick={onImageUpload}
                              {...dragProps}
                              className="delete"
                            >
                              Add Cover Image &nbsp;
                            </h6>
                          </div>
                          <div
                            className="modal-left__thumb driver-img__wrapper"
                            style={{ display: "grid", marginTop: "50px" }}
                          >
                            {modalImageurl
                              ? modalImageurl.filter((val) => val.name.includes("coverImage")).map((val, index) => {
                                // const imageUrl = val.urls
                                //   ? JSON.parse(val.urls)[0]?.name
                                //   : null;                                  
                                const imageUrl = val.name;
                                return (
                                  <div
                                    style={{ display: "relative", width: '110px', height: '120px' }}
                                    key={index}

                                  >
                                    {/* <img src={`${process.env.REACT_APP_IMAGE_BASE_URL + val.name}`} width="94px" height="94px" alt="car" /> */}
                                    {/* <img
                                        src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${imageUrl}`}
                                        width="94px"
                                        height="94px"
                                        alt="car"
                                      /> */}
                                    <img
                                      src={`${imageUrl}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        padding: "8px",
                                        objectFit: 'contain'
                                      }}
                                      height="120px"
                                      alt="car"
                                      className="BorderRadiusNone"
                                    />
                                    <CloseButton
                                      onClick={() => onImageTempRemove(val.id)}
                                      style={{ position: "absolute" }}
                                    />
                                  </div>
                                );
                              })
                              : ""}
                            {imageList.map((image, index) => (
                              <div
                                key={index}
                                className="image-item"
                                style={{ position: "relative", width: '110px', height: '120px' }}
                              >
                                <img
                                  src={image.data_url}
                                  alt=""
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    padding: "8px",
                                    objectFit: 'contain'
                                  }}
                                  height="120px"
                                  className="BorderRadiusNone"
                                />
                                <CloseButton
                                  onClick={() => onImageRemove(index)}
                                  style={{ position: "absolute" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </ImageUploading>
                    <span className="text-danger">{errors.file}</span>
                  </div>
                </div>
                <div
                  className="modal-left__thumb"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div style={{ width: "100%" }}>
                    <ImageUploading
                      multiple
                      value={detailImages}
                      onChange={onChange("detailImages")}
                      maxNumber={maxNumber}
                      dataURLKey="data_url"
                      acceptType={['jpg','png', 'jpeg']}
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        dragProps,
                      }) => (
                        <div style={{ marginTop: "50px" }}>
                          <div
                            className="btns"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              position: "relative",
                            }}
                          >
                            <h6
                              onClick={onImageUpload}
                              {...dragProps}
                              className="delete"
                            >
                              Add Detail Images &nbsp;
                            </h6>
                          </div>
                          <div
                            className="modal-left__thumb driver-img__wrapper"
                            style={{ display: "grid", marginTop: "50px" }}
                          >
                            {modalImageurl
                              ? modalImageurl.filter((val) => val.name.includes("detailImages")).map((val, index) => {
                                // const imageUrl = val.urls
                                //   ? JSON.parse(val.urls)[0]?.name
                                //   : null;
                                
                                const imageUrl = val.name;
                                return (
                                  <div
                                    style={{ display: "relative", width: '110px', height: '120px' }}
                                    key={index}
                                  >
                                    {/* <img src={`${process.env.REACT_APP_IMAGE_BASE_URL + val.name}`} width="94px" height="94px" alt="car" /> */}
                                    {/* <img
                                        src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${imageUrl}`}
                                        width="94px"
                                        height="94px"
                                        alt="car"
                                      /> */}
                                    <img
                                      src={`${imageUrl}`}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        padding: "8px",
                                        objectFit: 'contain'
                                      }}
                                      height="120px"
                                      className="BorderRadiusNone"
                                      alt="car"
                                    />
                                    <CloseButton
                                      onClick={() => onImageTempRemove(val.id)}
                                      style={{ position: "absolute" }}
                                    />
                                  </div>
                                );
                              })
                              : ""}
                            {imageList.map((image, index) => (
                              <div
                                key={index}
                                className="image-item"
                                style={{ position: "relative", width: '178px', height: '120px' }}

                              >
                                <img
                                  src={image.data_url}
                                  alt=""
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    padding: "8px",
                                    objectFit: 'contain'
                                  }}
                                  height="120px"
                                  className="BorderRadiusNone"
                                />
                                <CloseButton
                                  onClick={() => onImageRemove(index)}
                                  style={{ position: "absolute" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </ImageUploading>
                    <span className="text-danger">{errors.file}</span>
                  </div>
                </div>

                {/* <ImageUploading
                                            multiple
                                            value={images}
                                            onChange={onChange}
                                            maxNumber={maxNumber}
                                            dataURLKey="data_url"
                                        >
                                            {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps
                                            }) => (
                                            <>                                         
                                                <h6  onClick={onImageUpload} {...dragProps}>
                                                        Add image
                                                        &nbsp;
                                                </h6>
                                                <div className="modal-left__thumb" style={{display:'grid'}}> 
                                                    {modalImageurl ? modalImageurl.map((val,index)=>(
                                                        <div style={{display:'inline-table'}}>
                                                            <img src={`${process.env.REACT_APP_IMAGE_BASE_URL+val.name}`} width="275px" height="200px"  alt="car"/>
                                                            <CloseButton onClick={() => onImageTempRemove(index)}/>
                                                        </div>
                                                      )):''}
                                                    {imageList.map((image, index) => (
                                                        
                                                    <div key={index} className="image-item" style={{display:'inline-block'}}>
                                                        <img src={image.data_url} alt="car"  width="275px" height="200px"  />
                                                        <CloseButton onClick={() => onImageRemove(index)}/>
                                                    </div>
                                                    ))}
                                                </div>
                                            </>
                                            )}
                                        </ImageUploading>
                                        <span className="text-danger">{errors.file}</span> */}
              </div>
            </Col>
            <Col md={6}>
              <div className="modal-right pd84">
                <div className="input-wrapper">
                  <h5>Name</h5>
                  <input
                    type="text"
                    name="vehicleName"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                  ></input>
                </div>
                <span className="text-danger">{errors.vehicleName}</span>

                <div className="input-wrapper">
                  <h5>Rate</h5>
                  <input
                    type="text"
                    value={modalRate}
                    name="rate"
                    onChange={(e) =>
                      checkIfnum(e)
                        ? setModalRate(e.target.value)
                        : setModalRate(modalRate)
                    }
                  ></input>
                </div>
                <span className="text-danger">{errors.rate}</span>

                <div className="input-wrapper">
                  <h5>Max Passenger</h5>
                  <input
                    type="text"
                    minValue="1"
                    name="passenger"
                    value={modalPassenger}
                    onChange={(e) =>
                      checkIfnum(e)
                        ? setModalPassenger(e.target.value)
                        : setModalPassenger(modalPassenger)
                    }
                  ></input>
                </div>
                <span className="text-danger">{errors.passenger}</span>
                <div className="input-wrapper">
                  <h5>Max Bags</h5>
                  <input
                    type="number"
                    name="bag"
                    value={modalBag}
                    onChange={(e) =>
                      checkIfnum(e)
                        ? setModalBag(e.target.value)
                        : setModalBag(modalBag)
                    }
                    onKeyDown={(e) => {
                      // Prevent the "E" key press from occurring
                      if (e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                  ></input>
                </div>
                <span className="text-danger">{errors.bag}</span>
                <h5>Car Details</h5>
                <div className="input-wrapper">
                  <ReactQuill
                    value={modalCarDetails}
                    onChange={handleEditorChange}
                  />
                </div>
                <span className="text-danger">{errors.content}</span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h6 className="update" type="submit" onClick={updateVehicle}>
                    {" "}
                    {modaltitle}
                  </h6>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <Confirm_modal
        classProp="modal"
        content="Do you want to delete this vehicle from the record?"
        button_name="delete"
        modalTitle="Delete the Vehicle"
        delete_vehicle={delete_vehicle}
        show={confirmModalShow}
        onHide={handleConfirmModalClose}
      ></Confirm_modal>
      <Notification_modal
        content="Vehicle has been Deleted Successfully"
        modalTitle="Vehicle deleted"
        show={notificationModalShow}
        onHide={handleNotificationModalClose}
      ></Notification_modal>
      <LoadingShow show={loadingShow}></LoadingShow>
    </div>
  );
};

export { Vehicle };
