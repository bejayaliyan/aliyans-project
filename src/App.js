import React, {useEffect} from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { createAppStore } from "./redux/stores/AppStore";

import { Home } from "./components/pages/home";
import { Vehicles } from "./components/pages/vehicle";
import { Payment } from "./components/pages/payment";
import { History } from "./components/pages/history";
import { Login as LoginPage } from "./components/pages/login/index.js";
import { Register } from "./components/pages/register";
import { Dashboard } from "./components/admin/pages/dashboard";
import { Notification } from "./components/admin/pages/notification";
import { Vehicle } from "./components/admin/pages/vehicle";
import { Booking } from "./components/admin/pages/booking";
import { BookRider } from "./components/admin/pages/book_rider";
import { Driver } from "./components/admin/pages/driver";
import { Notification as ClientNotification } from "./components/pages/notification";
import axios from "axios";
import "./i18n.js";
import PrivateRoute from "./PrivateRoute";
import { SaleReceipt } from './components/pages/salereceipt'
import {getBearer,flushUserSession} from './auth';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import PublicRoute from "./PublicRoute";
import LoginCheck from "./LoginCheck";
import "./assets/font/Lato-Black.ttf";
import { ForgotPassword } from "./components/pages/forgotpassword";
import { ResetPassword } from './components/pages/resetpassword';
import { SelectVehicle } from "./components/admin/pages/select_vehicle";
import { PaymentInfo } from "./components/admin/pages/payment_info";
import { Services } from "./components/admin/pages/services.js";
import { Blog } from "./components/admin/pages/blog";
import { Comment } from "./components/admin/pages/comment";
import ServicePage from "./components/admin/modal/service_page";
import BlogPage from "./components/admin/modal/blog_page";
import TagPage from "./components/admin/modal/tag_page";
import { Tag } from "./components/admin/pages/tag";
import { Category } from "./components/admin/pages/category";
import CategoryPage from "./components/admin/modal/category_page";
import { CommentApproval } from "./components/admin/pages/comment_approval.js";
import { Seo } from "./components/admin/pages/seo.js";
import { Manage_meta_tag } from "./components/admin/pages/manage_meta_tag.js";

import { Pages } from "./components/admin/pages/pages.js";
import { Redirects } from "./components/admin/pages/redirects.js";
import NewPage from "./components/admin/modal/new_page.js";
import NewField from "./components/admin/modal/new_field.js";
import { ToastProvider } from "react-toast-notifications";
import { BookingConfirm } from "./components/pages/bookingconfirm.js";
import { DownloadWayBill } from "./components/pages/downloadwaybill.js";
import { DriverBookingConfirm } from "./components/pages/driverbookingconfirm.js";
import { DriverPickUpRide } from "./components/pages/driverpickupride.js";
import { DriverDropOffRide } from "./components/pages/driverdropoffride.js";

axios.defaults.headers.common["x-access-token"] = getBearer();


// Interceptors for request and response
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(axios.interceptors)
    // Check if the response status is 401
    if (error.response && error.response.status === 401) {
      // Logout the user and redirect     
      const location = window.location.pathname;
      localStorage.setItem(process.env.REACT_APP_REDIRECT_URL_KEY, location);
      flushUserSession();
      window.location = '/login';
    }
    // Propagate the error to the next catch block
    return Promise.reject(error);
  }
);

