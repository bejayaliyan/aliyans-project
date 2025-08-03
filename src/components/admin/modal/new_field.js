import { useEffect, useState, useCallback } from "react";
import { Row, Col, CloseButton } from "react-bootstrap";
import ImageUploading from "react-images-uploading";
import axios from "axios";
import ReactQuill from "react-quill";
import Sidebar from "../pages/sidebar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DynamicTimer } from "../components/timer";
import { BellPic } from "../components/bellPic";
import UserIcon from "../components/userIcon";
import { useDropzone } from "react-dropzone";
import { useToasts } from "react-toast-notifications";
import "./driver_modal.scss";
import "react-quill/dist/quill.snow.css";
import "../pages/cms.scss";

const NewField = ({ userName }) => {
  const location = useLocation();
  const data = location.state ? location.state.data : null;
  const { addToast } = useToasts();

  const maxNumber = 69;
  const { id } = useParams();
  const [image, setImage] = useState();
  const [isImage, setIsImage] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [fieldName, setFieldName] = useState();
  const [fieldType, setFieldType] = useState();
  const [fieldId, setFieldId] = useState();
  const [typeNumber, setTypeNumber] = useState();
  const [typeShortText, setTypeShortText] = useState();
  const [typeRichText, setTypeRichText] = useState();
  const [typeMediaFile, setTypeMediaFile] = useState();
  const [typeDate, setTypeDate] = useState();
  const [typeTime, setTypeTime] = useState();
  const [typeJson, setTypeJson] = useState();
  const [typeBoolean, setTypeBoolean] = useState();
  const [modalId, setModalId] = useState();

  // const [blogImage, setBlogImage] = useState();

  const [modalImageurl, setModalImageUrl] = useState([]);

  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);
  const navigate = useNavigate();
  
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleFieldNameChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setFieldName(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        fieldName: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fieldName: "Field name must be less than 160 characters.",
      }));
    }
  };

  const handleFieldIdChange = (e) => {
    const inputValue = e.target.value;
    setFieldId(inputValue);
    if (inputValue.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fieldId: "",
      }));
    }
  };

  const onChange = (imageList, addUpdateIndex) => {
    setIsImageChanged(true);
    setTypeMediaFile(imageList);

    let filesize = 0;
    for (let i = 0; i < imageList.length; i++) {
      filesize = filesize + imageList[i]?.file?.size;
    }

    if (filesize > 500 * 1024 * 5) setErrors({ file: "image size is too big" });
    else setErrors((prevErrors) => ({ ...prevErrors, file: "" }));
  };

  const onImageTempRemove = (index) => {
    if (modalImageurl.length) {
      var updatedList = Array.from(modalImageurl);
      if (Array.isArray(index)) {
        index.forEach(function (i) {
          updatedList.splice(i, 1);
        });
      } else {
        updatedList.splice(index, 1);
      }
      setErrors((prevErrors) => ({ ...prevErrors, file: "Field is required" }));
      setTypeMediaFile();
      setModalImageUrl(updatedList);
    } else {
      var updatedList = Array.from(image);
      if (Array.isArray(index)) {
        index.forEach(function (i) {
          updatedList.splice(i, 1);
        });
      } else {
        updatedList.splice(index, 1);
      }
      setErrors((prevErrors) => ({ ...prevErrors, file: "Field is required" }));
      setTypeMediaFile();
      setImage(updatedList);
    }
  };

  const handleEditorChange = (html) => {
    setTypeRichText(html);
  };

  const fieldTypeChangeHandler = (e) => {
    setTypeNumber("");
    setTypeShortText("");
    setTypeRichText("");
    setTypeMediaFile("");
    setTypeDate("");
    setTypeTime("");
    setTypeJson("");
    setTypeBoolean("");
    setFieldType(e.target.value);
    if (e.target.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fieldType: "",
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
    let error = validate(fieldName);
    if (error && error.length > 0) validationErrors["fieldName"] = error;
    error = validate(fieldType);
    if (error && error.length > 0) validationErrors["fieldType"] = error;
    error = validate(fieldId);
    if (error && error.length > 0) validationErrors["fieldId"] = error;

    // error = validate(fieldType);
    if (fieldType == "number") {
      error = validate(typeNumber);
      if (error && error.length > 0) validationErrors["typeNumber"] = error;
    }
    if (fieldType == "short text") {
      error = validate(typeShortText);
      if (error && error.length > 0) validationErrors["typeShortText"] = error;
    }
    if (fieldType == "rich text") {
      error = validate(typeRichText);
      if (error && error.length > 0) validationErrors["typeRichText"] = error;
    }
    if (fieldType == "media file") {
      if (!typeMediaFile) {
        error = validate(typeMediaFile);
        validationErrors["file"] = error;
      }
    }
    if (fieldType == "date / time") {
      error = validate(typeDate);
      if (error && error.length > 0) validationErrors["typeDate"] = error;
      error = validate(typeTime);
      if (error && error.length > 0) validationErrors["typeTime"] = error;
    }
    if (fieldType == "json object") {
      error = validate(typeJson);
      if (error && error.length > 0) validationErrors["typeJson"] = error;
    }
    if (fieldType == "boolean") {
      error = validate(typeBoolean);
      if (error && error.length > 0) validationErrors["typeBoolean"] = error;
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
    if (!modalId) {
      temp.action = 0;
    }
    temp.field_name = fieldName;
    temp.field_type = fieldType;
    temp.field_id = fieldId;
    temp.page_id = id;
    temp.value =
      typeNumber ||
      typeShortText ||
      typeRichText ||
      typeMediaFile ||
      (typeDate && typeTime && `${typeDate} ${typeTime}`) ||
      typeJson ||
      typeBoolean;
    const formData = new FormData();
    let temp_blog_image_files = [];

    if (typeMediaFile) {
      typeMediaFile.map((image) => {
        if (image?.type?.includes("image")) {
          temp_blog_image_files.push({
            title: "image",
            file: image,
          });
        } else if (image?.type?.includes("video")) {
          temp_blog_image_files.push({
            title: "video",
            file: image,
          });
        } else {
          temp_blog_image_files.push({
            title: "file",
            file: image,
          });
        }
      });
    }
    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);
      if (typeMediaFile) {
        temp.value = data.value;
        if (isImageChanged) {
          temp_blog_image_files.map((file) => {
            formData.append("uploadFile", file.file, file.title);
          });
          if (fieldType == "media file") {
            const result = await axios.post(
              `${process.env.REACT_APP_API_BASE_URL}/admin/field/upload`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  boundary: "${form_data._boundary}",
                },
              }
            );
            temp.value = JSON.stringify(result.data.data);
          }
        }
      }

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/field/update`, temp)
        .then((res) => {
          setLoadingShow(false);
          addToast("Field updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/pages/new_page/${id}`);
        });
    } else {
      temp_blog_image_files.map((file) => {
        formData.append("uploadFile", file.file, file.title);
      });
      setLoadingShow(true);
      if (typeMediaFile) {
        const result = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/field/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              boundary: "${form_data._boundary}",
            },
          }
        );
        temp.value = JSON.stringify(result.data.data);
      }

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/field/create`, temp)
        .then((res) => {
          setTypeNumber("");
          setTypeShortText("");
          setTypeRichText("");
          setTypeMediaFile("");
          setTypeDate("");
          setTypeTime("");
          setTypeJson("");
          setTypeBoolean("");
          setLoadingShow(false);
          addToast("Field created successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/pages/new_page/${id}`);
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

  const addNewField = () => {
    navigate(`/admin/pages/new_page/new_field`);
  };

  useEffect(() => {
    if (data) {
      setModalId(data.id);
      setErrors([]);
      setFieldName(data.field_name);
      setFieldType(data.field_type);
      setFieldId(data.field_id);
      if (data.field_type === "number") setTypeNumber(data.value);
      if (data.field_type === "short text") setTypeShortText(data.value);
      if (data.field_type === "rich text") setTypeRichText(data.value);
      if (data.field_type === "media file") {
        setTypeMediaFile(JSON.parse(data.value));
        setModalImageUrl(JSON.parse(data.value));
      }
      if (data.field_type === "date / time") {
        const [datePart, timePart] = data.value.split(" ");
        setTypeDate(datePart);
        setTypeTime(timePart);
      }
      if (data.field_type === "json object") setTypeJson(data.value);
      if (data.field_type === "boolean") setTypeBoolean(data.value);
      setFieldName(data.field_name);
      setFieldType(data.field_type);
      setFieldId(data.field_id);
    }
  }, [data]);

  const onDrop = useCallback((acceptedFiles) => {
    setIsImage(true);
    setImage(acceptedFiles);
    onChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div className="dashboard">
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
                    <div className="card-body">
                      <div className="card-body__header">
                        <div
                          className="caption"
                          style={{ marginBottom: "70px" }}
                        >
                          <h5
                            style={{
                              textTransform: "capitalize",
                              fontSize: "24px",
                            }}
                          >
                            Add New Field
                          </h5>
                        </div>
                      </div>
                      <div className="card-body__content">
                        <div
                          className="input-wrapper"
                          style={{ marginBottom: "0" }}
                        >
                          <h5>Field Name:</h5>
                          {modalId ? (
                            <input
                              type="text"
                              placeholder="Enter Page Title (25 out of 60 max recommended characters.)"
                              value={fieldName}
                              readOnly
                              onChange={handleFieldNameChange}
                            ></input>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter Page Title (25 out of 60 max recommended characters.)"
                              value={fieldName}
                              onChange={handleFieldNameChange}
                            ></input>
                          )}
                        </div>
                        <span className="text-danger">{errors.fieldName}</span>

                        <h5
                          style={{
                            marginBottom: "0",
                            paddingBottom: "10px",
                            fontSize: "16px",
                            fontWeight: "700",
                            marginTop: "25px",
                          }}
                        >
                          Field Type:
                        </h5>
                        <div
                          className="input-wrapper"
                          style={{ width: "50%", marginBottom: "0" }}
                        >
                          <select
                            placeholder="Please select the page from dropdown to enable Global Structure Markup"
                            className="custom-dropdown field-dropdown"
                            value={fieldType}
                            style={{
                              border: "none",
                              width: "100%",
                              marginLeft: "0",
                              padding: "15px 20px",
                              backgroundColor: "rgba(242, 242, 242, 0.4)",
                            }}
                            onChange={fieldTypeChangeHandler}
                          >
                            <option value="">Select Type</option>
                            <option value="number">Number</option>
                            <option value="short text">Short Text</option>
                            <option value="rich text">Rich Text</option>
                            <option value="media file">Media File</option>
                            <option value="date / time">Date / Time</option>
                            <option value="json object">Json Object</option>
                            <option value="boolean">
                              Boolean (e.g True or False)
                            </option>
                          </select>
                        </div>
                        <span className="text-danger">{errors.fieldType}</span>

                        <div
                          className="input-wrapper"
                          style={{ marginTop: "15px", marginBottom: "0" }}
                        >
                          <h5>Field ID:</h5>
                          <input
                            type="text"
                            placeholder="Enter field id here"
                            value={fieldId}
                            onChange={handleFieldIdChange}
                          ></input>
                        </div>
                        <span className="text-danger">{errors.fieldId}</span>

                        {/* Number */}
                        {fieldType === "number" && (
                          <>
                            <h5
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.4)",
                                marginBottom: "0",
                                paddingLeft: "24px",
                                fontSize: "16px",
                                fontWeight: "700",
                                marginTop: "15px",
                                paddingTop: "20px",
                              }}
                            >
                              Value :
                            </h5>
                            <div
                              className="input-wrapper"
                              style={{ marginBottom: "25px" }}
                            >
                              <input
                                type="number"
                                style={{
                                  width: "50%",
                                  border: "none",
                                  backgroundColor: "#fff",
                                  margin: "24px",
                                  padding: "0px 24px",
                                }}
                                value={typeNumber}
                                onChange={(e) => setTypeNumber(e.target.value)}
                              ></input>
                            </div>
                            <span className="text-danger">
                              {errors.typeNumber}
                            </span>
                          </>
                        )}

                        {/* Short Text  */}
                        {fieldType === "short text" && (
                          <>
                            <h5
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.4)",
                                marginBottom: "0",
                                paddingLeft: "24px",
                                fontSize: "16px",
                                fontWeight: "700",
                                marginTop: "15px",
                                paddingTop: "20px",
                              }}
                            >
                              Value :
                            </h5>
                            <div
                              className="input-wrapper"
                              style={{ marginBottom: "25px" }}
                            >
                              <textarea
                                type="text"
                                rows="6"
                                style={{
                                  width: "92%",
                                  border: "none",
                                  backgroundColor: "#fff",
                                  margin: "24px",
                                  padding: "8px 24px",
                                }}
                                value={typeShortText}
                                onChange={(e) =>
                                  setTypeShortText(e.target.value)
                                }
                              />
                            </div>
                            <span className="text-danger">
                              {errors.typeShortText}
                            </span>
                          </>
                        )}

                        {/* Rich Text */}
                        {fieldType === "rich text" && (
                          <>
                            <div
                              className="d-flex flex-column gap-3 input-wrapper p-4"
                              style={{
                                marginBottom: "70px",
                                marginTop: "15px",
                              }}
                            >
                              <h5
                                style={{
                                  width: "100%",
                                  padding: "0px",
                                  marginBottom: "0",
                                  fontSize: "16px",
                                  fontWeight: "700",
                                }}
                              >
                                Value :
                              </h5>
                              <ReactQuill
                                className="w-100"
                                value={typeRichText}
                                onChange={handleEditorChange}
                              />
                            </div>
                            <span className="text-danger">
                              {errors.typeRichText}
                            </span>
                          </>
                        )}

                        {/* Media File */}
                        {fieldType === "media file" && (
                          <>
                            <div
                              className="row"
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.4)",
                                position: "relative",
                                marginLeft: "0",
                                marginRight: "0",
                                justifyContent: "center",
                                marginTop: "15px",
                              }}
                            >
                              <div
                                style={{
                                  marginBottom: "50px",
                                }}
                                className="p-3"
                              >
                                <h5
                                  style={{
                                    marginBottom: "0",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Value :
                                </h5>

                                <div
                                  className="modal-left__thumb driver-img__wrapper"
                                  style={{
                                    display: "grid",
                                    textAlign: "center",
                                    marginTop: "17px",
                                    paddingBottom: "50px",
                                    paddingTop: "50px",
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  <h5
                                    style={{
                                      textAlign: "center",
                                      marginBottom: "0",
                                      paddingBottom: "15px",
                                      fontSize: "16px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    Upload Images, Videos, PDFs and other files*
                                  </h5>
                                  <div
                                    style={{ margin: "0 auto" }}
                                    {...getRootProps()}
                                    className={`dropzone ${
                                      isDragActive ? "active" : ""
                                    }`}
                                  >
                                    <input {...getInputProps()} />
                                    <div
                                      className="btns field-image-button"
                                      style={{
                                        width: "fit-content",
                                      }}
                                    >
                                      <h6
                                        className="delete"
                                        style={{
                                          color: "#F4730E",
                                          border: "1px solid",
                                          borderRadius: "12px",
                                          padding: "12px 60px",
                                        }}
                                      >
                                        Upload a file Drag & drop &nbsp;
                                      </h6>
                                    </div>
                                  </div>
                                  <div style={{ margin: "0 auto" }}>
                                    {image
                                      ? image?.map((el, index) => {
                                          return (
                                            <>
                                              {el?.type?.includes("video") && (
                                                <>
                                                  <video
                                                    width="150"
                                                    height="100"
                                                    controls
                                                    poster={URL.createObjectURL(
                                                      el
                                                    )}
                                                  >
                                                    <source
                                                      src={URL.createObjectURL(
                                                        el
                                                      )}
                                                      type={el.type}
                                                    />
                                                    Your browser does not
                                                    support the video tag.
                                                  </video>
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {el?.type?.includes("image") && (
                                                <>
                                                  <img
                                                    width="94px"
                                                    height="94px"
                                                    src={URL.createObjectURL(
                                                      el
                                                    )}
                                                  />
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {el?.type?.includes("pdf") && (
                                                <div
                                                  style={{ display: "flex" }}
                                                >
                                                  <p>
                                                    File uploaded successfully
                                                  </p>
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </>
                                          );
                                        })
                                      : modalImageurl.map((val, index) => {
                                          return (
                                            <div
                                              style={{
                                                display: "relative",
                                              }}
                                              key={index}
                                            >
                                              {val?.name?.includes("image") && (
                                                <>
                                                  <img
                                                    src={`${
                                                      process.env
                                                        .REACT_APP_IMAGE_BASE_URL +
                                                      val.name
                                                    }`}
                                                    width="94px"
                                                    height="94px"
                                                    alt="image"
                                                  />
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {val?.name?.includes("video") && (
                                                <>
                                                  <video
                                                    width="150"
                                                    height="100"
                                                    controls
                                                    poster={val}
                                                  >
                                                    <source
                                                      src={val}
                                                      type="video/mp4"
                                                    />
                                                    Your browser does not
                                                    support the video tag.
                                                  </video>
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {val?.name?.includes("file") && (
                                                <div
                                                  style={{ display: "flex" }}
                                                >
                                                  <p>Update File</p>
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span className="text-danger">{errors.file}</span>
                            {/* {modalImageurl
                              ? modalImageurl.map((val, index) => {
                                  console.log("This is modal image: ", val);
                                  return (
                                    <div
                                      style={{
                                        display: "relative",
                                      }}
                                      key={index}
                                    >
                                      <img
                                        src={`${
                                          process.env.REACT_APP_IMAGE_BASE_URL +
                                          val.name
                                        }`}
                                        width="94px"
                                        height="94px"
                                        alt="image"
                                      />
                                      <CloseButton
                                        onClick={() => onImageTempRemove(index)}
                                        style={{
                                          position: "absolute",
                                        }}
                                      />
                                    </div>
                                  );
                                })
                              : image?.map((image, index) => {
                                  console.log("THIS IS IMAGE:: ", image);
                                  return (
                                    <div
                                      key={index}
                                      className="image-item"
                                      style={{
                                        position: "relative",
                                      }}
                                    >
                                      <img
                                        src={
                                          image.data_url ||
                                          `${
                                            process.env
                                              .REACT_APP_IMAGE_BASE_URL +
                                            image.name
                                          }`
                                        }
                                        alt="image"
                                        width="94px"
                                        height="94px"
                                        style={{
                                          borderRadius: "50%",
                                          marginBottom: "15px",
                                        }}
                                      />
                                    </div>
                                  );
                                })} */}

                            {/* <div
                              className="row"
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.4)",
                                position: "relative",
                                marginLeft: "0",
                                marginRight: "0",
                                marginBottom: "25px",
                                justifyContent: "center",
                                // marginTop:"15px",
                              }}
                            >
                              <div
                                style={{
                                  marginBottom: "50px",
                                }}
                                className="p-3"
                              >
                                <h5
                                  style={{
                                    marginBottom: "0",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Value :
                                </h5>
                                <ImageUploading
                                  multiple={false}
                                  value={typeMediaFile}
                                  onChange={onChange}
                                  maxNumber={maxNumber}
                                  dataURLKey="data_url"
                                >
                                  {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemove,
                                    dragProps,
                                  }) => (
                                    <div
                                      style={{ marginTop: "15px" }}
                                      className="align-items-center bg-body d-flex flex-column p-2"
                                    >
                                      <h5
                                        style={{
                                          textAlign: "center",
                                          marginBottom: "0",
                                          paddingBottom: "15px",
                                          fontSize: "16px",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Upload Images, Videos, PDFs and other
                                        files*
                                      </h5>
                                      <div
                                        className="btns"
                                        style={{
                                          width: "fit-content",
                                        }}
                                      >
                                        <h6
                                          onClick={onImageUpload}
                                          {...dragProps}
                                          className="delete"
                                          style={{
                                            color: "#F4730E",
                                            border: "1px solid",
                                            borderRadius: "12px",
                                            padding: "12px 60px",
                                          }}
                                        >
                                          Upload a file Drag & drop &nbsp;
                                        </h6>
                                      </div>
                                      <div
                                        className="modal-left__thumb driver-img__wrapper"
                                        style={{
                                          display: "grid",
                                          textAlign: "center",
                                          marginTop: "50px",
                                        }}
                                      >
                                        {!modalImageurl
                                          ? modalImageurl.map((val, index) => {
                                              return (
                                                <div
                                                  style={{
                                                    display: "relative",
                                                  }}
                                                  key={index}
                                                >
                                                  <img
                                                    src={`${
                                                      process.env
                                                        .REACT_APP_IMAGE_BASE_URL +
                                                      val.name
                                                    }`}
                                                    width="94px"
                                                    height="94px"
                                                    alt="image"
                                                  />
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageTempRemove(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                    }}
                                                  />
                                                </div>
                                              );
                                            })
                                          : imageList &&
                                            imageList?.map((image, index) => {
                                              return (
                                                <div
                                                  key={index}
                                                  className="image-item"
                                                  style={{
                                                    position: "relative",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      image.data_url ||
                                                      `${
                                                        process.env
                                                          .REACT_APP_IMAGE_BASE_URL +
                                                        image.name
                                                      }`
                                                    }
                                                    alt="image"
                                                    width="94px"
                                                    height="94px"
                                                    style={{
                                                      borderRadius: "50%",
                                                      marginBottom: "15px",
                                                    }}
                                                  />
                                                  <CloseButton
                                                    onClick={() =>
                                                      onImageRemove(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                    }}
                                                  />
                                                </div>
                                              );
                                            })}
                                      </div>
                                    </div>
                                  )}
                                </ImageUploading>
                                <span className="text-danger">
                                  {errors.typeMediaFile}
                                </span>
                              </div>
                            </div> */}
                          </>
                        )}

                        {/* Pickup Date */}
                        {fieldType === "date / time" && (
                          <>
                            <div
                              className="row gap-3 p-3"
                              style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                backgroundColor: "rgba(242, 242, 242, 0.4)",
                                paddingBottom: "100px",
                                marginTop: "15px",
                                marginBottom: "0",
                                paddingTop: "20px",
                              }}
                            >
                              <h5
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "700",
                                }}
                              >
                                Value :
                              </h5>
                              <div className="col-3">
                                <div
                                  className="input-wrapper"
                                  style={{ backgroundColor: "#fff" }}
                                >
                                  <h5 className="">Pickup date:</h5>
                                  <input
                                    className="m-0"
                                    // style={{ width: "92%" }}
                                    type="date"
                                    placeholder="Sun, May 08, 2022"
                                    value={typeDate}
                                    onChange={(e) =>
                                      setTypeDate(e.target.value)
                                    }
                                  ></input>
                                </div>
                                <span className="text-danger">
                                  {errors.typeDate}
                                </span>
                              </div>
                              <div className="col-3">
                                <div
                                  className="input-wrapper"
                                  style={{ backgroundColor: "#fff" }}
                                >
                                  <h5>Pickup time:</h5>
                                  <input
                                    style={{ width: "92%" }}
                                    type="time"
                                    placeholder="9:30 AM"
                                    value={typeTime}
                                    onChange={(e) =>
                                      setTypeTime(e.target.value)
                                    }
                                  ></input>
                                </div>
                                <span className="text-danger">
                                  {errors.typeTime}
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Json Object  */}
                        {fieldType === "json object" && (
                          <>
                            <div
                              className="align-items-start d-flex flex-column input-wrapper"
                              style={{
                                marginBottom: "25px",
                                marginTop: "15px",
                              }}
                            >
                              <h5
                                className="w-100"
                                style={{
                                  paddingLeft: "24px",
                                  fontSize: "16px",
                                  fontWeight: "700",
                                  paddingTop: "20px",
                                }}
                              >
                                Value :
                              </h5>
                              <textarea
                                type="text"
                                rows="6"
                                className="my-4"
                                style={{
                                  width: "92%",
                                  border: "none",
                                  backgroundColor: "#fff",
                                  marginLeft: "24px",
                                }}
                                value={typeJson}
                                onChange={(e) => setTypeJson(e.target.value)}
                              />
                            </div>
                            <span className="text-danger">
                              {errors.typeJson}
                            </span>
                          </>
                        )}

                        {fieldType === "boolean" && (
                          <>
                            <h5
                              style={{
                                backgroundColor: "rgba(242, 242, 242, 0.4)",
                                marginBottom: "0",
                                paddingLeft: "24px",
                                fontSize: "16px",
                                fontWeight: "700",
                                marginTop: "15px",
                                paddingTop: "20px",
                              }}
                            >
                              Value :
                            </h5>{" "}
                            <div
                              className="input-wrapper"
                              style={{ width: "100%" }}
                            >
                              <select
                                placeholder="Please select the page from dropdown to enable Global Structure Markup"
                                className="custom-dropdown"
                                value={typeBoolean}
                                style={{
                                  width: "50%",
                                  border: "none",
                                  backgroundColor: "#fff",
                                  margin: "24px",
                                  padding: "15px 20px",
                                }}
                                onChange={(e) => setTypeBoolean(e.target.value)}
                              >
                                <option value="">Select</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                            <span className="text-danger">
                              {errors.typeBoolean}
                            </span>
                          </>
                        )}
                      </div>
                      <Row>
                        <Col xs={12}>
                          <div
                            style={{
                              background: "rgb(244, 115, 14)",
                              color: "rgb(255, 255, 255)",
                              border: "1px solid",
                              borderRadius: "12px",
                              padding: "15px 30px",
                              width: "fit-content",
                              cursor: "pointer",
                              marginTop: "30px",
                            }}
                            onClick={next}
                          >
                            <h6
                              style={{
                                marginBottom: "0",
                                fontSize: "18px",
                                fontWeight: "700",
                              }}
                            >
                              Add Field
                            </h6>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewField;
