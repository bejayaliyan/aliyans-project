import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import logo from '../../../images/logo.png';
import '../login/login.scss'
import axios from 'axios';
import car_logo from '../../../images/Untitled-2.png'
import { login } from '../../../auth';
// require('dotenv').config()
const Register = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const validate = (name, value) => {
    switch (name) {
      case "email":
        if (!value) {
          return "Email is Required";
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
  const handleSubmit = () => {
    validateForm();
    if(errors.email == "" && errors.password == "" ){
    register();
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
    setErrors(validationErrors)
  }
  const [errors, setErrors] = useState({ email: '', password: '' });
  const register = () => {
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, { email: email, password: password })
      .then((response) => {
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signin`, { email: email, password: password })
          .then((res) => {
            if (res.status == 200) {
              // login(res.data);
              window.location = '/home'
            }

          })
      })
      .catch(error => {
        if (error.response.status == '400')
          setErrors({ email: error.response.data.message });
      })
  }
  return (
    <div className="container-fluid client-login">
      <div className="row">
        <div className='col-md-6 login-left p-20'>
          <div className='img-wrapper'>
            <img src={logo} alt="logo" width="248px"></img>
          </div>
          <div className='login-form'>
            <div className='caption'>
              <h3>Register</h3>
              <h5>Register yourself to the web to book a Ride</h5>
            </div>
            <div className='form-group mb-3'>
              <label>Email Id:</label>
              <input required type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); validateForm() }}></input>
              <span className="text-danger">{errors.email}</span>
            </div>
            <div className='form-group mb-3'>
              <label>Password:</label>
              <input required type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value); validateForm() }}></input>
              <span className="text-danger">{errors.password}</span>
            </div>
            <div className="remember-forgot">
              <label className="checkbox" style={{display:'flex'}}>
                <input type='checkbox' />
                <span></span>
                Remember Me
              </label>
            </div>
            <button className='login-button' onClick={handleSubmit}>Register</button>
            <div className='tologin'>
              <h6 >Already an existing user? <span><Link to="/login">Login here</Link></span></h6>
            </div>
          </div>
        </div>
        <div className="col-md-6 login-right">
          <img src={car_logo} width="100%" />
        </div>
      </div>
    </div >
  )
};

export { Register };