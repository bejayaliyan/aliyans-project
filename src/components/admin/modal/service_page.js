import { useEffect, useState } from "react";
import { Row, Col, CloseButton, Tab, Tabs } from "react-bootstrap";
import ImageUploading from "react-images-uploading";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import ReactQuill from "react-quill";
import Sidebar from "../pages/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DynamicTimer } from "../components/timer";
import { BellPic } from "../components/bellPic";
import UserIcon from "../components/userIcon";
import Accordion from "react-bootstrap/Accordion";
import "react-quill/dist/quill.snow.css";
import "./driver_modal.scss";

const ServicePage = ({ userName }) => {
  const location = useLocation();
  const data = location.state ? location.state.data : null;
  const { addToast } = useToasts();

  const maxNumber = 69;
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Content States
  const [serviceName, setServiceName] = useState();
  const [title, setTitle] = useState();
  const [heading, setHeading] = useState();
  const [headingTwo, setHeadingTwo] = useState();
  const [content, setContent] = useState();
  const [modalId, setModalId] = useState();
  const [bannerImage, setBannerImage] = useState();
  const [iconImage, setIconImage] = useState();
  const [pageImage, setPageImage] = useState();
  const [bannerImageAltText, setBannerImageAltText] = useState();
  const [iconImageAltText, setIconImageAltText] = useState();
  const [pageImageAltText, setPageImageAltText] = useState();
  const [modalImageurl, setModalImageUrl] = useState([]);

  // SEO States
  const [metaRobot, setMetaRobot] = useState();
  const [pageUrl, setPageUrl] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const [globalStructureMarkup, setGlobalStructureMarkup] = useState();
  const [twitterTitle, setTwitterTitle] = useState();
  const [twitterDescription, setTwitterDescription] = useState();
  const [facebookTitle, setFacebookTitle] = useState();
  const [facebookDescription, setFacebookDescription] = useState();
  const [youtubeTitle, setYoutubeTitle] = useState();
  const [youtubeDescription, setYoutubeDescription] = useState();

  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);
  const navigate = useNavigate();

  const cancelHandler = () => {
    navigate(`/admin/services`);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setTitle(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "Service title must be less than 60 characters.",
      }));
    }
  };
 
  const onChange = (customValue) => (imageList, addUpdateIndex) => {
    setIsImageChanged(true);

    let filesize = 0;
    for (let i = 0; i < imageList.length; i++) {
      filesize = filesize + imageList[i].file.size;
    }

    if (customValue == "bannerImage") {
      setBannerImage(imageList);
      const filteredImages = modalImageurl.filter(
        (el) => !el.name.includes(customValue)
      );
      setModalImageUrl(filteredImages);

      if (filesize > 500 * 1024 * 5)
        setErrors((prevErrors) => ({
          ...prevErrors,
          bannerImageEmpty: "",
          bannerImageSize: "image size is too big",
        }));
      else
        setErrors((prevErrors) => ({
          ...prevErrors,
          bannerImageSize: "",
        }));
    }
    if (customValue == "iconImage") {
      setIconImage(imageList);
      const filteredImages = modalImageurl.filter(
        (el) => !el.name.includes(customValue)
      );
      setModalImageUrl(filteredImages);

      if (filesize > 500 * 1024 * 5)
        setErrors((prevErrors) => ({
          ...prevErrors,
          iconImageEmpty: "",
          iconImageSize: "image size is too big",
        }));
      else
        setErrors((prevErrors) => ({
          ...prevErrors,
          iconImageSize: "",
        }));
    }
    if (customValue == "pageImage") {
      setPageImage(imageList);
      const filteredImages = modalImageurl.filter(
        (el) => !el.name.includes(customValue)
      );
      setModalImageUrl(filteredImages);

      if (filesize > 500 * 1024 * 5)
        setErrors((prevErrors) => ({
          ...prevErrors,
          pageImageEmpty: "",
          pageImageSize: "image size is too big",
        }));
      else
        setErrors((prevErrors) => ({
          ...prevErrors,
          pageImageSize: "",
        }));
    }
  };

  const onImageTempRemove = (index) => {
    var updatedList = Array.from(modalImageurl);
    if (Array.isArray(index)) {
      index.forEach(function (i) {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(index, 1);
    }
    setModalImageUrl(updatedList);
  };

  const handleEditorChange = (html) => {
    setContent(html);
  };

  const validate = (value) => {
    if (!value) {
      return "Field is required";
    }
  };

  const next = () => {
    const validationErrors = {};
    if (!modalId) {
      if (!bannerImage?.length) {
        validationErrors["bannerImageEmpty"] = "image is required";
      } else if (bannerImage[0]?.file?.size > 500 * 1024 * 5) {
        validationErrors["bannerImageSize"] = "image size is too big";
      }
      if (!iconImage?.length) {
        validationErrors["iconImageEmpty"] = "image is required";
      } else if (iconImage[0]?.file?.size > 500 * 1024 * 5) {
        validationErrors["iconImageSize"] = "image size is too big";
      }
      if (!pageImage?.length) {
        validationErrors["pageImageEmpty"] = "image is required";
      } else if (pageImage[0]?.file?.size > 500 * 1024 * 5) {
        validationErrors["pageImageSize"] = "image size is too big";
      }
    }
    let error = validate(title);
    if (error && error.length > 0) validationErrors["title"] = error;
    error = validate(heading);
    if (error && error.length > 0) validationErrors["heading"] = error;
    error = validate(headingTwo);
    if (error && error.length > 0) validationErrors["headingTwo"] = error;
    error = validate(content);
    if (error && error.length > 0) validationErrors["content"] = error;
    error = validate(bannerImageAltText);
    if (error && error.length > 0)
      validationErrors["bannerImageAltText"] = error;
    error = validate(iconImageAltText);
    if (error && error.length > 0) validationErrors["iconImageAltText"] = error;
    error = validate(pageImageAltText);
    if (error && error.length > 0) validationErrors["pageImageAltText"] = error;
    error = validate(metaRobot);
    if (error && error.length > 0) validationErrors["metaRobot"] = error;
    error = validate(pageUrl);
    if (error && error.length > 0) validationErrors["pageUrl"] = error;
    error = validate(metaDescription);
    if (error && error.length > 0) validationErrors["metaDescription"] = error;
    error = validate(globalStructureMarkup);
    if (error && error.length > 0)
      validationErrors["globalStructureMarkup"] = error;
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
    temp.title = title;
    temp.heading = heading;
    temp.heading_two = headingTwo;
    temp.content = content;
    temp.banner_image_alt_text = bannerImageAltText;
    temp.icon_image_alt_text = iconImageAltText;
    temp.page_image_alt_text = pageImageAltText;
    temp.meta_robot = metaRobot;
    temp.page_url = pageUrl;
    temp.meta_description = metaDescription;
    temp.global_structure_markup = globalStructureMarkup;
    temp.twitter_title = twitterTitle;
    temp.twitter_description = twitterDescription;
    temp.facebook_title = facebookTitle;
    temp.facebook_description = facebookDescription;
    temp.youtube_title = youtubeTitle;
    temp.youtube_description = youtubeDescription;
    temp.service_name = serviceName;

    const formData = new FormData();
    let temp_banner_image_files = [];
    let temp_icon_image_files = [];
    let temp_page_image_files = [];

    if (bannerImage.length > 0) {
      bannerImage.map((image) => {
        temp_banner_image_files.push({
          title: "bannerImage",
          file: image.file,
        });
      });
    }

    if (iconImage.length > 0) {
      iconImage.map((image) => {
        temp_icon_image_files.push({ title: "iconImage", file: image.file });
      });
    }

    if (pageImage.length > 0) {
      pageImage.map((image) => {
        temp_page_image_files.push({ title: "pageImage", file: image.file });
      });
    }

    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);
      temp.urls = JSON.parse(data?.urls);

        temp_banner_image_files.map((file) => {
          formData.append("uploadImages", file.file, file.title);
        });

        temp_icon_image_files.map((file) => {
          formData.append("uploadImages", file.file, file.title);
        });

        temp_page_image_files.map((file) => {
          formData.append("uploadImages", file.file, file.title);
        });
        if (bannerImage || iconImage || pageImage) {
          const result = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/admin/service/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                boundary: "${form_data._boundary}",
              },
            }
          );
          // temp.urls = result.data.data;
          let imageOne = result.data.data.filter(i => i.name.includes("banner"));
          let imageTwo = result.data.data.filter(i => i.name.includes("icon"));
          let imageThree = result.data.data.filter(i => i.name.includes("page"));

          if(!imageOne.length){
            imageOne = temp.urls?.filter(i => i.name.includes("banner"))
          }
          if(!imageTwo.length){
            imageTwo = temp.urls?.filter(i => i.name.includes("icon"))
          }
          if(!imageThree.length){
            imageThree = temp.urls?.filter(i => i.name.includes("page"))
          }

          temp.urls = [
            ...imageOne,
            ...imageTwo,
            ...imageThree
          ]
        }

      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/service/update`,
          temp
        )
        .then((res) => {
          setLoadingShow(false);
          addToast("Services updated successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/services`);
        });
    } else {
      temp_banner_image_files.map((file) => {
        formData.append("uploadImages", file.file, file.title);
      });

      temp_icon_image_files.map((file) => {
        formData.append("uploadImages", file.file, file.title);
      });

      temp_page_image_files.map((file) => {
        formData.append("uploadImages", file.file, file.title);
      });
      setLoadingShow(true);
      if (
        bannerImage.length > 0 ||
        iconImage.length > 0 ||
        pageImage.length > 0
      ) {
        const result = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/service/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              boundary: "${form_data._boundary}",
            },
          }
        );
        temp.urls = result.data.data;
      }

      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/service/create`,
          temp
        )
        .then((res) => {
          setLoadingShow(false);
          addToast("Services added successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/services`);
        })
        .catch((err) => {
          setLoadingShow(false);
          addToast(err.response.data.message, {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
    }
  };

  useEffect(() => {
    if (data) {
      setErrors([]);
      setTitle(data.title);
      setHeading(data.heading);
      setHeadingTwo(data.heading_two);
      setContent(data.content);
      setBannerImageAltText(data.banner_image_alt_text);
      setIconImageAltText(data.icon_image_alt_text);
      setPageImageAltText(data.page_image_alt_text);
      setMetaRobot(data.meta_robot);
      setPageUrl(data.page_url);
      setMetaDescription(data.meta_description);
      setGlobalStructureMarkup(data.global_structure_markup);
      setTwitterTitle(data.twitter_title);
      setTwitterDescription(data.twitter_description);
      setFacebookTitle(data.facebook_title);
      setFacebookDescription(data.facebook_description);
      setYoutubeTitle(data.youtube_title);
      setYoutubeDescription(data.youtube_description);
      setModalId(data.id);
      const parsedUrls = JSON.parse(data.urls);
      setModalImageUrl(parsedUrls);
      setBannerImage([]);
      setIconImage([]);
      setPageImage([]);
      setServiceName(data.service_name);
    }
  }, [data]);

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
                    <div className="card-body px-4 py-3">
                      <div className="card-body__header mb-5">
                        <div className="caption">
                          <h5
                            style={{
                              textTransform: "capitalize",
                              fontSize: "24px",
                            }}
                          >
                            Add New Service
                          </h5>
                        </div>
                      </div>
                      <div className="card-body__content">
                        <h2 className="mb-4" style={{ fontWeight: "700" }}>
                          Page Info
                        </h2>
                        <div className="mb-4">
                          <hr className="hr" />
                        </div>

                        <div className="input-wrapper">
                        <h5>Service Name:</h5>
                          <input
                            type="text"
                            placeholder="Enter Service Name"
                            className=" pd5"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                          ></input>
                        </div>
                        <div
                          className="input-wrapper mt-4"
                          style={{ marginBottom: "0" }}
                        >
                          <h5>Page Title</h5>
                          <input
                            type="text"
                            placeholder="Keep under 60 characters/ max 60 pixels including spaces, Use your keyword in title tag (In Front of title wherever Possible)"
                            value={title}
                            onChange={handleTitleChange}
                            className="pd5"
                          ></input>
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            fontSize: "10px",
                            fontStyle: "italic",
                            paddingLeft: "24px",
                          }}
                        >
                          Embed Title Tag Modifiers &emsp; Instructions: Title
                          Tag Modifiers are words and phrases to add to your
                          title tag. &emsp; (Example: Long Tail Keywords)
                        </div>
                        <span className="text-danger">{errors.title}</span>

                        <div className="input-wrapper mt-3">
                          <h5>Heading</h5>
                          <input
                            type="text"
                            placeholder="Enter Page Header (25 out of 60 max recommended characters.)"
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            style={{paddingRight: "24px"}}
                            className="pd5"
                          ></input>
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            fontSize: "10px",
                            fontStyle: "italic",
                            paddingLeft: "24px",
                          }}
                        >
                          Incorporate important keywords in your headers, but
                          choose different ones than what's in your page title.
                          &emsp; (Put your most important keywords in your
                          &lt;h1&gt; and &lt;h2&gt; headers.)
                        </div>

                        <span className="text-danger">{errors.heading}</span>

                        <div
                          className="input-wrapper mt-3"
                          style={{ marginBottom: "0" }}
                        >
                          <h5>Heading 2</h5>
                          <input
                            type="text"
                            placeholder="Enter Page Header (25 out of 60 max recommended characters.)"
                            value={headingTwo}
                            onChange={(e) => setHeadingTwo(e.target.value)}
                            style={{paddingRight: "24px"}}
                            className="pd5"
                          ></input>
                        </div>
                        <span className="text-danger">{errors.headingTwo}</span>
                      </div>
                   <div className="card-body blogtab mt-4">
                   <Tabs
                        className="service-accordion-tab font32 border-0"
                        defaultActiveKey="content"
                        id="uncontrolled-tab-example"
                      >
                        <Tab
                          eventKey="content"
                          title="Content"
                          className="content-tab"
                        >
                          <div className="accordion">
                            <Col className="accordion-col" xs={12}>
                              <Accordion
                                className="custom-accordion bgcolornone"
                                defaultActiveKey={["0", "1"]}
                                alwaysOpen
                              >
                                <Accordion.Item
                                  style={{ borderRadius: "0px" }}
                                  eventKey="0"
                                >
                                  <Accordion.Header className="p-3 social-media-links">
                                    Banner
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <h5
                                      style={{
                                        fontFamily: "Lato",
                                        fontSize: "16px",
                                        fontStyle: "normal",
                                        fontWeight: "700",
                                        paddingLeft: "15px",
                                      }}
                                    >
                                      Upload Image*
                                    </h5>
                                    <div
                                      className="row m-0"
                                      style={{
                                        position: "relative",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div className="col-md-4 col-sm-12">
                                        <ImageUploading
                                          multiple={false}
                                          value={bannerImage}
                                          onChange={onChange("bannerImage")}
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
                                            <div style={{ marginTop: "15px" }}>
                                              <div
                                                className="btns"
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  position: "relative",
                                                }}
                                              >
                                                <h6
                                                  onClick={onImageUpload}
                                                  {...dragProps}
                                                  className="delete MobileViewPad"
                                                  style={{
                                                    color: "#F4730E",
                                                    border: "1px solid",
                                                    borderRadius: "12px",
                                                    padding: "12px 55px",
                                                  }}
                                                >
                                                  Add Banner Image
                                                </h6>
                                              </div>

                                              <div
                                                className="d-flex"
                                                style={{
                                                  fontSize: "10px",
                                                  padding: "10px 5px",
                                                  borderRadius: "4px",
                                                  marginTop: "50px",
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <div className="col-3">
                                                  <h5 style={{marginBottom:"0", paddingTop:"5px"}}>Alt Text</h5>
                                                </div>
                                                <div className="col">
                                                  <textarea
                                                    className="alt-text-input"
                                                    type="text"
                                                    placeholder="(Max 125 Characters (not including spaces) Make it descriptive and specific:)"
                                                    value={bannerImageAltText}
                                                    onChange={(e) =>
                                                      setBannerImageAltText(
                                                        e.target.value
                                                      )
                                                    }
                                                    multiline
                                                  />
                                                </div>
                                              </div>
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "10px" }}
                                              >
                                                {errors.bannerImageAltText}
                                              </span>
                                              <div
                                                className="modal-left__thumb driver-img__wrapper MobileViewWidth"
                                                style={{
                                                  display: "grid",
                                                  marginTop: "50px",
                                                  width: "250px",
                                                  height: "127px",
                                                  border: "1px dotted #BDBDBD",
                                                  position: "relative",
                                                }}
                                              >
                                                <span className="dimension-placeholer">
                                                  1440 x 381
                                                </span>
                                                {modalImageurl.length > 0 ? (
                                                  modalImageurl.map(
                                                    (val, index) => {
                                                      const bannerImageShow =
                                                        val.name.includes(
                                                          "banner"
                                                        );
                                                      return (
                                                        <div
                                                          style={{
                                                            display: "relative",
                                                            margin: "auto",
                                                            zIndex: "1",
                                                          }}
                                                          key={index}
                                                        >
                                                          {bannerImageShow && (
                                                            <>
                                                              <img
                                                                src={`${
                                                                  process.env
                                                                    .REACT_APP_IMAGE_BASE_URL +
                                                                  val.name
                                                                }`}
                                                                width="248px"
                                                                height="94px"
                                                                alt="car"
                                                              />
                                                              <CloseButton
                                                                onClick={() =>
                                                                  onImageTempRemove(
                                                                    index
                                                                  )
                                                                }
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                }}
                                                              />
                                                            </>
                                                          )}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <></>
                                                )}
                                                <>
                                                  {imageList
                                                    ? imageList.map(
                                                        (image, index) => {
                                                          console.log(image);
                                                          return (
                                                            <div
                                                              key={index}
                                                              className="image-item"
                                                              style={{
                                                                position:
                                                                  "relative",
                                                                margin: "auto",
                                                                zIndex: "1",
                                                              }}
                                                            >
                                                              <img
                                                                src={
                                                                  image.data_url
                                                                }
                                                                alt=""
                                                                width="248px"
                                                                height="94px"
                                                              />
                                                              <CloseButton
                                                                onClick={() =>
                                                                  onImageRemove(
                                                                    index
                                                                  )
                                                                }
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                }}
                                                              />
                                                            </div>
                                                          );
                                                        }
                                                      )
                                                    : ""}
                                                </>
                                              </div>
                                            </div>
                                          )}
                                        </ImageUploading>
                                        <span className="text-danger">
                                          {errors.bannerImageEmpty}
                                        </span>
                                        <span className="text-danger">
                                          {errors.bannerImageSize}
                                        </span>
                                      </div>
                                      <div className="col-md-4 col-sm-12">
                                        <ImageUploading
                                          multiple={false}
                                          value={iconImage}
                                          onChange={onChange("iconImage")}
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
                                            <div style={{ marginTop: "15px" }}>
                                              <div
                                                className="btns"
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  position: "relative",
                                                }}
                                              >
                                                <h6
                                                  onClick={onImageUpload}
                                                  {...dragProps}
                                                  className="delete MobileViewPad"
                                                  style={{
                                                    color: "#F4730E",
                                                    border: "1px solid",
                                                    borderRadius: "12px",
                                                    padding: "12px 60px",
                                                  }}
                                                >
                                                  Add Icon Image &nbsp;
                                                </h6>
                                              </div>
                                              <div
                                                className="d-flex"
                                                style={{
                                                  fontSize: "10px",
                                                  padding: "10px 5px",
                                                  borderRadius: "4px",
                                                  marginTop: "50px",
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <div className="col-3">
                                                  <h5 style={{marginBottom:"0", paddingTop:"5px"}}>Alt Text</h5>
                                                </div>
                                                <div className="col">
                                                  <textarea
                                                    className="alt-text-input"
                                                    type="text"
                                                    placeholder=" (Max 125 Characters (not including spaces) Make it descriptive and specific:)"
                                                    value={iconImageAltText}
                                                    onChange={(e) =>
                                                      setIconImageAltText(
                                                        e.target.value
                                                      )
                                                    }
                                                    multiline
                                                  />
                                                </div>
                                              </div>
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "10px" }}
                                              >
                                                {errors.iconImageAltText}
                                              </span>
                                              <div
                                                className="modal-left__thumb driver-img__wrapper"
                                                style={{
                                                  display: "grid",
                                                  marginTop: "50px",
                                                  marginLeft: "auto",
                                                  marginRight: "auto",
                                                  width: "100px",
                                                  height: "127px",
                                                  border: "1px dotted #BDBDBD",
                                                  position: "relative",
                                                }}
                                              >
                                                <span
                                                  className="dimension-placeholer"
                                                  style={{ left: "23%" }}
                                                >
                                                  64 x 52
                                                </span>
                                                {modalImageurl.length > 0 ? (
                                                  modalImageurl.map(
                                                    (val, index) => {
                                                      const iconImageShow =
                                                        val.name.includes(
                                                          "icon"
                                                        );

                                                      return (
                                                        <div
                                                          style={{
                                                            display: "relative",
                                                            margin: "auto",
                                                            zIndex: "1",
                                                          }}
                                                          key={index}
                                                        >
                                                          {/* <img src={`${process.env.REACT_APP_IMAGE_BASE_URL + val.name}`} width="94px" height="94px" alt="car" /> */}
                                                          {iconImageShow && (
                                                            <>
                                                              <img
                                                                src={`${
                                                                  process.env
                                                                    .REACT_APP_IMAGE_BASE_URL +
                                                                  val.name
                                                                }`}
                                                                width="98px"
                                                                height="94px"
                                                                alt="car"
                                                              />

                                                              <CloseButton
                                                                onClick={() =>
                                                                  onImageTempRemove(
                                                                    index
                                                                  )
                                                                }
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                }}
                                                              />
                                                            </>
                                                          )}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <></>
                                                )}
                                                <>
                                                  {imageList.map(
                                                    (image, index) => (
                                                      <div
                                                        key={index}
                                                        className="image-item"
                                                        style={{
                                                          position: "relative",
                                                          margin: "auto",
                                                          zIndex: "1",
                                                        }}
                                                      >
                                                        <img
                                                          src={image.data_url}
                                                          alt=""
                                                          width="98px"
                                                          height="94px"
                                                        />
                                                        <CloseButton
                                                          onClick={() =>
                                                            onImageRemove(index)
                                                          }
                                                          style={{
                                                            position:
                                                              "absolute",
                                                          }}
                                                        />
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              </div>
                                            </div>
                                          )}
                                        </ImageUploading>
                                        <span className="text-danger">
                                          {errors.iconImageEmpty}
                                        </span>
                                        <span className="text-danger">
                                          {errors.iconImageSize}
                                        </span>
                                      </div>
                                      <div className="col-md-4 col-sm-12">
                                        <ImageUploading
                                          multiple={false}
                                          value={pageImage}
                                          onChange={onChange("pageImage")}
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
                                            <div style={{ marginTop: "15px" }}>
                                              <div
                                                className="btns"
                                                style={{
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  position: "relative",
                                                }}
                                              >
                                                <h6
                                                  onClick={onImageUpload}
                                                  {...dragProps}
                                                  className="delete MobileViewPad"
                                                  style={{
                                                    color: "#F4730E",
                                                    border: "1px solid",
                                                    borderRadius: "12px",
                                                    padding: "12px 60px",
                                                  }}
                                                >
                                                  Add Page Image &nbsp;
                                                </h6>
                                              </div>
                                              <div
                                                className="d-flex"
                                                style={{
                                                  fontSize: "10px",
                                                  padding: "10px 5px",
                                                  borderRadius: "4px",
                                                  marginTop: "50px",
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <div className="col-3">
                                                  <h5 style={{marginBottom:"0", paddingTop:"5px"}}>Alt Text</h5>
                                                </div>
                                                <div className="col">
                                                  <textarea
                                                    className="alt-text-input"
                                                    type="text"
                                                    placeholder=" (Max 125 Characters (not including spaces) Make it descriptive and specific:)"
                                                    value={pageImageAltText}
                                                    onChange={(e) =>
                                                      setPageImageAltText(
                                                        e.target.value
                                                      )
                                                    }
                                                    multiline
                                                  />
                                                </div>
                                              </div>
                                              <span
                                                className="text-danger"
                                                style={{ fontSize: "10px" }}
                                              >
                                                {errors.pageImageAltText}
                                              </span>
                                              <div
                                                className="modal-left__thumb driver-img__wrapper"
                                                style={{
                                                  display: "grid",
                                                  marginTop: "50px",
                                                  marginLeft: "auto",
                                                  marginRight: "auto",
                                                  width: "130px",
                                                  height: "127px",
                                                  border: "1px dotted #BDBDBD",
                                                  position: "relative",
                                                }}
                                              >
                                                <span
                                                  className="dimension-placeholer"
                                                  style={{ left: "18%" }}
                                                >
                                                  1440 x 318
                                                </span>
                                                {modalImageurl.length > 0 ? (
                                                  modalImageurl.map(
                                                    (val, index) => {
                                                      const pageImageShow =
                                                        val.name.includes(
                                                          "page"
                                                        );
                                                      return (
                                                        <div
                                                          style={{
                                                            display: "relative",
                                                            margin: "auto",
                                                            zIndex: "1",
                                                          }}
                                                          key={index}
                                                        >
                                                          {/* <img src={`${process.env.REACT_APP_IMAGE_BASE_URL + val.name}`} width="94px" height="94px" alt="car" /> */}
                                                          {pageImageShow && (
                                                            <>
                                                              <img
                                                                src={`${
                                                                  process.env
                                                                    .REACT_APP_IMAGE_BASE_URL +
                                                                  val.name
                                                                }`}
                                                                width="128px"
                                                                height="94px"
                                                                alt="car"
                                                              />
                                                              <CloseButton
                                                                onClick={() =>
                                                                  onImageTempRemove(
                                                                    index
                                                                  )
                                                                }
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                }}
                                                              />
                                                            </>
                                                          )}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <></>
                                                )}
                                                <>
                                                  {imageList.map(
                                                    (image, index) => (
                                                      <div
                                                        key={index}
                                                        className="image-item"
                                                        style={{
                                                          position: "relative",
                                                          margin: "auto",
                                                          zIndex: "1",
                                                        }}
                                                      >
                                                        <img
                                                          src={image.data_url}
                                                          alt=""
                                                          width="128px"
                                                          height="94px"
                                                        />
                                                        <CloseButton
                                                          onClick={() =>
                                                            onImageRemove(index)
                                                          }
                                                          style={{
                                                            position:
                                                              "absolute",
                                                          }}
                                                        />
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              </div>
                                            </div>
                                          )}
                                        </ImageUploading>
                                        <span className="text-danger">
                                          {errors.pageImageEmpty}
                                        </span>
                                        <span className="text-danger">
                                          {errors.pageImageSize}
                                        </span>
                                      </div>
                                      <div className="MobileViewTop"
                                        style={{
                                          fontSize: "10px",
                                          position: "absolute",
                                          top: "80px",
                                          left: "0",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Instructions:{" "}
                                        </span>
                                        Our Primary keyword or focused keyword
                                        should be in the ALT tag of the image
                                      </div>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                  <Accordion.Header className="p-3 social-media-links">
                                    Content/Text
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <div className="input-wrapper">
                                      <ReactQuill
                                        value={content}
                                        onChange={handleEditorChange}
                                      />
                                    </div>

                                    <div
                                      style={{
                                        fontSize: "10px",
                                        marginTop: "50px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: "700",
                                        }}
                                      >
                                        Instructions:{" "}
                                      </span>
                                      <span
                                        className="text-muted"
                                        style={{
                                          fontStyle: "italic",
                                          fontFamily: "lato",
                                          fontWeight: "400",
                                          fontSize: "10px",
                                        }}
                                      >
                                         Use Your Keywords once in the first 150
                                        words (Make sure you use once here) Use
                                        Synonyms and LSI Keywords (Just add a
                                        few or LSI Keywords to your page.)
                                      </span>
                                    </div>

                                    <div
                                      className="d-flex gap-2"
                                      style={{
                                        fontSize: "10px",
                                        paddingTop: "20px",
                                      }}
                                    >
                                      <div>
                                        <h5
                                          style={{
                                            fontSize: "10px",
                                            fontWeight: "700",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          Tips: {" "}
                                        </h5>
                                      </div>
                                      <div className="text-muted">
                                        <p
                                          style={{
                                            fontStyle: "italic",
                                            fontFamily: "lato",
                                            fontSize: "10px",
                                          }}
                                        >
                                          We put a link then there should be an
                                          option of nofollow or dofollow. By
                                          default it should be dofollow. Like in
                                          the example given below <br /> &lt;a
                                          href="https://example.com"
                                          rel="nofollow"&gt;blue text&lt;/a&gt;{" "}
                                          <br /> &lt;a
                                          href="https://example.com"&gt;blue
                                          text&lt;/a&gt;
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-danger">
                                      {errors.content}
                                    </span>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Col>
                          </div>
                        </Tab>
                        <Tab eventKey="seo" title="SEO">
                          <Row
                            className="m-0"
                            style={{ backgroundColor: "#F2F2F2" }}
                          >
                            <Col xs={12}>
                              <div
                                className="card"
                                style={{
                                  border: "none",
                                  backgroundColor: "#F2F2F2",
                                }}
                              >
                                <div
                                  className="card-body"
                                  // style={{ paddingLeft: "0" }}
                                >
                                  <div className="card-body__header">
                                    <div className="caption">
                                      {/* <h5 style={{ textTransform: "capitalize" }}>
                                          Add New Blog
                                        </h5> */}
                                    </div>
                                  </div>
                                  <div className="card-body__content">
                                    <h5 className="seo-titles">Meta Robots</h5>

                                    <div
                                      className="input-wrapper MetaRobotsDrop"
                                      style={{
                                        width: "50%",
                                        marginBottom: "0",
                                      }}
                                    >
                                      <select
                                        placeholder="Please select the page from dropdown to enable Global Structure Markup"
                                        className="custom-dropdown"
                                        value={metaRobot}
                                        style={{
                                          border: "none",
                                          width: "100%",
                                          marginLeft: "0",
                                          padding: "15px 20px",
                                          backgroundColor: "#fff",
                                        }}
                                        onChange={(e) =>
                                          setMetaRobot(e.target.value)
                                        }
                                      >
                                        <option value="">Select Type</option>
                                        <option value="index, follow">
                                          index, follow
                                        </option>
                                        <option value="noindex, nofollow">
                                          noindex, nofollow
                                        </option>
                                      </select>
                                    </div>
                                    <span className="text-danger">
                                      {errors.metaRobot}
                                    </span>
                                    <div
                                      style={{
                                        display: "flex",
                                        marginBottom: "20px",
                                        alignItems: "end",
                                        marginTop: "25px",
                                      }}
                                    >
                                      <h5 className="m-0 seo-titles">
                                        Permalink:{" "}
                                      </h5>

                                      <div
                                        className="input-wrapper"
                                        style={{
                                          
                                          paddingLeft: "15px",
                                          marginBottom: "0px",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        limousine4hire.net
                                      </div>
                                    </div>

                                    <div
                                      className="input-wrapper"
                                      style={{
                                        marginBottom: "0",
                                        backgroundColor: "#fff",
                                        height: "100px",
                                        paddingTop:"15px",
                                        paddingBottom:"10px"
                                      }}
                                    >
                                      <h5
                                        className="seo-titles"
                                        style={{ verticalAlign: "middle" }}
                                      >
                                        Page URL:
                                      </h5>
                                      <textarea
                                        type="text"
                                        style={{
                                          border: "none",
                                          paddingLeft: "24px",
                                          height: "100px",
                                        }}
                                        placeholder="Use Short URLs / SEO Friendly. Should be simple to digest for both readers and search engines.
                                          • Remove the extra, unnecessary words.
                                          • Use only one or two keywords.
                                          • Use HTTPS only, as Google now uses that as a positive ranking factor."
                                        value={pageUrl}
                                        onChange={(e) =>
                                          setPageUrl(e.target.value)
                                        }
                                      />
                                      {/* <ul
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: "400",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        <li>
                                          Remove the extra, unnecessary words.
                                        </li>
                                        <li>Use only one or two keywords.</li>
                                        <li>
                                          Use HTTPS only, as Google now uses
                                          that as a positive ranking factor.
                                        </li>
                                      </ul> */}
                                    </div>
                                    <span className="text-danger">
                                      {errors.pageUrl}
                                    </span>
                                    <div
                                      style={{
                                        backgroundColor: "#fff",
                                        marginBottom: "0",
                                        marginTop: "29px",
                                        paddingLeft: "24px",
                                        borderRadius: "5px",
                                      }}
                                      className="d-flex flex-column gap-1"
                                    >
                                      <h5
                                        className="seo-titles"
                                        style={{
                                          marginBottom: "0",
                                          paddingTop: "15px",
                                        }}
                                      >
                                        Meta Description
                                      </h5>
                                      <div className="input-wrapper bg-transparent mb-0">
                                        <textarea
                                          type="text"
                                          style={{
                                            border: "none",
                                            background: "transparent",
                                          }}
                                          placeholder="Enter Page Meta Description (Keep under 160 characters including spaces, include entire keyword or keyword phrase and including spaces. (Use a complete, compelling sentence (or two)"
                                          value={metaDescription}
                                          onChange={(e) =>
                                            setMetaDescription(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>

                                    <span className="text-danger">
                                      {errors.metaDescription}
                                    </span>
                                    <div
                                      style={{
                                        backgroundColor: "#fff",
                                        marginBottom: "0",
                                        marginTop: "29px",
                                        paddingTop: "20px",
                                        paddingLeft: "24px",
                                      }}
                                      className="d-flex flex-column gap-1"
                                    >
                                      <h5 className="seo-titles">
                                        Structure Markup:
                                      </h5>
                                      <span>
                                        SEO will provide/ create a JSON code
                                        that needs to be implemented on the web
                                        page either on the header or footer. So
                                        on the CMS, we need a Front end Field so
                                        that we can enter this code.
                                      </span>
                                      <div className="input-wrapper bg-transparent mb-0">
                                        <textarea
                                          type="text"
                                          style={{
                                            border: "none",
                                            paddingLeft: "24px",
                                            height: "270px",
                                          }}
                                          className="bg-transparent"
                                          placeholder="Example:  (JSON Code) <script type='application/ld+json'>
                                            {
                                              '@context': 'https://schema.org',
                                              '@type': 'Organization',
                                              'name': '',
                                              'url': '',
                                              'logo': ''
                                            }
                                            </script>
                                            "
                                          value={globalStructureMarkup}
                                          onChange={(e) =>
                                            setGlobalStructureMarkup(
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>

                                    <span className="text-danger">
                                      {errors.globalStructureMarkup}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="accordion m-0">
                            <Col
                              className="accordion-col"
                              xs={12}
                              style={{ paddingLeft: "0", paddingRight: "0" }}
                            >
                              <Accordion
                                className="custom-accordion"
                                defaultActiveKey={["0"]}
                                alwaysOpen
                              >
                                <Accordion.Item
                                  eventKey="0"
                                  style={{ borderRadius: "0px" }}
                                >
                                  <Accordion.Header className="social-media-links">
                                    Social Media Links
                                  </Accordion.Header>
                                  <Accordion.Body
                                    style={{ backgroundColor: "#fff" }}
                                  >
                                    <Tabs
                                      defaultActiveKey="twitter"
                                      id="uncontrolled-tab-example"
                                      className="mb-3 sub-tabs no-border"
                                    >
                                      <Tab eventKey="twitter" title="Twitter">
                                        <div
                                          className="input-wrapper"
                                          style={{
                                            marginBottom: "25px",
                                            backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          <h5 className="seo-titles">
                                            Twitter Title:
                                          </h5>
                                          <input
                                            style={{ paddingLeft: "10px" }}
                                            type="text"
                                            placeholder="Enter Twitter title here..."
                                            value={twitterTitle}
                                            onChange={(e) =>
                                              setTwitterTitle(e.target.value)
                                            }
                                          ></input>
                                        </div>
                                        <span className="text-danger">
                                          {errors.twitterTitle}
                                        </span>
                                        <div
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                            marginBottom: "0",
                                            paddingLeft: "10px",
                                            borderRadius: "5px",
                                          }}
                                        >
                                          <h5
                                            className="seo-titles"
                                            style={{
                                              marginBottom: "0",
                                              paddingTop: "15px",
                                            }}
                                          >
                                            Twitter Description :
                                          </h5>
                                          <div className="input-wrapper">
                                            <textarea
                                              type="text"
                                              style={{
                                                backgroundColor: "#f2f2f2",
                                                border: "none",
                                                height: "270px",
                                              }}
                                              value={twitterDescription}
                                              onChange={(e) =>
                                                setTwitterDescription(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <span className="text-danger">
                                            {errors.twitterDescription}
                                          </span>
                                        </div>
                                      </Tab>
                                      <Tab eventKey="facebook" title="Facebook">
                                        <div
                                          className="input-wrapper"
                                          style={{
                                            marginBottom: "25px",
                                            backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          <h5 className="seo-titles">
                                            Facebook Title:
                                          </h5>
                                          <input
                                            style={{ paddingLeft: "10px" }}
                                            type="text"
                                            placeholder="Enter Facebook title here..."
                                            value={facebookTitle}
                                            onChange={(e) =>
                                              setFacebookTitle(e.target.value)
                                            }
                                          ></input>
                                        </div>
                                        <span className="text-danger">
                                          {errors.facebookTitle}
                                        </span>
                                        <div
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                            marginBottom: "0",
                                            paddingLeft: "10px",
                                            borderRadius: "5px",
                                          }}
                                        >
                                          <h5
                                            className="seo-titles"
                                            style={{
                                              marginBottom: "0",
                                              paddingTop: "15px",
                                            }}
                                          >
                                            Facebook Description :
                                          </h5>
                                          <div className="input-wrapper">
                                            <textarea
                                              type="text"
                                              style={{
                                                backgroundColor: "#f2f2f2",
                                                border: "none",
                                                height: "270px",
                                              }}
                                              value={facebookDescription}
                                              onChange={(e) =>
                                                setFacebookDescription(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <span className="text-danger">
                                            {errors.facebookDescription}
                                          </span>
                                        </div>
                                      </Tab>
                                      <Tab eventKey="youtube" title="Youtube">
                                        <div
                                          className="input-wrapper"
                                          style={{
                                            marginBottom: "25px",
                                            backgroundColor: "#f2f2f2",
                                          }}
                                        >
                                          <h5 className="seo-titles">
                                            Youtube Title:
                                          </h5>
                                          <input
                                            style={{ paddingLeft: "10px" }}
                                            type="text"
                                            placeholder="Enter Youtube title here..."
                                            value={youtubeTitle}
                                            onChange={(e) =>
                                              setYoutubeTitle(e.target.value)
                                            }
                                          ></input>
                                        </div>
                                        <span className="text-danger">
                                          {errors.youtubeTitle}
                                        </span>
                                        <div
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                            marginBottom: "0",
                                            paddingLeft: "10px",
                                            borderRadius: "5px",
                                          }}
                                        >
                                          <h5
                                            className="seo-titles"
                                            style={{
                                              marginBottom: "0",
                                              paddingTop: "15px",
                                            }}
                                          >
                                            Youtube Description :
                                          </h5>
                                          <div className="input-wrapper">
                                            <textarea
                                              type="text"
                                              style={{
                                                backgroundColor: "#f2f2f2",
                                                border: "none",
                                                height: "270px",
                                              }}
                                              value={youtubeDescription}
                                              onChange={(e) =>
                                                setYoutubeDescription(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <span className="text-danger">
                                            {errors.youtubeDescription}
                                          </span>
                                        </div>
                                      </Tab>
                                    </Tabs>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Col>
                          </Row>
                        </Tab>
                      </Tabs>
                   </div>
                     
                      <Row>
                        {" "}
                        <div
                          className="row"
                          style={{
                            justifyContent: "end",
                            marginRight: "15px",
                            marginTop: "15px",
                          }}
                        >
                          <h6
                            className="delete"
                            style={{
                              border: "1px solid",
                              borderRadius: "12px",
                              padding: "10px 20px",
                              width: "fit-content",
                              marginRight: "15px",
                              fontSize: "18px",
                              fontWeight: "700",
                            }}
                            onClick={cancelHandler}
                          >
                            Cancel
                          </h6>
                          <h6
                            className="update"
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              width: "fit-content",
                              padding: "10px 20px",
                            }}
                            onClick={next}
                          >
                            Update
                          </h6>
                        </div>
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
export default ServicePage;
