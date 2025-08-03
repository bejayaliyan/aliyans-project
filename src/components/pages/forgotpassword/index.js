import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import './ForgotPassword.scss';
import Logo from '../../../images/logo.png';
import ForgotPasswordImage from '../../../images/ForgotPasswordImage.png';


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



const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [error,setError] = useState("")
    const [successMsg,setSuccessMsg] = useState("")
    const [iserror,setIsError] = useState(false)
    const [errors,setErrors] = useState({email:'',password:''})

    const reset_clicked = () =>{
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`,{email:email})
        .then((res)=>{
            if (res.status == 200){
                setIsError(false)
                setSuccessMsg("Check Your Email inbox please")
            
              //  window.location = '/login'               
            }
        })
        .catch( error => {
         
            setIsError(true)  
            setError('User Not found.'); 
          })  
    }

    const validateForm = () => {
        const validationErrors = {}
        let error =  validate('email',email)
        if (error && error.length > 0) {
             validationErrors['email']=error;
        } else {
            validationErrors['email']="";
        }
       
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        }
      }

      const handleSubmit = () => {
        const validationErrors = {}
        let error =  validate('email',email)
        if (error && error.length > 0) {
             validationErrors['email']=error;
        }else {
          validationErrors['email']="";
        }
      
        if (validationErrors.email != "" ) {
            setErrors(validationErrors)
        }
        else if (email) { 
            reset_clicked()
        }
    }

    return (
        <div className="forgot-password-wrapper">
            <Container fluid>
                <Row className="align-items-center">
                    <Col lg={6}>
                        <div className="forgot-password-content">
                            <Image fluid src={Logo} alt="logo" className="logo" />
                            <div className="forgot-password-text">
                                <h4>Forgot Password</h4>
                                <p>Please enter the email address you’d like your password reset information sent to</p>
                                {
                                successMsg !== '' ? 
                                <p className='successMsg'>{successMsg}</p>
                                : ''
                            }
                             
                            
                            </div>
                            <div className="forgot-password-form">
                                <div className="form-label">
                                    <label>Email Id:</label>
                                </div>
                                <div className="form-input">
                                    <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value);validateForm()}}  />
                                </div>
                              
                            </div>
                            <span className="text-danger">{errors.email}</span>
                            {
                                iserror ? 
                                <span className="text-danger">{error}</span>
                                : ''
                            }
                           
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

export { ForgotPassword };