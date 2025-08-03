import { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux'
import { add_badge } from '../../../redux/actions/NotificationstateActions';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap'; // Import Dropdown components
import {
  Row,
  Col,
  CloseButton
} from 'react-bootstrap';
import { new_notification } from '../../../redux/actions/NotificationstateActions';
import Triangle from "../../../assets/images/triangle.png";
import { Link, useLocation } from 'react-router-dom';
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';
import { getAuthUser } from '../../../auth.js';
import useNotification from "../../useNotification.js";

const BellPic = () => {
  const sendNotification = useNotification();

  if (!window.pusher) {
    window.pusher = new Pusher("e0319c444959019417db", {
      cluster: "us3",
    });
  
    const channel = window.pusher.subscribe("my-channel");
  
    channel.unbind("my-event");
    channel.bind("my-event", (data) => {
      pushNofificationHtml(data.message.notificationTitle,
        data.message.notificationType,
        data.message.notificationMessage
       ,data.message.notifyUserId);
    });
  }

  const AuthUser = getAuthUser();

  let ApiUrl = ""

  if (AuthUser?.roles === 1) {

    ApiUrl = `${process.env.REACT_APP_API_BASE_URL}/notification/admin/recent-notification`;

  } else {

    ApiUrl = `${process.env.REACT_APP_API_BASE_URL}/notification/user/recent-notification`
  }

  const NotificationPopUpShow = () => {
    setClick(prevClick => !prevClick);
    axios.get(ApiUrl)
      .then((res) => {
        dispatch(new_notification(res.data));
        setNotifications(res.data);
      });
  }

  const [notifications, setNotifications] = useState([]);
  const message = useSelector(state => state.notificationState.newMessage);
  const dispatch = useDispatch();
  const [click, setClick] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/admin/dashboard';
  const isAdmin = location.pathname === '/admin';
  const isAdminNotification = location.pathname === '/admin/notification';
  const isHome = location.pathname === '/home';
  const isPriceQoute = location.pathname === '/price-qoute';
  const isSaleReceipt = location.pathname === '/sale-receipt';
  const ishistory = location.pathname === '/history';

  const dropdownRef = useRef(null); // Ref for dropdown
  const bellRef = useRef(null); // Ref for bell icon

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        bellRef.current && !bellRef.current.contains(event.target)
      ) {
        setClick(false); // Close dropdown when clicked outside
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // const pusher = new Pusher("06cd02d44e7adc22e314", {
  //     cluster: "ap3"
  //   });
  //   const channel = pusher.subscribe("channel");
  //   channel.bind("event", (newMessage) => {
  //     //setMessages([...messages, newMessage]);
  //     dispatch(add_badge(true))
  //   }); 

  const close_click = (val, id) => {

    axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/update`, { is_read: 1, id: id })
      .then((res) => {
        // Filter out the notification at the given index
        setNotifications(prevNotifications => {
          const updatedNotifications = prevNotifications.filter((_, index) => index !== val);

          // If no notifications are left, dispatch an action (if needed)
          if (updatedNotifications.length === 0) {
            dispatch(new_notification(false)); // Assuming you want to do something when empty
          }

          return updatedNotifications;
        });
      })
      .catch(error => {
        console.error("Error updating notification:", error);
      });
  };

  const generateNofificationHtml = (notificationType, notificationContent, notificationTitle, notificationDate) => {
    let htmldata = "";
    const tagline = JSON.parse(notificationContent);

    if (AuthUser?.roles === 1) {
      if (notificationType == 3) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle}
          </h5>
          <h5 className="noti-content">
            <div>
              <div className="mb_7">
                <div className="LocationTitle">Pickup</div>
                <span className="LocationDetail">{tagline.PickUpLocation}</span>
              </div>
              <div>
                <div className="LocationTitle">Drop Off</div>
                <span className="LocationDetail">{tagline.DropOffLocation}</span>
              </div>
            </div>
            <div className="mt_10">
              <span className='DateAndTime'>{notificationDateTimeFormat(notificationDate)}</span>
            </div>
          </h5>
        </>
      }
      if (notificationType == 11 || notificationType == 6 || notificationType == 18 || notificationType == 19 || notificationType == 20) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle}
          </h5>
          <h5 className="noti-content">
            <div>
              <div className="mb_7">
                <div className="LocationTitle">Driver Name</div>
                <span className="LocationDetail">{tagline.DriverName}</span>
              </div>
              <div className="mb_7">
                <div className="LocationTitle">Passenger Name</div>
                <span className="LocationDetail">{tagline.PassengerName}</span>
              </div>
              <div className="mb_7">
                <div className="LocationTitle">Pickup</div>
                <span className="LocationDetail">{tagline.PickUpLocation}</span>
              </div>
              <div>
                <div className="LocationTitle">Drop Off</div>
                <span className="LocationDetail">{tagline.DropOffLocation}</span>
              </div>
            </div>
            <div className="mt_10">
              <span className='DateAndTime'>{notificationDateTimeFormat(notificationDate)}</span>
            </div>
          </h5>
        </>
      }
      if (notificationType == 7 || notificationType == 2 || notificationType == 9 || notificationType == 8 || notificationType == 10) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle}
          </h5>
          <h5 className="noti-content">
            <div>
              <div className="mb-2">
                <div className="LocationTitle">Passenger Name</div>
                <span className="LocationDetail">{tagline.PassengerName}</span>
              </div>
              <div className="mb_7">
                <div className="LocationTitle">Pickup</div>
                <span className="LocationDetail">{tagline.PickUpLocation}</span>
              </div>
              <div>
                <div className="LocationTitle">Drop Off</div>
                <span className="LocationDetail">{tagline.DropOffLocation}</span>
              </div>
            </div>
            <div className="mt_10">
              <span className='DateAndTime'>{notificationDateTimeFormat(notificationDate)}</span>
            </div>
          </h5>
        </>
      }
      if (notificationType == 4 || notificationType == 12 || notificationType == 13) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle + " - " + tagline.DriverName}
          </h5>
          <h5 className='noti-content'>
            <div className='mt_2'>
              <span className='DateAndTime'>{notificationDateTimeFormat(notificationDate)}</span>
            </div>
          </h5> </>
      }
      if (notificationType == 5 || notificationType == 14 || notificationType == 15 || notificationType == 16) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle + " - " + tagline.VehicleName}
          </h5>
          <h5 className='noti-content'>
            <div className='mt_2'>
              <span className='DateAndTime'>{notificationDateTimeFormat(notificationDate)}</span>
            </div>
          </h5> </>
      }
      if (notificationType == 16 || notificationType == 17) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle + " - " + tagline.UserName}
          </h5>
          <h5 className='noti-content'>
            <div className='mt_2'>
              <span className='DateAndTime'>{notificationDateTimeFormat(notificationDate)}</span>
            </div>
          </h5> </>
      }
    }
    else {
      if (notificationType == 3 || notificationType == 2 || notificationType == 8 || notificationType == 6
        || notificationType == 16 || notificationType == 17 || notificationType == 19 || notificationType == 20) {
        htmldata = <>
          <h5 className="noti-title">
            {notificationTitle}
          </h5>
          <h5 className='noti-content'>
            <div>
              <p className='User_noti_Text'>
                {tagline.UserTagline}
              </p>
            </div>
          </h5> </>
      }
    }
    return htmldata;
  }

  const pushNofificationHtml = (notificationTitle,notificationType,notificationMessage,notifyUserId) => {
    
    const msg = JSON.parse(notificationMessage);
    
    // 3 BOOKING REQUESTED
    if (notificationType == 3) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
      if(msg.UserTagline != "" && AuthUser?.roles === 2 && AuthUser?.id === notifyUserId){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }

    // 8 BOOKING Cancelled
    if (notificationType == 8) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
      if(msg.UserTagline != "" && AuthUser?.roles === 2 && AuthUser?.id === notifyUserId){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }

    // 7 BOOKING DELETED // 9 BOOKING STATUS UPDATED
    if (notificationType == 7 || notificationType == 9) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
    }

    // 10 PRICE HAS BEEN FIXED
    if (notificationType == 10) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Passenger Name: ${msg.PassengerName} Updated Price: ${msg.UpdatedPrice} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
    }

    // 6 BOOKING ASSIGNED and 11 BOOKING REASSIGNED
    if (notificationType == 6 || notificationType == 11) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Driver Name: ${msg.DriverName} Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
    }

    // 6 BOOKING ASSIGNED
    if (notificationType == 6 || notificationType == 11) { 
      if(msg.UserTagline != "" && AuthUser?.roles === 2 && AuthUser?.id === notifyUserId){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }

    // 2 BOOKING CONFIRMED
    if (notificationType == 2) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
      if(msg.UserTagline != "" && AuthUser?.roles === 2 && AuthUser?.id === notifyUserId){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }

    // 12 DRIVER UPDATED // 4 DRIVER ADDED // 13 DRIVER DELETED
    if (notificationType == 12 || notificationType == 4 || notificationType == 13) { 
      if(msg.AdminTagline != ""){
        sendNotification(notificationTitle,`${msg.AdminTagline}`);
      }
    }

    // 15 VEHICLE DELETED // 14 VEHICLE UPDATED // 5 VEHICLE ADDED
    if (notificationType == 15 || notificationType == 14 || notificationType == 5) { 
      if(msg.AdminTagline != ""){
        sendNotification(notificationTitle,`${msg.AdminTagline}`);
      }
    }
    
    // 16 PROFILE UPDATED // 17 PASSWORD RESET
    if (notificationType == 16 || notificationType == 17) { 
      if(msg.UserTagline != ""){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }

    // 18 DRIVER CANCELLED RIDE
    if (notificationType == 18) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`${msg.AdminTagline}`);
      }
    }

    // 19 DRIVER PICKEDUP RIDE
    if (notificationType == 19) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Driver Name: ${msg.DriverName} Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
      if(msg.UserTagline != "" && AuthUser?.roles === 2 && AuthUser?.id === notifyUserId){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }

    // 20 DRIVER DROPOFF RIDE
    if (notificationType == 20) { 
      if(msg.AdminTagline != "" && AuthUser?.roles === 1){
        sendNotification(notificationTitle,`Driver Name: ${msg.DriverName} Passenger Name: ${msg.PassengerName} Pickup Address: ${msg.PickUpLocation} Drop Off Address: ${msg.DropOffLocation}`);
      }
      if(msg.UserTagline != "" && AuthUser?.roles === 2 && AuthUser?.id === notifyUserId){
        sendNotification(notificationTitle,`${msg.UserTagline}`);
      }
    }
  }

  return (
    <>
      <div style={{ cursor: 'pointer', position: 'relative', }} className='bellmodal' ref={bellRef}>
        <img onClick={NotificationPopUpShow} src={message ? '/images/mark/active_notification.svg' : '/images/mark/notification.svg'} alt='bell' width="24px" height="24px" />

      </div>
      <div className='bellmodal DropZindex'>

        <div  ref={dropdownRef} className={click ? 'profile active' : 'profile'} style={{
          ...(isDashboard
            ? { right: '-135px', top: '59px', width: '535px' }
            : { right: '0px', left: '', top: '78px', width: '535px' }),
          ...(AuthUser?.roles !== 1 && { right: '-130px', left: '', top: '78px', width: '535px' }),
          ...(isAdmin && AuthUser?.roles === 1 && { right: '-130px', left: '', top: '78px', width: '535px' }),
          ...(isHome && { right: '-130px', left: '', top: '78px', width: '535px' }),
          ...(isAdminNotification && { right: '-130px', left: '', top: '78px', width: '535px' }),
          ...(isPriceQoute && { right: '-130px', left: '', top: '78px', width: '535px' }),
          ...(isSaleReceipt && { right: '-130px', left: '', top: '78px', width: '535px' }),
          ...(ishistory && { right: '-130px', left: '', top: '78px', width: '535px' })

        }}>

          <>

            <div className='MaxHeight'>
              <div>
                <img width="100%" src={Triangle} alt='triangleimg' className='toperrodrop' />
              </div>
              {
                notifications.length === 0 ? (
                  <div className="no-notifications-message">
                    No notifications
                  </div>
                ) : (
                  notifications.map((val, key) => (
                    <div key={key} className="notification-itempadding dropdown-menu-width">
                      <div className="notification-item">
                        <div className="notification-item__content">
                          {generateNofificationHtml(val.notification_type, val.tagline, val.data, val.createdAt)}
                        </div>
                        <div className="notification-item__close">
                          {/* <CloseButton /> */}
                          <button className="btn-close" onClick={() => close_click(key, val.id)}></button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              }

            </div>
          </>

          <Link to={`${AuthUser?.roles === 1 ? "/admin/notification" : "/notification"}`} className='AllNotificationBtn'><h6 className="update mb-0">View All Notifications</h6></Link>

        </div>
      </div>
    </>


  )
}
export { BellPic }