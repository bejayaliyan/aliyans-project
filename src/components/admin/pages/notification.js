import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    CloseButton
} from 'react-bootstrap';

import './dashboard.scss';
import './notification.scss';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import UserIcon from '../components/userIcon'
import { new_notification } from '../../../redux/actions/NotificationstateActions';
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer'
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat';
const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    console.log("all notifications", notifications);


    const dispatch = useDispatch()
    const message = useSelector(state => state.notificationState.newMessage);
    // const close_click = (val, id) => {
    //     debugger;
    //     console.log("close btn");

    //     axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/update`, { is_read: 1, id: id })
    //         .then((res) => {
    //             // let tempArr = Array.from(notifications);
    //             // tempArr.splice(tempArr.indexOf(val), 1);
    //             // if (tempArr.length == 0) dispatch(new_notification(false))
    //             // setNotifications(tempArr);

    //             // new

    //             // notifications.splice(val, 1);
    //             setNotifications(prevNotifications =>
    //                 prevNotifications.filter((_, index) => index !== val)
    //               );

    //         })

    // }

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





    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification/admin/all-notification`)
            .then((res) => {
                dispatch(new_notification(res.data));
                setNotifications(res.data)
            })
    }, [])

    const generateNofificationHtml = (notificationType, notificationContent, notificationTitle, notificationDate) => {
        let htmldata = "";
        const tagline = JSON.parse(notificationContent);
        if (notificationType == 3 || notificationType == 11 || notificationType == 6 || notificationType == 7 || notificationType == 2 || notificationType == 9 || notificationType == 8 || notificationType == 10 || notificationType == 18 || notificationType == 19 || notificationType == 20) {
            htmldata = <>
                <h5 className="noti-title">
                    {notificationTitle}
                </h5>
                <h5 className="noti-content">

                    <div className='row'>
                        <div className='col pass-noti-min-width'>
                            <div className='mb-2 '>
                                <div className='LocationTitle'>Passanger Name</div>
                                <div className='LocationDetail FontColor'>{tagline.PassengerName}</div>
                            </div>
                        </div>
                        <div className='col pick-noti-min-width'>
                            <div className='mb-2 '>
                                <div className='LocationTitle'>Pickup</div>
                                <div className='LocationDetail'>{tagline.PickUpLocation}</div>
                            </div>
                        </div>
                        <div className='col drop-noti-min-width' >
                            <div className=''>
                                <div className='LocationTitle'>Drop Off</div>
                                <div className='LocationDetail'>{tagline.DropOffLocation}</div>
                            </div>
                        </div>
                        <div className='col date-noti-min-width'>
                            <div className=''>
                                <div className='LocationTitle'>Date & Time</div>
                                <div className='LocationDetail Date_Width'>{notificationDateTimeFormat(notificationDate)}</div>
                                {/* <div className='LocationDetail'>09:30 AM</div> */}
                            </div>
                        </div>
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
                    <div className='mt-3'>
                        <span>{notificationDateTimeFormat(notificationDate)}</span>
                    </div>
                </h5> </>
        }
        if (notificationType == 5 || notificationType == 14 || notificationType == 15 || notificationType == 16) {
            htmldata = <>
                <h5 className="noti-title">
                    {notificationTitle + " - " + tagline.VehicleName}
                </h5>
                <h5 className='noti-content'>
                    <div className='mt-3'>
                        <span>{notificationDateTimeFormat(notificationDate)}</span>
                    </div>
                </h5> </>
        }
        if (notificationType == 16 || notificationType == 17) {
            htmldata = <>
                <h5 className="noti-title">
                    {notificationTitle + " - " + tagline.Notes}
                </h5>
                <h5 className='noti-content'>
                    <div className='mt-3'>
                        <span>{notificationDateTimeFormat(notificationDate)}</span>
                    </div>
                </h5> </>
        }

        return htmldata;
    }



    return (
        <div className='dashboard'>
            <Sidebar />
            <div className='admin-notification content'>
                <div className='content-panel ContentPadding'>
                    <div className='content-panel__heading'>
                        <div className='caption CaptionPaddingLeft'>
                            <h5>dashboard overview</h5>
                            <DynamicTimer />
                        </div>
                        <div className='dropdown'>
                            <div className='nav-item bell'>
                                <div className='svg-container'>
                                    <Link>
                                        <BellPic />
                                    </Link>
                                </div>
                            </div>
                            <UserIcon></UserIcon>
                        </div>
                    </div>
                    <div className='content-panel__content'>
                        <Row>
                            <Col xs={12}>
                                <div className="notification PadBottomZero">
                                    <h4>Notifications</h4>
                                </div>
                            </Col>
                        </Row>
                        {/* {
                                notifications.map((val, key) => {
                                return (
                                    <div className='notification-item' key={key}>
                                        <div className='notification-item__content'>
                                            <h5 className='noti-title'>
                                              {val.notification_types[0]?val.notification_types[0].notification_type:''}
                                            </h5>
                                            <h5 className='noti-content'>
                                                {val.data}
                                            </h5>
                                        </div>
                                        <div className='notification-item__close'>
                                            <CloseButton  onClick={()=>close_click(val,val.id)}/>
                                        </div>
                                    </div>
                                )
                                })
                            }  */}
                        <div className='PadLeftRight overflow-auto'>
<div className='w-950'>
{
                                notifications.length === 0 ? (
                                    <div className="no-notifications-message">
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map((val, key) => {
                                        return (
                                            <React.Fragment key={key}>
                                                
                                                <div className='notification-item'>

                                                    <div className='notification-item__content'>
                                                        {
                                                            generateNofificationHtml(val.notification_type, val.tagline, val.data, val.createdAt)
                                                        }
                                                    </div>
                                                    <div className='notification-item__close mt_0'>
                                                        <button className='btn-close' onClick={() => close_click(key, val.id)}></button>
                                                    </div>


                                                </div>
                                            </React.Fragment>

                                        )
                                    })
                                )

                            }
</div>
                           

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};

export { Notification };