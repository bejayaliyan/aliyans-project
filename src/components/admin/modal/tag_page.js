import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../pages/sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DynamicTimer } from '../components/timer';
import { BellPic } from '../components/bellPic';
import UserIcon from '../components/userIcon';
import { useToasts } from 'react-toast-notifications';
import 'react-quill/dist/quill.snow.css';
import './driver_modal.scss';

const TagPage = ({ userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const data = location.state ? location.state.data : null;

  const [tag, setTag] = useState();
  const [modalId, setModalId] = useState();
  const [errors, setErrors] = useState([]);
  const [loadingShow, setLoadingShow] = useState(false);

  const handleTagChange = e => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setTag(inputValue);
      setErrors({});
    } else {
      setErrors({ title: 'Page tag must be less than 160 characters.' });
    }
  };

  const cancelHandler = () => {
    navigate(`/admin/blogs/tags`);
  };

  const validate = value => {
    if (!value) {
      return 'Field is required';
    }
  };

  const next = () => {
    const validationErrors = {};
    let error = validate(tag);
    if (error && error.length > 0) validationErrors['tag'] = error;
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
    temp.tag = tag;
    if (!modalId) {
      temp.action = 1;
    }

    if (errors && errors.file && errors.file.length > 0) {
      console.log('error');
    } else if (modalId) {
      temp.id = modalId;
      setLoadingShow(true);
      // axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/update`, temp)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/tag/update`, temp)
        .then(res => {
          setLoadingShow(false);
          addToast('Tag updated successfully!', {
            appearance: 'success',
            autoDismiss: true, 
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/blogs/tags`);
        });
    } else {
      setLoadingShow(true);
      // axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/create`, temp)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/tag/create`, temp)
        .then(res => {
          setLoadingShow(false);
          addToast('Tag created successfully!', {
            appearance: 'success',
            autoDismiss: true,
            autoDismissTimeout: 3000,
          });
          navigate(`/admin/blogs/tags`);
        })
        .catch(err => {
          addToast('Tag updated failed! ' + err, {
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
      setTag(data.tag);
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
                            Tags
                          </h5>
                        </div>
                      </div>
                      <div className="card-body__content">
                        <h2 style={{ fontSize: '32px', fontWeight: "700", marginBottom: "25px", paddingBottom: "20px", borderBottom: "1px solid #EEE7E4" }}>Blog Tag</h2>

                        <div className="input-wrapper">
                          <h5>Tag Name:</h5>
                          <input
                            type="text"
                            placeholder="Keep under 60 characters/ max 60 pixels including spaces, Use your keyword in title tag (In Front of title wherever Possible"
                            value={tag}
                            onChange={handleTagChange}
                          ></input>
                        </div>
                        <span className="text-danger">{errors.tag}</span>
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
                            width: 'fit-content',
                            padding: '10px 20px',
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
export default TagPage;
