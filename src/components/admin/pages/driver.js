import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Modal,
    Form,
} from 'react-bootstrap';
import './driver.scss';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { fetchdrivers } from '../../../redux/actions/UserstateActions';
import DriverModal from '../modal/driver_modal'
import Confirm_modal from '../modal/confirm_modal'
import Notification_modal from '../modal/notification_modal';
import UserIcon from '../components/userIcon'
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer'
import { TailSpin } from 'react-loader-spinner'
import LoadingShow from '../components/LoadingShow';
import { formatDate } from '../../../utils/formatDate.js';
import { formatTime } from '../../../utils/formatTime.js';
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const Driver = () => {
    const [searchKey, setSearchKey] = useState();
    const [modalshow, setModalshow] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const [nextmodalshow, setNextModalshow] = useState(false);
    const [notificationModalShow, setNotificationModalShow] = useState(false)
    const [notifyContent, setNotifyContent] = useState();
    const [notifyModalTitle, setNotifyModalTitle] = useState();
    const handleNotificationModalClose = () => setNotificationModalShow(false)
    const [modaltitle, setModaltitle] = useState("add new driver");
    const [showDriverRideInfo, setShowDriverRideInfo] = useState(false);
    const handleDriverRideInfoModelClose = () => setShowDriverRideInfo(false);
    const [driverRideInfo, setDriverRideInfo] = useState(null);
    
    const handleModalShow = () => {
        setModalshow(true);
        setModaltitle('add new driver');
    }
    const handleModalClose = () => {
        getDrivers(); setModalshow(false);
        setLoadingShow(false)
    };
    const nexthandleModalClose = () => setNextModalshow(false);
    const [modalData, setModalData] = useState()
    const [modalID, setModalID] = useState();
    const [confirmModalShow, setConfirmModalShow] = useState(false)
    const handleConfirmModalClose = () => setConfirmModalShow(false)
    const [modalButtonName, setModalButtonName] = useState()
    const handleUpdateModal = (val) => {
        setModalshow(true);
        setModalData(val);
        setModaltitle('Update Driver Information')
        setModalButtonName("update driver")
    }
    const [deleteId, setDeleteId] = useState();
    const [drivers, setDrivers] = useState(null);
    const dispatch = useDispatch()
    const [driverKey, setDriverKey] = useState(null);
    const getDrivers = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/driver/get`)
            .then((res) => {
                dispatch(fetchdrivers(res.data));
                setDrivers(res.data)
            })
    }
    const openDriverModal = () => {
        setModalButtonName('add driver')
        handleModalShow();
    }
    const delete_driver_modal = (id) => {
        setDeleteId(id);
        setDriverKey(null)
        setConfirmModalShow(true)
    }
    const delete_driver = () => {
        setConfirmModalShow(false)
        setLoadingShow(true);
        setNotifyContent("Driver has been Cancelled Successfully")
        setNotifyModalTitle('Driver deleted')
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/delete`, { id: deleteId })
            .then((res) => {
                if (res.status === 200) {
                    setLoadingShow(false);
                    getDrivers()
                    setNotificationModalShow(true);

                    let deletedDriver = drivers.find(d=>d.id == deleteId);
                    let dateTime = notificationDateTimeFormat(new Date());
                    let notificationObj = {
                        data: "Delete Driver Profile",
                        is_read: 0,
                        user_to_notify:0,
                        driver_id:deleteId,
                        notification_type: 13, // DRIVER DELETED 
                        tagline: JSON.stringify({
                            DriverName: deletedDriver.first_name + " " + deletedDriver.last_name,
                            AdminTagline:"Deleted Driver Profile " + deletedDriver.first_name + " " + deletedDriver.last_name + " at " + dateTime,
                            UserTagline:"",
                            DriverTagline:"",                
                        })
                    }
                    postToNotification(notificationObj);
                }
            })
    }
    useEffect(() => {
        if (!drivers) {
            getDrivers();
        }
    }, [])
    const notify = () => {
        setNotificationModalShow(true);
        setNotifyContent("Driver has been Added Successfully")
        setNotifyModalTitle('Driver added')
    }

    const handleDriverRideInfo = (driverId, key) => {        
        setDriverKey(key);
        const driverRides = drivers.find(x => x.id === driverId);
        if (driverRides != null && driverRides != undefined && driverRides.bookings.length > 0) {
            setShowDriverRideInfo(true);
            setDriverRideInfo(driverRides);
        }
    }

    const postToNotification = (data) => {        
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
    }

    return (
        <div className='dashboard driver'>
            <Sidebar />
            <div className='driver content'>
                <div className='content-panel'>
                    <div className='content-panel__heading'>
                        <div className='caption'>
                            <h5>Drivers</h5>
                            <DynamicTimer />
                        </div>
                        <div className='dropdown'>
                            <div className='nav-item'>
                                <div className='button' onClick={openDriverModal}>
                                    <i className='fa fa-plus'></i>
                                    <h6>Add driver</h6>
                                </div>
                            </div>
                            <div className='nav-item bell'>
                                <div className='svg-container'>
                                  <BellPic />
                                 </div>
                            </div>
                            <UserIcon></UserIcon>
                        </div>
                    </div>
                    <div className='content-panel__content'>
                        <Row>
                            <Col>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className='card-body__header'>
                                            <div className='caption'>
                                                <h5 style={{ textTransform: 'capitalize' }}>Drivers</h5>
                                            </div>
                                        </div>
                                        <div className='card-body__content'>
                                            <table className='driver w-100 table-responsive'>
                                                <thead>
                                                    <tr>
                                                        <th>Profile Pic</th>
                                                        <th>Name</th>
                                                        <th>Driver Number</th>
                                                        <th>Availability</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {drivers?.map((val, key) => {
                                                        return (
                                                            <tr key={key} >
                                                                <td onClick={() => handleDriverRideInfo(val.id, key)}>{val.imgurls[0] ? <div className='ProfileImg'> <img src={`${val.imgurls[0].name}`} style={{ width: '100%', height: '100%', objectFit:'cover',objectPosition:'center' }} alt="image44"></img> </div> : ''}</td>
                                                                <td onClick={() => handleDriverRideInfo(val.id, key)}>{val.first_name} {val.last_name}</td>
                                                                <td onClick={() => handleDriverRideInfo(val.id, key)}>{val.phone_number}</td>
                                                                <td><h6 className={'duty' + val.availability}>{val.availability ? 'On Duty' : "Off Duty"}</h6></td>
                                                                <td><h6 className='delete' onClick={() => delete_driver_modal(val.id)}>Delete</h6></td>
                                                                <td><h6 className='update' onClick={() => handleUpdateModal(val)}>Update</h6></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            {/* <Col xs={4}>
                            <div className='card driver-info'>
                                    <div className='card-body'>
                                    <div className='card-body__header'>
                                            <div className='caption'>
                                                <h5 style={{textTransform:'capitalize'}}>Driver's ride</h5>
                                            </div>
                                    </div>
                                    {driverKey != null?
                                    drivers[driverKey].Bookings[0]?
                                    <div className='card-body__content'>
                                        <div className='meta'>
                                            <div style={{display:'flex',alignItems:'center'}}>
                                                <img src={`${process.env.REACT_APP_IMAGE_BASE_URL+drivers[driverKey].imgurls[0].name}`} width="60px" height="60px" alt="image77"/>
                                            </div>
                                            <div className='info'>
                                                <h6 className='name'>{drivers[driverKey].first_name} {drivers[driverKey].last_name}</h6>
                                                <div className="date">
                                                    <i className='fa fa-calendar'></i>
                                                    <h6>{drivers[driverKey].Bookings[0].pickup_date}</h6>
                                                </div>
                                                <div className='time'>
                                                    <i className='fa fa-clock'></i>
                                                    <h6>{drivers[driverKey].Bookings[0].pickup_time}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='info'>
                                            <div className='wrapper'>
                                                <div>
                                                    <h5>Ride Number</h5>
                                                </div>
                                                {drivers[driverKey].Bookings?<h6>#{drivers[driverKey].Bookings[0].id}</h6>:''}
                                            </div>
                                            <div className='wrapper'>
                                                <div>
                                                    <h5>Pick up:</h5>
                                                </div>
                                                {drivers[driverKey].Bookings?<h6>{drivers[driverKey].Bookings[0].pickup_location}United States</h6>:''}
                                            </div>
                                            <div className='wrapper'>
                                                <div>
                                                    <h5>Drop off</h5>
                                                </div>
                                                {drivers[driverKey].Bookings?<h6>{drivers[driverKey].Bookings[0].dropoff_location}United States</h6>:''}
                                            </div>
                                        </div>
                                        <h6 className='update Assign'>Assign Another Ride</h6>
                                    </div>
                                    :'':''}
                                    </div>
                                </div>
                            </Col>                        */}
                        </Row>
                    </div>
                </div>
            </div>

            <DriverModal modalshow={modalshow} val={modalData} getDrivers={getDrivers} handleModalClose={handleModalClose} modaltitle={modaltitle} buttonName={modalButtonName} notify={notify}></DriverModal>
            <Confirm_modal classProp="modal" content="Do you want to delete this driver from the record?" button_name="delete" modalTitle="Delete the Driver" delete_vehicle={delete_driver} show={confirmModalShow} onHide={handleConfirmModalClose}>
            </Confirm_modal>
            <Notification_modal content={notifyContent} modalTitle={notifyModalTitle} show={notificationModalShow} onHide={handleNotificationModalClose}></Notification_modal>

            <Modal className="confirm-modal modal DriveInfoModal" show={showDriverRideInfo} onHide={handleDriverRideInfoModelClose} dialogClassName="modal-100w" centered>
                <Modal.Header>
                    <Modal.Title><h5 style={{ textTransform: 'capitalize', fontWeight: "700" }}>Driver's ride</h5></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <table className='driver w-100 table-responsive'>
                            <thead>
                                <tr> 
                                    <th>Ride Number</th>
                                    <th>Profile Pic</th>
                                    <th>Name</th>
                                     <th>Pick up</th>
                                    <th>Drop off</th>
                                    <th>Date & time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverRideInfo?.bookings?.map((val, key) => {
                                    return (
                                        <tr key={key} >
                                              <td>#{val.id}</td>
                                            <td>{driverRideInfo.imgurls[0] ? <img src={`${driverRideInfo.imgurls[0].name}`} style={{ width: '60px', height: '60px', borderRadius: '50%' }} alt="image44"></img> : ''}</td>
                                            <td>{driverRideInfo.first_name} {driverRideInfo.last_name}</td>
                                          
                                            <td>
                                                <div>{val.pickup_location}</div></td>
                                            <td><div>{val.dropoff_location}</div></td>
                                            <td>{formatDate(val.pickup_date)} {val.pickup_time != null ? formatTime(val.pickup_time) : ''}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                </Modal.Body>
            </Modal>

            <LoadingShow show={loadingShow}></LoadingShow>
        </div>
    )
};

export { Driver };