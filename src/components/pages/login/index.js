import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../images/NewLogo.png';
import './login.scss';
import axios from 'axios';
import { login } from '../../../auth';
import car_logo from '../../../images/Untitled-2.png'
// require('dotenv').config()
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
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [errors, setErrors] = useState({ email: '', password: '' })  

  const login_clicked = () => {
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signin`, { email: email, password: password })
      .then((res) => {
        if (res.status == 200) {                    
          login(res.data);
          let returnUrl = localStorage.getItem(process.env.REACT_APP_REDIRECT_URL_KEY);
          if(returnUrl == "/" || returnUrl == null){
            window.location = '/home'
            localStorage.removeItem(process.env.REACT_APP_REDIRECT_URL_KEY);
          }
          else{
            window.location = returnUrl
            localStorage.removeItem(process.env.REACT_APP_REDIRECT_URL_KEY);
          }          
        }
      })
      .catch(error => {
        setError('Email or Password is incorrect');
      })
  }
  const handleSubmit = () => {
    
    validateForm();
    if(errors.email == "" && errors.password == "" ) {
      login_clicked();
    }
  }
  const validateForm = () => {
    const validationErrors = {}
    let error = validate('email', email)
    if (error && error.length > 0) {
      validationErrors['email'] = error;
    } else {
      validationErrors['email'] = "";
    }
    error = validate('password', password)
    if (error && error.length > 0) {
      validationErrors['password'] = error;
    } else {
      validationErrors['password'] = error;
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
    }
  }
  return (
    <div className="container-fluid client-login">
      <div className="row">
      <div className='col-md-6 login-left p-20'>
        <div className='img-wrapper'>
          <img src={logo} alt="logo"></img>
        </div>
        <div className='login-form'>
          <div className='caption'>
            <h3>Log In</h3>
            <h5>Get in to the web by login to the system</h5>
            <span className="text-danger">{error}</span>
          </div>
          <div className='form-group mb-3'>
            <label>Email Id:</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); }}></input>
            <span className="text-danger">{errors.email}</span>
          </div>
          <div className='form-group'>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value);}}></input>
            <span className="text-danger">{errors.password}</span>
          </div>
          <div className="remember-forgot">
            <label className="checkbox" style={{display:"flex"}}>
              <input type='checkbox' />
              <span></span>
              Remember Me
            </label>
            <Link to="/forgotpassword" style={{ textDecoration: 'none' }}>Forgot Password</Link>
          </div>
          <button className='login-button' onClick={handleSubmit}>Log In</button>
          <div className='tologin'>
            <h6 >New here? <span><Link to="/register">Register here</Link></span></h6>
          </div>
        </div>
      </div>
      <div className="col-md-6 login-right">
        <img src={car_logo} />
      </div>
      </div>
    </div>
  )
};

export { Login };