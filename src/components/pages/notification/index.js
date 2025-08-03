import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    CloseButton
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { Header } from '../../layout/header';
import { select_notification } from '../../../redux/actions/NotificationstateActions';
import axios from 'axios';
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat';

const Notification = () => {
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification/user/all-notification`)
            .then((res) => {

                dispatch(select_notification(res.data));
                setNotifications(res.data)
            })
    }, [])

    // const close_click = (val, id) => {
    //     axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/update`, { is_read: 1, id: id })
    //         .then((res) => {
    //             let tempArr = Array.from(notifications);
    //             tempArr.splice(tempArr.indexOf(val), 1);
    //             setNotifications(tempArr);
    //         })

    // }

    const close_click = (val, id) => {

        console.log("close btn");

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/update`, { is_read: 1, id: id })
            .then((res) => {
                // let tempArr = Array.from(notifications);
                // tempArr.splice(tempArr.indexOf(val), 1);
                // if (tempArr.length == 0) dispatch(new_notification(false))
                // setNotifications(tempArr);

                // new

                // notifications.splice(val, 1);
                setNotifications(prevNotifications =>
                    prevNotifications.filter((_, index) => index !== val)
                );

            })

    }



    const generateNofificationHtml = (notificationType, notificationContent, notificationTitle, notificationDate) => {
        let htmldata = "";
        const tagline = JSON.parse(notificationContent);

        if (notificationType == 3 || notificationType == 2 || notificationType == 8 || notificationType == 6
            || notificationType == 16 || notificationType == 17 || notificationType == 19 || notificationType == 20
        ) {
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
        return htmldata;
    }



    return (
        <div className='client-dashboard'>
            <Header />
            <div className='dashboard main'>
                <div className='container'>
                    <div className='content'>
                        <div className='content-panel noti_pad'>
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
                                                <CloseButton onClick={()=>close_click(val,val.id)}/>
                                            </div>
                                        </div>
                                    )
                                    })
                                }  */}

                                <div className='PadLeftRight'>

                                    {
                                        notifications.length === 0 ? (
                                            <div className="no-notifications-message">
                                                No notifications
                                            </div>) : (
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
        </div>

    )
};

export { Notification };