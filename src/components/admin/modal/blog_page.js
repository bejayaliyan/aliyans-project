import React, { useEffect, useState } from "react";
import { Row, Col, CloseButton, Tabs, Tab } from "react-bootstrap";
import "./driver_modal.scss";
import ImageUploading from "react-images-uploading";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Sidebar from "../pages/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DynamicTimer } from "../components/timer";
import { BellPic } from "../components/bellPic";
import UserIcon from "../components/userIcon";
import Accordion from "react-bootstrap/Accordion";
import {
  fetchCategories,
  fetchTags,
} from "../../../redux/actions/UserstateActions";
import { useDispatch } from "react-redux";
import Select from "react-select";


const BlogPage = ({ userName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const location = useLocation();
  const data = location.state ? location.state.data : null;

  const maxNumber = 69;

  const [name, setName] = useState();
  const [title, setTitle] = useState();
  const [shortDescription, setShortDescription] = useState();
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState();
  const [tags, setTags] = useState();
  const [tagsData, setTagsData] = useState();
  const [content, setContent] = useState();
  const [modalId, setModalId] = useState();
  const [blogImage, setBlogImage] = useState();
  const [altText, setAltText] = useState();
  const [isImageChanged, setIsImageChanged] = useState(false);
  // const [modalImageurl, setModalImageUrl] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);
  
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
  

  const cancelHandler = () => {
    navigate(`/admin/blogs`);
  };

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 250) {
      setName(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Blog page name must be less than 255 characters.",
      }));
    }
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
        title: "Blog title must be less than 60 characters.",
      }));
    }
  };

  const handleShortDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 160) {
      setShortDescription(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        shortDescription: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        shortDescription:
          "Blog short description must be less than 160 characters.",
      }));
    }
  };

  const onChange = (customValue) => (imageList, addUpdateIndex) => {
    setIsImageChanged(true);
    if (customValue == "blogImage") {
      setBlogImage(imageList);
    }

    let filesize = 0;
    for (let i = 0; i < imageList.length; i++) {
      filesize = filesize + imageList[i].file.size;
    }

    if (filesize > 500 * 1024 * 5) setErrors({ file: "image size is too big" });
    else setErrors({ file: "" });
  };

  const onImageTempRemove = (index) => {
    // var updatedList = Array.from(modalImageurl);
    var updatedList = Array.from(blogImage);
    if (Array.isArray(index)) {
      index.forEach(function (i) {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(index, 1);
    }
    setBlogImage(updatedList);
  };

  const handleEditorChange = (html) => {
    setContent(html);
    if (html.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "",
      }));
    }
  };

  const handleCategoriesSelect = (data) => {
    setCategories(data);
  };

  const handleTagsSelect = (data) => {
    setTags(data);
    // console.log("data:: ", data);
    if (data.length) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tags: "",
      }));
    }
  };

  const handleAltTextChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 125) {
      setAltText(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        altText: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        altText: "Alt text must be less than 125 characters.",
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
    if (!blogImage) validationErrors["file"] = "image is required";
    let error = validate(name);
    if (error && error.length > 0) validationErrors["name"] = error;
    error = validate(title);
    if (error && error.length > 0) validationErrors["title"] = error;
    error = validate(shortDescription);
    if (error && error.length > 0) validationErrors["shortDescription"] = error;
    error = validate(categories);
    if (error && error.length > 0) validationErrors["categories"] = error;
    error = validate(tags);
    if (error && error.length > 0) validationErrors["tags"] = error;
    error = validate(altText);
    if (error && error.length > 0) validationErrors["altText"] = error;
    error = validate(content);
    if (error && error.length > 0) validationErrors["content"] = error;
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
    temp.name = name;
    temp.title = title;
    temp.short_description = shortDescription;
    temp.categories = categories;
    temp.tags = tags;
    temp.alt_text = altText;
    temp.content = content;
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

    const formData = new FormData();
    let temp_blog_image_files = [];

    if (blogImage) {
      blogImage.map((image) => {
        temp_blog_image_files.push({
          title: "blogImage",
          file: image.file,
        });
      });
    }

    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);

      temp.urls = JSON.parse(data.urls);
      if (isImageChanged) {
        temp_blog_image_files.map((file) => {
          formData.append("uploadImages", file.file, file.title);
        });
        setLoadingShow(true);
        if (blogImage) {
          const result = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/admin/blog/upload`,
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
      }
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/blog/update`, temp)
        .then((res) => {
          setLoadingShow(false);

          addToast("Blog updated successfully! ", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/blogs`);
        })
        .catch((err) => {
          addToast("Blog update failed! " + err, {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
    } else {
      temp_blog_image_files.map((file) => {
        formData.append("uploadImages", file.file, file.title);
      });
      setLoadingShow(true);
      if (blogImage) {
        const result = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/blog/upload`,
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
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/blog/create`, temp)
        .then((res) => {
          setLoadingShow(false);
          addToast("Blog created successfully! ", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/blogs`);
        })
        .catch((err) => {
          addToast("Blog creation failed! " + err, {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
      setLoadingShow(false);
    }
  };

  useEffect(() => {
    if (data) {
      setErrors([]);
      setName(data.name);
      setTitle(data.title);
      setShortDescription(data.short_description);
      setContent(data.content);
      setAltText(data.alt_text);
      setCategories(JSON.parse(data.categories));
      setTags(JSON.parse(data.tags));
      setBlogImage(JSON.parse(data.urls));
      setModalId(data.id);
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
      // setModalImageUrl(JSON.parse(data.urls));
    }
  }, [data]);

  useEffect(() => {
    if (!categoriesData) getCatogoriesData();
  }, []);

  const getCatogoriesData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/categories/get`)
      .then((res) => {
        dispatch(fetchCategories(res.data));
        const newArray = res?.data?.map((item) => ({
          label: item.category,
          value: item.category,
        }));
        setCategoriesData(newArray);
      });
  };

  useEffect(() => {
    if (!tagsData) getTagsData();
  }, []);

  const getTagsData = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/tags/get`)
      .then((res) => {
        dispatch(fetchTags(res.data));
        const newArray = res?.data?.map((item) => ({
          label: item.tag,
          value: item.tag,
        }));
        setTagsData(newArray);
      });
  };

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
                    <div className="card-body p-3">
                      <div className="card-body__header">
                        <div className="caption mb-5">
                          <h5
                            style={{
                              textTransform: "capitalize",
                              fontSize: "24px",
                            }}
                          >
                            Add New Blog
                          </h5>
                        </div>
                      </div>
                      <div className="card-body__content">
                        <h2 style={{ fontWeight: "700" }}>Blog Info</h2>
                        <div
                          className="input-wrapper mt-4"
                          style={{ marginBottom: "0" }}
                        >
                          <h5 className="p4">Blog Page Name:</h5>
                          <input
                            type="text"
                            placeholder="Enter Blog Page Name"
                            className="pd10 ml24"
                            value={name}
                            onChange={handleNameChange}
                          ></input>
                        </div>
                        <span className="text-danger">{errors.name}</span>
                        <div
                          className="input-wrapper mt-4"
                          style={{ marginBottom: "0" }}
                        >
                          <h5 className="p4">Blog Title:</h5>
                          <input
                            className="pd10"
                            type="text"
                            placeholder="Keep under 60 characters/ max 60 pixels including spaces, Use your keyword in title tag (In Front of title wherever Possible"
                            value={title}
                            onChange={handleTitleChange}
                          ></input>
                        </div>
                        <span className="text-danger">{errors.title}</span>
                        <div className="align-items-start d-flex flex-column gap-2 input-wrapper p-3 mt-4 mb-0">
                          <h5
                            style={{
                              backgroundColor: "rgba(242, 242, 242, 0.4)",
                              padding: "0px",
                            }}
                            className="p4"
                          >
                            Meta Description:
                          </h5>
                          <textarea
                      
                            type="text"
                            rows="3"
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                            placeholder="Enter Page Meta Description (Keep under 160 characters including spaces, include entire keyword or keyword phrase and including spaces. (Use a complete, compelling sentence (or two)"
                            value={shortDescription}
                            onChange={handleShortDescriptionChange}
                          />
                        </div>

                        <span className="text-danger">
                          {errors.shortDescription}
                        </span>
   
                      

                     




                        
                      </div>

                      <div className="card-body blogtab  mt-4">
                       <Tabs
                        className=" font32 mb-3 border-0"
                        defaultActiveKey="home"
                        id="justify-tab-example"
                      
                      
                       
                       >
                         <Tab eventKey="home" title="Content" className="content-tab">
                         <div
                          className="input-wrapper mt-4 mb-0 bgwhite"
                          style={{ width: "100%", backgroundColor: "#fff", }}
                        >
                          <h5 className="p4">Select Categories:</h5>
                          <Select
                            styles={{
                              backgroundColor: "rgb(255, 255, 255)",
                            }}
                            options={categoriesData}
                            value={categories}
                            onChange={handleCategoriesSelect}
                            isMulti
                            className="pd10"
                          />
                        </div>
                        <span className="text-danger">{errors.categories}</span>

                        <div
                          className="input-wrapper mt-4 mb-0 bgwhite"
                          style={{ width: "100%" ,backgroundColor: "#fff" }}
                        >
                          <h5 className="p4">Select Tags:</h5>
                          <Select
                            styles={{
                              backgroundColor: "rgba(242, 242, 242, 0.4)",
                            }}
                            options={tagsData}
                            value={tags}
                            onChange={handleTagsSelect}
                            isMulti
                           className="pd10"
                          />
                        </div>
                        <span className="text-danger">{errors.tags}</span>
                         <Row className="mt-4">
                        <Col xs={12}>


                          <h6>Upload Image*</h6>
                          <div
                            className="row"
                            style={{
                              position: "relative",
                              justifyContent: "center",
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <ImageUploading
                                multiple={false}
                                value={blogImage}
                                onChange={onChange("blogImage")}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                                acceptType={['jpg','png', 'jpeg']}
                              >
                                {({
                                  imageList,
                                  onImageUpload,
                                  onImageUpdate,
                                  onImageRemove,
                                  dragProps,
                                }) => (
                                  <div style={{ marginTop: "15px" }}>
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
                                        className="delete BlogImgPad"
                                        style={{
                                          color: "#F4730E",
                                          border: "1px solid",
                                          borderRadius: "12px",
                                          padding: "12px 60px",
                                        }}
                                      >
                                        Add Blog Image &nbsp;
                                      </h6>
                                    </div>

                                    <div
                                      className="align-items-center d-flex gap-3"
                                      style={{
                                        fontSize: "10px",
                                        padding: "10px 5px",
                                        marginRight: "5px",
                                        borderRadius: "4px",
                                        marginTop: "50px",
                                        backgroundColor: "#fff",
                                      }}
                                    >
                                      <div>
                                        <h5 className="m-0" style={{paddingTop:"5px"}}>Alt Text</h5>
                                      </div>
                                      <div className="col">
                                        <input
                                          className="alt-text-input"
                                          type="text"
                                          placeholder="(Max 125 Characters (not including spaces) Make it descriptive and specific:)"
                                          value={altText}
                                          onChange={handleAltTextChange}
                                          multiline
                                        ></input>
                                        <span className="text-danger">
                                          {errors.altText}
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className="modal-left__thumb driver-img__wrapper"
                                      style={{
                                        display: "grid",
                                        marginTop: "50px",
                                        width: "130px",
                                        height: "127px",
                                        border: "1px dotted #BDBDBD",
                                        position: "relative",
                                      }}
                                    >
                                      <span
                                        className="dimension-placeholer"
                                        style={{ left: "22%" }}
                                      >
                                        845 x 645
                                      </span>
                                      {blogImage
                                        ? blogImage.map((val, index) => {
                                            return (
                                              <div
                                                style={{
                                                  display: "relative",
                                                  margin: "auto",
                                                  zIndex: "1"
                                                }}
                                                key={index}
                                              >
                                                <img
                                                  src={
                                                    val.data_url
                                                      ? val.data_url
                                                      : `${
                                                          process.env
                                                            .REACT_APP_IMAGE_BASE_URL +
                                                          val.name
                                                        }`
                                                  }
                                                  width="128"
                                                  height="95"
                                                  alt="car"
                                                />
                                                <CloseButton
                                                  onClick={() =>
                                                    onImageTempRemove(index)
                                                  }
                                                  style={{
                                                    position: "absolute",
                                                    top: "-5px",
                                                    right: "-26px"
                                                  }}
                                                />
                                              </div>
                                            );
                                          })
                                        : ""}
                                    </div>
                                  </div>
                                )}
                              </ImageUploading>
                              <span className="text-danger">{errors.file}</span>
                            </div>
                            <div
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
                              <span
                                className="text-muted"
                                style={{ fontFamily: "lato" }}
                              >
                                Our Primary keyword or focused keyword should be
                                in the ALT tag of the image
                              </span>
                            </div>
                          </div>

                          <Accordion
                            className="custom-accordion mb-5 mt-5"
                            defaultActiveKey={["0"]}
                            alwaysOpen
                          >
                            <Accordion.Item
                              eventKey="0"
                              style={{ border: "none" }}
                            >
                              <Accordion.Header className="social-media-links white-bg">
                                Content/Text
                              </Accordion.Header>
                              <Accordion.Body
                                style={{
                                  
                                  padding: "0",
                                  backgroundColor:"#fbfbfb"
                                }}
                              >
                                <div className="input-wrapper">
                                  <ReactQuill
                                    value={content}
                                    onChange={handleEditorChange}
                                  />
                                </div>
                                <span className="text-danger">
                                  {errors.content}
                                </span>

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
                                    Synonyms and LSI Keywords (Just add a few or
                                    LSI Keywords to your page.)
                                  </span>
                                </div>

                                <div
                                  className="d-flex gap-2 align-items-start"
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
                                        width:"fit-content",
                                        padding:"0px"
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
                                      option of nofollow or dofollow. By default
                                      it should be dofollow. Like in the example
                                      given below <br /> &lt;a
                                      href="https://example.com"
                                      rel="nofollow"&gt;blue text&lt;/a&gt;{" "}
                                      <br /> &lt;a
                                      href="https://example.com"&gt;blue
                                      text&lt;/a&gt;
                                    </p>
                                  </div>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>

                        
                       
                        </Col>
                      </Row>
     
     
      </Tab>
      <Tab eventKey="profile" title="SEO"  >
      <div
                            className="m-0 "
                          
                          >
                            <div >
                              <div
                                className="card"
                                style={{
                                  border: "none",
                                  backgroundColor: "#f2f2f200",
                                  borderRadius: "0px"
                                }}
                              >
                                <div
                                 
                                  
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
                            </div>
                          </div>
                          <div className="accordion mt-4 mb-4 mx-1">
                            <div
                              className="accordion-col"
                              xs={12}
                              // style={{ paddingLeft: "0", paddingRight: "0" }}
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
                            </div>
                          </div>
      </Tab>
                       </Tabs>
                       <div
                            className="row"
                            style={{
                              justifyContent: "end",
                              marginRight: "15px",
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
                              style={{ fontSize: "18px", fontWeight: "700" }}
                              onClick={next}
                            >
                              Add
                            </h6>
                          </div>
                       </div>
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
export default BlogPage;
