import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import Sidebar from '../pages/sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DynamicTimer } from '../components/timer';
import { BellPic } from '../components/bellPic';
import UserIcon from '../components/userIcon';
import './driver_modal.scss';

const CategoryPage = ({ userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const data = location.state ? location.state.data : null;

  const [categoryName, setCategoryName] = useState();
  const [modalId, setModalId] = useState();

  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);

  const handleTagChange = e => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setCategoryName(inputValue);
      setErrors({});
    } else {
      setErrors({ title: 'Page tag must be less than 160 characters.' });
    }
  };

  const cancelHandler = () => {
    navigate(`/admin/blogs/categories`);
  };

  const validate = value => {
    if (!value) {
      return 'Field is required';
    }
  };

  const next = () => {
    const validationErrors = {};
    let error = validate(categoryName);
    if (error && error.length > 0) validationErrors['categoryName'] = error;
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
    temp.category = categoryName;
    if (errors && errors.file && errors.file.length > 0) {
      // console.log('error')
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/category/update`, temp)
        .then(res => {
          setLoadingShow(false);
          addToast('Category updated successfully!', {
            appearance: 'success',
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/blogs/categories`);
        });
    } else {
      setLoadingShow(true);

      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/category/create`, temp)
        .then(res => {
          setLoadingShow(false);
          addToast('Category created successfully!', {
            appearance: 'success',
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/blogs/categories`);
        })
        .catch(err => {
          addToast(err.response.data.message, {
            appearance: 'error',
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
      setCategoryName(data.category);
      setModalId(data.id);
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
                    <div className="card-body p-3">
                      <div className="card-body__header">
                        <div className="caption">
                          <h5
                            style={{
                              textTransform: 'capitalize',
                              fontSize: '24px',
                              marginBottom: '60px',
                            }}
                          >
                            Categories
                          </h5>
                        </div>
                      </div>
                      <div className="card-body__content">
                        <h2 style={{fontWeight: "700", paddingBottom: "20px", marginBottom: "25px", borderBottom: "1px solid #EEE7E4"}}>Create Blog Category</h2>

                        <div className="input-wrapper">
                          <h5>Category Name:</h5>
                          <input
                          style={{paddingLeft: "45px"}}
                            type="text"
                            placeholder="Keep under 60 characters/ max 60 pixels including spaces, Use your keyword in title tag (In Front of title wherever Possible"
                            value={categoryName}
                            onChange={handleTagChange}
                          ></input>
                        </div>
                        <span className="text-danger">
                          {errors.categoryName}
                        </span>
                      </div>

                      <div
                        className="row"
                        style={{
                          justifyContent: 'end',
                          marginRight: '15px',
                        }}
                      >
                        <h6
                          className="delete"
                          style={{
                            border: '1px solid',
                            borderRadius: '12px',
                            padding: '10px 20px',
                            width: 'fit-content',
                            marginRight: '15px',
                            fontWeight: '700',
                            fontSize: '18px',
                          }}
                          onClick={cancelHandler}
                        >
                          Cancel
                        </h6>
                        <h6
                          className="update"
                          style={{
                            fontWeight: '700',
                            fontSize: '18px',
                            width: "fit-content",
                            padding: "10px 20px"
                          }}
                          onClick={next}
                        >
                          Update
                        </h6>
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
export default CategoryPage;
