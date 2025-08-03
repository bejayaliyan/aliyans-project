import React, { useState } from 'react';
import {   BrowserRouter as Router,
  Link,
  useSearchParams,} from 'react-router-dom';
import {
    Nav,
    Container,
    Modal,
    FormControl,
    Row,
    Col,
    Image,
    Button
} from 'react-bootstrap';
import axios from 'axios';
import './ResetPassword.scss';
import Logo from '../../../images/logo.png';
import ForgotPasswordImage from '../../../images/ForgotPasswordImage.png';
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const validate = (name, value) => {
    switch (name) {
      case "email":
        if (!value) {
          return "Email Id is Required";
        } else if (
          !value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
        ) {
          return "Enter a valid email address";
        } else {
          return "";
        }
      case "password":
        if (!value) {
          return "Password is Required";
        } else if (value.length < 6) {
          return "Please fill at least 6 characters";
        } else {
          return "";
        }
    }
};



const ResetPassword = () => {

   
  //  const [error,setError] = useState("")
    const [iserror,setIsError] = useState(false)
    const [errors,setErrors] = useState("")

    const [password, setPassword] = useState();
    const [confrmpassword, setConFrmPassword] = useState();
    const [searchParams] = useSearchParams();

    const key = searchParams.get("key");


  const [queryparam, setQueryParam] = useState("");

  const [input, setInput] = useState({
   // username: '',
    password: '',
    confirmPassword: '',
    key: key
  });
 
  const [error, setError] = useState({
  //  username: '',
    password: '',
    confirmPassword: ''
  })

  const postToNotification = (data) => {        
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
  }

  const reset_clicked = () =>{
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/change-password-reset`,input)
    .then((res)=>{
        if (res.status == 200){
            setIsError(false)

            let dateTime = notificationDateTimeFormat(new Date());
            let notificationObj = {
              data:"Password Reset / Updated Successfully",
              is_read: 0,
              user_to_notify:0,
              notification_type: 17, // PASSWORD RESET
              tagline: JSON.stringify({                
                UserName:"",
                AdminTagline:"",
                UserTagline:"Your password reset successfully at " + dateTime,
                DriverTagline:"",                
              })
            }
            postToNotification(notificationObj);

            window.location = '/login'               
        }
    })
    .catch( error => {
       
        setIsError(true)  
        setErrors('Try Again Please.'); 
      })  
}

 
  const onInputChange = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  }
 
  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };
 
      switch (name) {
 
        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
          }
          break;
 
        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;
 
        default:
          break;
      }
 
      return stateObj;
    });
  }


       const handleSubmit = () => {
        const validationErrors = {}      
        if(key != '' && key != null) {
          setQueryParam("")
          if(input.password !== '' && input.confirmPassword !== '') {
            if(error.password === '' && error.confirmPassword === '') {
             reset_clicked();
             console.log(key, 'key key key')
            } else {
              console.log(error)
            } 
           } else {
            console.log(input, 'input')
           }
        } else {
          setQueryParam("Check your email again please!")
        }

   
    }

    return (
        <div className="forgot-password-wrapper">
            <Container fluid>
                <Row className="align-items-center">
                    <Col lg={6}>
                        <div className="forgot-password-content">
                            <Image fluid src={Logo} alt="logo" className="logo" />
                            {/* <div className="forgot-password-text">
                                <h4>Reset Password</h4>
                                <p>Please enter the email address you’d like your password reset information sent to</p>
                            </div> */}
                            <p>{errors && <span className='err'>{errors}</span>}</p> 
                            <p>{queryparam && <span className='err'>{queryparam}</span>}</p> 
                            <div className="forgot-password-form">
                                <div className="form-label">
                                    <label>Password:</label>
                                </div>
                                <div className="form-input">
                                    <input type="password"
                                  name="password"
                                  placeholder='Enter Password'
                                  value={input.password}
                                  onChange={onInputChange}
                                  onBlur={validateInput} 
                                  required />
                                </div>
                              
                            </div>
                            {/* <span className="text-danger">{errors.password}</span> */}

                           
                            {error.password && <span className='err'>{error.password}</span>}


                            <div className="forgot-password-form">
                                <div className="form-label">
                                    <label>Password:</label>
                                </div>
                                <div className="form-input">
                                    <input type="password"
                                 
                                   name="confirmPassword"
                                   placeholder='Enter Confirm Password'
                                   value={input.confirmPassword}
                                   onChange={onInputChange}
                                   onBlur={validateInput}
                                  required />
                                </div>
                              
                            </div>
                            {/* <span className="text-danger">{errors.password}</span> */}

                            {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}


                        

                            <div className="form-button">
                                    <Button as="input" type="submit" className='BorderNone' onClick={handleSubmit} value="Request Reset Link" />
                                    <Link to="/login" className="back">Go Back</Link>
                                </div>
                        </div>
                    </Col>
                    <Col lg={6} className="hide">
                        <div className="forgot-password-image">
                            <Image fluid src={ForgotPasswordImage} alt="logo" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
};

export { ResetPassword };