import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../pages/sidebar";
import { Link, useLocation } from "react-router-dom";
import { DynamicTimer } from "../components/timer";
import { BellPic } from "../components/bellPic";
import {
  fetchFields,
  fetchPages,
  fetchSeos,
  fetchServices,
} from "../../../redux/actions/UserstateActions";
import UserIcon from "../components/userIcon";
import Select from "react-select";
import "./book_rider.scss";
import "react-quill/dist/quill.snow.css";
import { useToasts } from "react-toast-notifications";
import { useDispatch } from "react-redux";
import downerorw from "../../../assets/images/Polygon2.png"

const Seo = ({ userName }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [updatedArray, setUpdatedArray] = useState();
  const [data, setData] = useState();
  const [services, setServices] = useState();
  const [pages, setPages] = useState();
  const [pageDropdown, setPageDropdown] = useState();
  const [globalStructureMarkup, setGlobalStructureMarkup] = useState();
  const [googleAnalytics, setGoogleAnalytics] = useState();
  const [googleSiteVerification, setGoogleSiteVerification] = useState();
  const [roboTxt, setRoboTxt] = useState();
  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  

  const validate = (value) => {
    if (!value) {
      return "Field is required";
    }
  };

  const next = () => {
    const validationErrors = {};
    let error = validate(pageDropdown.length > 0);
    if (error && error.length > 0) validationErrors["pageDropdown"] = error;
    error = validate(globalStructureMarkup);
    if (error && error.length > 0)
      validationErrors["globalStructureMarkup"] = error;
    error = validate(googleAnalytics);
    if (error && error.length > 0) validationErrors["googleAnalytics"] = error;
    error = validate(googleSiteVerification);
    if (error && error.length > 0)
      validationErrors["googleSiteVerification"] = error;
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
    // temp.page = pageDropdown;
    // temp.global_structure_markup = globalStructureMarkup;
    // temp.google_analytics = googleAnalytics;
    // temp.site_verification_meta_tag = googleSiteVerification;
    temp.field_name = "global_seo";
    temp.value = JSON.stringify({
      page: pageDropdown,
      global_structure_markup: globalStructureMarkup,
      google_analytics: googleAnalytics,
      site_verification_meta_tag: googleSiteVerification,
    });

    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (data) {
      temp.id = data.id;
      setLoadingShow(true);
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/field/update`, temp)
        .then((res) => {
          setLoadingShow(false);
          if (res.status == 200) {
            addToast("Seo page updated successfully!", {
              appearance: "success",
              autoDismiss: true,
              autoDismissTimeout: 3000,
            });
            getData();
          }
        })
        .catch((err) => {
          addToast("Seo page update failed!", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
    } else {
      setLoadingShow(true);

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/field/create`, temp)
        .then((res) => {
          setLoadingShow(false);
          addToast("Seo page created successfully!", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          getData();
        })
        .catch((err) => {
          addToast("Seo page creation failed!", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        });
      setLoadingShow(false);
    }
  };

  const getData = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/fields/getByName/global_seo`
      )
      .then((res) => {
        dispatch(fetchFields(res?.data));
        setData(res?.data);
      });
  };

  const mergeArrays = async () => {
    try {
      const [servicesRes, pagesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/services/get`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/pages/get`),
      ]);

      const servicesData = servicesRes.data;
      const pagesData = pagesRes.data;

      const servicesArr = servicesData.map((item) => ({
        label: item.title,
        value: item.page_url,
      }));

      const pagesArr = pagesData.map((item) => ({
        label: item.name,
        value: item.page_url,
      }));

      const mergedArr = [...servicesArr, ...pagesArr];

      dispatch(fetchServices(servicesData));
      dispatch(fetchPages(pagesData));
      setServices(servicesArr);
      setPages(pagesArr);
      setUpdatedArray(mergedArr);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const roboTxtClickHandler = () => {
    let temp = {};
    temp.robo_txt = roboTxt;

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/admin/robot/create`, temp)
      .then((res) => {
        addToast("Robo text created successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });        
        if(res.status == 200){
          handleRobotDownload();          
        }        
      })
      .catch((err) => {
        addToast(err.response.data.message, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });
      });
  };

  const handleRobotDownload = async () => {
    try {            
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/robot/downloadrobotfile`);
        if (!response.ok) throw new Error("Failed to download file");
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "robots.txt";
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download error:", error);
    }
};

  const handleDropdownSelect = (data) => {
    setPageDropdown(data);
  };

  useEffect(() => {    
    mergeArrays();
    if (data) {
      const jsonData = JSON.parse(data?.value);
      setGlobalStructureMarkup(jsonData?.global_structure_markup);
      setGoogleAnalytics(jsonData?.google_analytics);
      setGoogleSiteVerification(jsonData?.site_verification_meta_tag);
      
      const newArray1 = jsonData?.page?.filter(item1 =>
        updatedArray?.some(item2 => item1?.label === item2?.label)
      );
      setPageDropdown(newArray1);
    }
    if (!data) getData();
  }, [data]);

  const handleGenerateSiteMap = () =>{
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/seo/generatesitemap`)
      .then((res) => {        
        if(res.status == 200){
          addToast("site-map.xml file generated successfully", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          handleSiteMapDownload();
        }else{
          addToast("site-map.xml file not generated", {
            appearance: "error",
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
        }
      });
  }

  const handleSiteMapDownload = async () => {
    try {            
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/seo/downloadsitemapfile`);
        if (!response.ok) throw new Error("Failed to download file");
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "sitemap.xml";
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download error:", error);
    }
};

  return (
    <>
      <div className="dashboard">
        <Sidebar />
        <div className="content book_rider service-page">
          <div className="content-panel">
            <div className="content-panel__heading">
              <div
                className="caption cms-caption"
                style={{ paddingBottom: "0" }}
              >
                <h5>Welcome, {userName}</h5>
                <DynamicTimer />
              </div>
              <div className="dropdown gap-5">
                <div className="nav-item bell m-0">
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
                  <div className="card" style={{ border: "none" }}>
                    <div className="card-body" style={{ padding: "30px 20px" }}>
                      <div
                        className="card-body__content"
                        style={{ marginBottom: "60px" }}
                      >
                        <div
                          className="input-wrapper svg-icon"
                          style={{ width: "100%", marginBottom: "36.4px" }}
                        >
                          <Select
                            styles={{
                              border: "none",
                              width: "100%",
                              marginLeft: "0",
                              padding: "20px 25px",
                            }}
                            options={updatedArray}
                            value={pageDropdown}
                            onChange={handleDropdownSelect}
                            isMulti
                            placeholder="Please select the page from dropdown to enable Global Structure Markup"
                          />
                           <span> <img width="100%" src={downerorw} alt='downerorw' className='downerorw' /></span> 
                        </div>
                        <span className="text-danger">
                          {errors.pageDropdown}
                        </span>
                        <div
                          style={{
                            backgroundColor: "rgba(242, 242, 242, 0.4)",
                            marginBottom: "0",
                            paddingTop: "20px",
                            paddingLeft: "24px",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                            }}
                          >
                            Global Structure Markup:
                          </h5>
                          <span>
                            SEO will provide/ create a JSON code that needs to
                            be implemented on the web page either on the header
                            or footer. So on the CMS, we need a Front end Field
                            so that we can enter this code.
                          </span>
                        </div>
                        <div
                          className="input-wrapper"
                          style={{ marginBottom: "36.4px" }}
                        >
                          <textarea
                            type="text"
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              paddingLeft: "24px",
                              height: "270px",
                            }}
                            placeholder="{
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            'name': '',
                            'url': '',
                            'logo': ''
                          }
                          </script>"
                            value={globalStructureMarkup}
                            onChange={(e) =>
                              setGlobalStructureMarkup(e.target.value)
                            }
                          />
                        </div>

                        <span className="text-danger">
                          {errors.globalStructureMarkup}
                        </span>

                        <div
                          style={{
                            backgroundColor: "rgba(242, 242, 242, 0.4)",
                            marginBottom: "0",
                            paddingTop: "20px",
                            paddingLeft: "24px",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                            }}
                          >
                            Google Analytics:
                          </h5>
                          <span>Add Google Analytics JavaScript Here </span>
                        </div>

                       
                        <div
                          className="input-wrapper"
                          style={{ marginBottom: "33px" }}
                        >
                          <textarea
                            type="text"
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              paddingLeft: "24px",
                              height: "270px",
                            }}
                            value={googleAnalytics}
                            onChange={(e) => setGoogleAnalytics(e.target.value)}
                          />
                        </div>
                       <div>
                          <a href="javascript:;" className="orangebtn mb16" onClick={next}>Update</a>
                          </div>
                          <div>
                            <Link to="/admin/seo/manage_meta_tag" className="orangebtn mb16">
                            Manage Meta Tag
                            </Link>
                         
                          </div> 

                        <span className="text-danger">
                          {errors.googleAnalytics}
                        </span>

                        <div
                          className="input-wrapper"
                          style={{
                            border: "none",
                            width: "100%",
                            marginLeft: "0px",
                            padding: "18px 24px",
                          }}
                        >
                          <h5 className="p-0">
                            Google site verification Meta tag:
                          </h5>
                          <input
                            type="text"
                            placeholder="Please Add the Google Site Verification Here"
                            style={{ marginLeft: "19px" }}
                            value={googleSiteVerification}
                            onChange={(e) =>
                              setGoogleSiteVerification(e.target.value)
                            }
                          ></input>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontStyle: "italic",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <b style={{ fontSize: "16px", fontStyle: "normal" }}>
                            Example:
                          </b>
                          <span className="text-muted">
                            &emsp;&lt;meta name="google-site-verification"
                            content="4sQM7I6qFlE6OI1OFe4k_e7TBUjdXg2mYEOjYVRvyu0"
                            /&gt;
                          </span>
                        </div>
                        <span className="text-danger">
                          {errors.googleSiteVerification}
                        </span>
                        <div style={{ float: "right" }}>
                          {/* <h6
                            className="update FontSizeMobileView"
                            onClick={next}
                            style={{ widhth: "100%" }}
                          >
                            Submit
                          </h6> */}
                        </div>
                      </div>

                      <Row>
                        <Col xs={12}>
                          {/* <h6>Upload Image*</h6> */}
                          <div
                            className="row"
                            style={{
                              position: "relative",
                              justifyContent: "center",
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <div className="d-flex flex-column">
                                <div
                                  className="btns"
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    position: "relative",
                                  }}
                                >
                                  <div className="d-flex flex-column gap-3">
                                    <b>Generate site-map.xml</b>
                                    <h6
                                      className="delete"
                                      style={{
                                        background: "rgb(244, 115, 14)",
                                        color: "#fff",
                                        border: "1px solid",
                                        borderRadius: "12px",
                                        padding: "12px 60px",
                                      }}
                                     onClick={() => handleGenerateSiteMap()} >
                                      Generate &nbsp;
                                    </h6>
                                  </div>
                                </div>
                                <span
                                  className="text-muted"
                                  style={{
                                    marginBottom: "37px",
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Site Map should only inlude those pages which
                                  have (index, follow) option.
                                </span>

                                <div>
                                  <div
                                    style={{
                                      backgroundColor:
                                        "rgba(242, 242, 242, 0.4)",
                                      marginBottom: "0",
                                      paddingTop: "20px",
                                      paddingLeft: "24px",
                                    }}
                                  >
                                    <h5
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Generate robot.txt
                                    </h5>
                                    <span className="text-muted">
                                      Robots.txt is a file on the root of the
                                      hosting. This file will be generated and
                                      uploaded / updated on the hosting server.
                                    </span>
                                  </div>
                                  <div
                                    className="input-wrapper"
                                    style={{ marginBottom: "33px" }}
                                  >
                                    <textarea
                                      type="text"
                                      style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                        paddingLeft: "24px",
                                        height: "270px",
                                      }}
                                      value={roboTxt}
                                      onChange={(e) =>
                                        setRoboTxt(e.target.value)
                                      }
                                    />
                                  </div>

                                  <span className="text-danger">
                                    {errors.googleAnalytics}
                                  </span>
                                </div>
                                <div
                                  className="btns"
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    position: "relative",
                                  }}
                                  onClick={roboTxtClickHandler}
                                >
                                  <h6
                                    className="delete"
                                    style={{
                                      background: "rgb(244, 115, 14)",
                                      color: "#fff",
                                      border: "1px solid",
                                      borderRadius: "12px",
                                      padding: "12px 60px",
                                    }}
                                  >
                                    Generate &nbsp;
                                  </h6>
                                </div>
                              </div>
                              <span className="text-danger">
                                {errors.roboTxt}
                              </span>
                            </div>
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

export { Seo };
