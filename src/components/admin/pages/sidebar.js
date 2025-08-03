import React, { useEffect, useState } from "react";
import logo from "../../../images/Group.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const [active, setActive] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Manage the sidebar visibility
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is mobile or not
  const dropdown = useSelector((state) => state.dropdownToggle);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleDropdown = () => {
    dispatch({ type: "toggle" });
  };

  const blogToggleDropdown = () => {
    dispatch({ type: "blogToggle" });
    navigate(`/admin/blogs`)
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);  // Toggle sidebar open/close
  };
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // Check on mount

    window.addEventListener('resize', checkMobile); // Check on resize
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <div className="PostionBetween">
         <div className="mobileViwImg">
         <NavLink to="/admin">
                <img src={logo} alt="img"></img>
              </NavLink>
         </div>

         <div>
           <button className={`${ isSidebarOpen ? "bg_white zbtn" : "hamburger"}`} onClick={toggleSidebar}>
             {isSidebarOpen ? (
              <i className="fa-solid fa-xmark"></i> 
                
             ) : (
              <i className="fa-solid fa-bars"></i>
             )}
           </button>
         </div>

       </div>
      
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>


        <div className="menu">
          <ul>
            <li>
              <NavLink to="/admin">
                <img src={logo} alt="img"></img>
              </NavLink>
            </li>
            <li>
              <div className="bhhAF">
                <NavLink
                  to="/admin/dashboard"
                  onMouseEnter={() => {
                    setActive("dashboard");
                  }}
                  onMouseLeave={() => {
                    setActive("");
                  }}
                  className={active === "dashboard" ? "active" : ""}
                  style={({ isActive, isHover }) =>
                    isActive || isHover
                      ? {
                        color: "#FBFDFE",
                        padding: "18px 18px",
                        backgroundColor: "#F4730E",
                        borderRadius: "20px",
                      }
                      : {}
                  }
                >
                  <img
                    src="/images/mark/dashboard.png"
                    alt="dashboard"
                    width="24px"
                    height="24px"
                  />
                  <img
                    className="active"
                    src="/images/mark/active_dashboard.png"
                    width="24px"
                    height="24px"
                  />
                  <span className="item-content">dashboard</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div className="bhhAF">
                <NavLink
                  to="/admin/vehicle"
                  onMouseEnter={() => {
                    setActive("vehicle");
                  }}
                  onMouseLeave={() => {
                    setActive("");
                  }}
                  className={active === "vehicle" ? "active" : ""}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "#FBFDFE",
                        padding: "18px 18px",
                        backgroundColor: "#F4730E",
                        borderRadius: "20px",
                      }
                      : {}
                  }
                >
                  <img
                    src="/images/mark/car.png"
                    alt="dashboard"
                    width="24px"
                    height="24px"
                  />
                  <img
                    className="active"
                    src="/images/mark/active_car.png"
                    width="24px"
                    height="24px"
                  />
                  <span className="item-content">Vehicles</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div className="bhhAF">
                <NavLink
                  to="/admin/booking"
                  onMouseEnter={() => {
                    setActive("booking");
                  }}
                  onMouseLeave={() => {
                    setActive("");
                  }}
                  className={active === "booking" ? "active" : ""}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "#FBFDFE",
                        padding: "18px 18px",
                        backgroundColor: "#F4730E",
                        borderRadius: "20px",
                      }
                      : {}
                  }
                >
                  <img
                    src="/images/mark/note-text.png"
                    alt="dashboard"
                    width="24px"
                    height="24px"
                  />
                  <img
                    className="active"
                    src="/images/mark/active_note-text.png"
                    width="24px"
                    height="24px"
                  />
                  <span className="item-content">Bookings</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div className="bhhAF">
                <NavLink
                  to="/admin/driver"
                  onMouseEnter={() => {
                    setActive("driver");
                  }}
                  onMouseLeave={() => {
                    setActive("");
                  }}
                  className={active === "driver" ? "active" : ""}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "#FBFDFE",
                        padding: "18px 18px",
                        backgroundColor: "#F4730E",
                        borderRadius: "20px",
                      }
                      : {}
                  }
                >
                  <img
                    src="/images/mark/people.png"
                    alt="dashboard"
                    width="24px"
                    height="24px"
                  />
                  <img
                    className="active"
                    src="/images/mark/active_people.png"
                    width="24px"
                    height="24px"
                  />
                  <span className="item-content">Drivers</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div className="bhhAF">
                <NavLink
                  to="/admin/book_ride"
                  onMouseEnter={() => {
                    setActive("rider");
                  }}
                  onMouseLeave={() => {
                    setActive("");
                  }}
                  className={active === "rider" ? "active" : ""}
                  style={({ isActive }) =>
                    isActive
                      ? {
                        color: "#FBFDFE",
                        padding: "18px 18px",
                        backgroundColor: "#F4730E",
                        borderRadius: "20px",
                      }
                      : {}
                  }
                >
                  <img
                    src="/images/mark/driving.png"
                    alt="dashboard"
                    width="24px"
                    height="24px"
                  />
                  <img
                    className="active"
                    src="/images/mark/active_driving.png"
                    width="24px"
                    height="24px"
                  />
                  <span className="item-content">Book a ride</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div className="bhhAF">
                <div
                  onMouseEnter={() => {
                    setActive("cms");
                  }}
                  onMouseLeave={() => {
                    setActive("");
                  }}
                  className={`dropdown ${dropdown.dropdown.isOpen ? "active" : ""
                    }`}
                >
                  <a
                    onClick={toggleDropdown}
                    className="cms-title"
                    style={{ color: "#06152B", fontWeight: "700" }}
                  >
                    <span className="item-content" style={{ width: "100%", }}>
                      CMS Menu
                      <i
                        className="fa-solid fa-caret-down"
                        style={{ float: "right" }}
                      ></i>
                    </span>
                  </a>
                </div>
              </div>

              {dropdown.dropdown.isOpen && (
                <div className="dropdown-content" style={{ marginTop: "30px" }}>
                  <ul className="submenu">
                    {/* SEO settings. Will be implemented later */}
                    <li>
                      <div className="bhhAF">
                        <NavLink
                          to="/admin/seo"
                          onMouseEnter={() => {
                            setActive("seo");
                          }}
                          onMouseLeave={() => {
                            setActive("");
                          }}
                          className={active === "seo" ? "active" : ""}
                          style={({ isActive }) =>
                            isActive
                              ? {
                                color: "#FBFDFE",
                                padding: "18px 18px",
                                backgroundColor: "#F4730E",
                                borderRadius: "20px",
                              }
                              : {}
                          }
                        >
                          <img
                            src="/images/mark/files.png"
                            alt="dashboard"
                            width="24px"
                            height="24px"
                          />
                          <img
                            className="active"
                            src="/images/mark/filesactive.png"
                            width="24px"
                            height="24px"
                          />
                          <span className="item-content">SEO Settings</span>
                        </NavLink>
                      </div>
                    </li>

                    {/* Pages. Will be implemented later */}
                    <li>
                      <div className="bhhAF">
                        <NavLink
                          to="/admin/pages"
                          onMouseEnter={() => {
                            setActive("pages");
                          }}
                          onMouseLeave={() => {
                            setActive("");
                          }}
                          className={active === "pages" ? "active" : ""}
                          style={({ isActive }) =>
                            isActive
                              ? {
                                color: "#FBFDFE",
                                padding: "18px 18px",
                                backgroundColor: "#F4730E",
                                borderRadius: "20px",
                              }
                              : {}
                          }
                        >
                          <img
                            src="/images/mark/files.png"
                            alt="dashboard"
                            width="24px"
                            height="24px"
                          />
                          <img
                            className="active"
                            src="/images/mark/filesactive.png"
                            width="24px"
                            height="24px"
                          />
                          <span className="item-content">Pages</span>
                        </NavLink>
                      </div>
                    </li>
                    <li className="bhhAF cms-dropdown">
                      <NavLink
                        to="/admin/services"
                        onMouseEnter={() => {
                          setActive("services");
                        }}
                        onMouseLeave={() => {
                          setActive("");
                        }}
                        className={active === "services" ? "active" : ""}
                        style={({ isActive }) =>
                          isActive
                            ? {
                              color: "#FBFDFE",
                              padding: "18px 18px",
                              backgroundColor: "#F4730E",
                              borderRadius: "20px",
                            }
                            : {}
                        }
                      >
                        <img
                          src="/images/mark/files.png"
                          alt="dashboard"
                          width="24px"
                          height="24px"
                        />
                        <img
                          className="active"
                          src="/images/mark/filesactive.png"
                          width="24px"
                          height="24px"
                        />
                        <span className="item-content">Services</span>
                      </NavLink>
                    </li>
                    <li>
                      <div className="bhhAF">
                        <div
                          onMouseEnter={() => {
                            setActive("blog");
                          }}
                          onMouseLeave={() => {
                            setActive("");
                          }}
                          className={`dropdown ${dropdown.blogDropdown.isOpen ? "active" : ""
                            }`}
                        >
                          <a onClick={blogToggleDropdown}>
                            <img
                              src="/images/mark/files.png"
                              alt="dashboard"
                              width="24px"
                              height="24px"
                            />
                            <img
                              className="active"
                              src="/images/mark/filesactive.png"
                              width="24px"
                              height="24px"
                            />
                            <span className="item-content">Blog</span>
                          </a>
                        </div>
                      </div>

                      {dropdown.blogDropdown.isOpen && (
                        <div className="dropdown-content">
                          <ul className="submenu">
                            <li className="bhhAF blog-dropdown cms-dropdown">
                              <NavLink
                                to="/admin/blogs/tags"
                                onMouseEnter={() => {
                                  setActive("tags");
                                }}
                                onMouseLeave={() => {
                                  setActive("");
                                }}
                                className={active === "tags" ? "active" : ""}
                                style={({ isActive }) =>
                                  isActive
                                    ? {
                                      padding: "18px 18px",
                                    }
                                    : {}
                                }
                              >
                                <img
                                  src="/images/mark/files.png"
                                  alt="dashboard"
                                  width="24px"
                                  height="24px"
                                />
                                <img
                                  className="active"
                                  src="/images/mark/files.png"
                                  width="24px"
                                  height="24px"
                                />
                                <span className="item-content"># Tags</span>
                              </NavLink>
                            </li>
                            <li className="bhhAF blog-dropdown cms-dropdown">
                              <NavLink
                                to="/admin/blogs/categories"
                                onMouseEnter={() => {
                                  setActive("categories");
                                }}
                                onMouseLeave={() => {
                                  setActive("");
                                }}
                                className={
                                  active === "categories" ? "active" : ""
                                }
                                style={({ isActive }) =>
                                  isActive
                                    ? {
                                      padding: "18px 18px",
                                    }
                                    : {}
                                }
                              >
                                <img
                                  src="/images/mark/files.png"
                                  alt="dashboard"
                                  width="24px"
                                  height="24px"
                                />
                                <img
                                  className="active"
                                  src="/images/mark/files.png"
                                  width="24px"
                                  height="24px"
                                />
                                <span className="item-content">Categories</span>
                              </NavLink>
                            </li>
                            <li className="bhhAF blog-dropdown cms-dropdown">
                              <NavLink
                                to="/admin/blogs/comment_approval"
                                onMouseEnter={() => {
                                  setActive("comment-approvals");
                                }}
                                onMouseLeave={() => {
                                  setActive("");
                                }}
                                className={
                                  active === "comment-approvals" ? "active" : ""
                                }
                                style={({ isActive }) =>
                                  isActive
                                    ? {
                                      padding: "18px 18px",
                                    }
                                    : {}
                                }
                              >
                                <img
                                  src="/images/mark/files.png"
                                  alt="dashboard"
                                  width="24px"
                                  height="24px"
                                />
                                <img
                                  className="active"
                                  src="/images/mark/files.png"
                                  width="24px"
                                  height="24px"
                                />
                                <span className="item-content">
                                  Comment <br /> Approvals
                                </span>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>

                    {/* 301 Redirects. Will be implemented later */}
                    <li>
                      <div className="bhhAF">
                        <NavLink
                          to="/admin/redirects"
                          onMouseEnter={() => {
                            setActive("redirects");
                          }}
                          onMouseLeave={() => {
                            setActive("");
                          }}
                          className={active === "redirects" ? "active" : ""}
                          style={({ isActive }) =>
                            isActive
                              ? {
                                color: "#FBFDFE",
                                padding: "18px 18px",
                                backgroundColor: "#F4730E",
                                borderRadius: "20px",
                              }
                              : {}
                          }
                        >
                          <img
                            src="/images/mark/files.png"
                            alt="dashboard"
                            width="24px"
                            height="24px"
                          />
                          <img
                            className="active"
                            src="/images/mark/filesactive.png"
                            width="24px"
                            height="24px"
                          />
                          <span className="item-content">301 Redirects</span>
                        </NavLink>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
      {isSidebarOpen && isMobile && (
  <div className="overlay" onClick={toggleSidebar}></div>
)}
    </>

  );
};
export default Sidebar;