const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('google-maps-script');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places&sensor=false`;
    script.id = 'google-maps-script';
    script.async = true;
    script.defer = true;
    script.onload = () => callback();
    document.head.appendChild(script);
  } else {
    callback();
  }
};




const lang = i18n.language;
const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
};

export const App = () => {  
  localStorage.removeItem(process.env.REACT_APP_REDIRECT_URL_KEY);
  const location = window.location.pathname;
  localStorage.setItem(process.env.REACT_APP_REDIRECT_URL_KEY, location);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      console.log('Google Maps script loaded successfully!');
      // Initialize map or other logic here
    });    
  }, []);



  const userName = JSON.parse(localStorage.getItem("authUser"))?.name;
  return (
    <Provider store={createAppStore()}>
      <ToastProvider>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route
              path="/"
              element={
                <LoginCheck>
                  <LoginPage />
                </LoginCheck>
              }
              exact={true}
            />
            <Route
              path="/home"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route path='/price-qoute' element={
                <PublicRoute>
                  <Home />
                </PublicRoute> 
              }/>
            <Route
              path="/forgotpassword"
              element={
                <LoginCheck>
                  <ForgotPassword />
                </LoginCheck>
              }
            />
            <Route path='/resetpassword' element={
                <LoginCheck>
                  <ResetPassword />
                </LoginCheck> 
              }/>
            <Route
              path="/login"
              element={
                <LoginCheck>
                  <LoginPage />
                </LoginCheck>
              }
              exact={true}
            />
            <Route
              path="/register"
              element={
                <LoginCheck>
                  <Register />
                </LoginCheck>
              }
              exact={true}
            />
            <Route
              path="/vehicles"
              element={
                <PublicRoute>
                  <Vehicles />
                </PublicRoute>
              }
            />
            <Route path='/price-quote-vehicles' element={
                <PublicRoute>
                  <Vehicles />
                </PublicRoute>  
              } />   
            <Route path="/payment" element={<Payment />} exact={true} />
            <Route
              path="/notification"
              element={
                <PublicRoute>
                  <ClientNotification />
                </PublicRoute>
              }
              exact={true}
            />
            <Route
              path="/history"
              element={
                <PublicRoute>
                  <History />
                </PublicRoute>
              }
              exact={true}
            />
            <Route path= "/sale-receipt" element ={
                <PublicRoute>
                  <SaleReceipt/>
                  </PublicRoute>
                } exact={true}/>
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/vehicle"
              element={
                <PrivateRoute>
                  <Vehicle />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/notification"
              element={
                <PrivateRoute>
                  <Notification />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/booking"
              element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/book_ride"
              element={
                <PrivateRoute>
                  <BookRider />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/services"
              element={
                <PrivateRoute>
                  <Services userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/services/new_service"
              element={
                <PrivateRoute>
                  <ServicePage userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/seo"
              element={
                <PrivateRoute>
                  <Seo userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
             <Route
              path="/admin/seo/manage_meta_tag"
              element={
                <PrivateRoute>
                  <Manage_meta_tag userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/pages"
              element={
                <PrivateRoute>
                  <Pages userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/pages/new_page"
              element={
                <PrivateRoute>
                  <NewPage userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/pages/new_page/:id"
              element={
                <PrivateRoute>
                  <NewPage userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/pages/new_page/new_field/:id"
              element={
                <PrivateRoute>
                  <NewField userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/redirects"
              element={
                <PrivateRoute>
                  <Redirects userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs"
              element={
                <PrivateRoute>
                  <Blog userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/new_blog"
              element={
                <PrivateRoute>
                  <BlogPage userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/tags"
              element={
                <PrivateRoute>
                  <Tag userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/tags/new_tag"
              element={
                <PrivateRoute>
                  <TagPage userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/categories"
              element={
                <PrivateRoute>
                  <Category userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/categories/new_category"
              element={
                <PrivateRoute>
                  <CategoryPage userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/comment_approval"
              element={
                <PrivateRoute>
                  <CommentApproval userName={userName} />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/blogs/comments/:id"
              element={
                <PrivateRoute>
                  <Comment />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/book_ride/select_vehicle"
              element={
                <PrivateRoute>
                  <SelectVehicle />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/book_ride/payment"
              element={
                <PrivateRoute>
                  <PaymentInfo />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/admin/driver"
              element={
                <PrivateRoute>
                  <Driver />
                </PrivateRoute>
              }
              exact={true}
            />
            <Route
              path="/booking-confirm"
              element={                
                  <BookingConfirm />
              }
            />
            <Route
              path="/download-waybill"
              element={                
                  <DownloadWayBill />                
              }
            />
            <Route
              path="/driver-booking-confirm"
              element={                
                  <DriverBookingConfirm />
              }
            />
            <Route
              path="/driver-pickup"
              element={                
                  <DriverPickUpRide />
              }
            />
            <Route
              path="/driver-dropoff"
              element={
                  <DriverDropOffRide />
              }
            />
          </Routes>
        </I18nextProvider>
      </ToastProvider>
    </Provider>
  );
};

export default App;
