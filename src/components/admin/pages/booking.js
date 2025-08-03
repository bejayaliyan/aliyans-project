import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Tabs,
    Tab,
    Form,
    Modal,
    CloseButton
} from 'react-bootstrap';
import './dashboard.scss';
import axios from 'axios';
import './booking.scss'
import driver_img from "../../../assets/images/Ellipse 212.png"
import { Link } from 'react-router-dom';
import Sidebar from './sidebar.js'
import { select_booking } from '../../../redux/actions/BookingstateActions';
import { new_notification } from '../../../redux/actions/NotificationstateActions'
import CustomSelect from '../components/customSelect';
import CustomDriverSelect from '../components/customDriverSelect';
import Confirm_modal from '../modal/confirm_modal';
import Notification_modal from '../modal/notification_modal';
import { useDispatch, useSelector } from 'react-redux'
import UserIcon from '../components/userIcon'
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer'
import LoadingShow from '../components/LoadingShow';
import { formatDateTime } from '../../../utils/formatDateTime.js';
import { formatDate } from '../../../utils/formatDate.js';
import { formatTime } from '../../../utils/formatTime.js';
import { Convert12hourformat } from '../../../utils/Convert12hourformat.js';
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const Booking = () => {
    const [searchKey, setSearchKey] = useState();
    const [images, setImages] = useState();
    const [confirmModalShow, setConfirmModalShow] = useState(false)
    const [loadingShow, setLoadingShow] = useState(false);
    const handleConfirmModalClose = () => setConfirmModalShow(false)
    const [modalshow, setModalshow] = useState(false);
    const [modaltitle, setModaltitle] = useState("add new vehicel");
    const handleModalShow = () => { setModalshow(true); setModaltitle('add new vehicle'); }
    const handleModalClose = () => setModalshow(false);
    const [key, setKey] = useState('booking');
    const [bookings, setBookings] = useState([]);
    const [options, setDriverOptions] = useState([]);
    const [val_selectedDriver, setSelectedDriver] = useState(0);
    const [text_selectedDriver, setSelectedDriverText] = useState('');
    const [driverReassignBookings, setDriverReassignBookings] = useState([]);
    const [selectedReassignBookingId, setSelectedReassignBookingId] = useState(0);
    const handleNotificationModalClose = () => setNotificationModalShow(false)
    const [notificationModalShow, setNotificationModalShow] = useState(false)
    const [isAllchecked, setIsAllchecked] = useState(false)//value of all checkboxes
    const [getReassignModalShow, setReassignModalShow] = useState(false)
    const [getBookingUpdatedModalShow, setBookingUpdatedModalShow] = useState(false)
    const [allActiveDrivers,setAllActiveDrivers] = useState([]);    
    const [visibleUpdateBtn,setVisibleUpdateBtn] = useState(false);

    //set all check boxes are true or false
    const checkBoxClick = () => {
        setIsAllchecked(!isAllchecked)
        let temp_array = Array.from(bookings)
        temp_array.map((val) => {
            val.active = !isAllchecked;
        })
        setBookings(temp_array)
    }

    const handleSearchChange = (e) => {
        setSearchKey(e.target.value)
    }

    const handleTabChange = (k) => {

        setKey(k)

        setIsAllchecked(false)

        let temp_array = Array.from(bookings)
        temp_array.map((val) => {
            val.active = false;
        })
        setBookings(temp_array)
        
        setVisibleUpdateBtn(false)
        if(k == "booking_status" || k == "Cancel_booking" || k == "fix_price" || k == "driver"){
            setVisibleUpdateBtn(true)
        }
    }

    const dispatch = useDispatch()
    const searchFilter = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/get-all-bookings-by-admin`)
            .then((res) => {
                
                let data = res.data;
                dispatch(select_booking(res.data));

                let filtered;
                if (!searchKey)
                    setBookings(res.data)
                else {
                    //filtered = data.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(searchKey)));
                    filtered = data.filter((entry) =>
                        Object.values(entry).some(
                          (val) =>
                            val !== null &&
                            val.toString().toLowerCase().includes(searchKey.toLowerCase())
                        )
                      );
                    setBookings(filtered)
                }
            })
    }
    const initial_function = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/get-all-bookings-by-admin`)
            .then((res) => {
                let data = res.data;

                dispatch(select_booking(res.data));
                let filtered;

                if (!searchKey)
                    setBookings(res.data)
                else {
                    filtered = data.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(searchKey)));
                    setBookings(filtered)
                }
            })
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification/get`)
            .then((res) => {

                if (res.data.length > 0)
                    dispatch(new_notification(true));

            })
    }
    useEffect(() => {
        initial_function()
        getAllActiveDrivers()
    }, [])



    const [buttonActive, setButtonactive] = useState(false);
    const [deleteButtonActive, setDeleteButtonActive] = useState(false)
    const [booking_status, setBooking_status] = useState([]);
    const [selected_driver, setBooking_Driver] = useState([]);
    const [price, setPrice] = useState();
    const [cancelStatus, setCancelStatus] = useState([]);
    const [cancelId, setCancelId] = useState()
    const [modalName, setModalName] = useState();
    const [modalRate, setModalRate] = useState();
    const [modalPassenger, setModalPassenger] = useState();
    const [modalImageurl, setModalImageUrl] = useState([]);
    const [modalBag, setModalBag] = useState();
    const [modalId, setModalId] = useState()
    
    const postToNotification = (data) => {        
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
    }

    const cancel_booking = () => {                
        setConfirmModalShow(false)
        setLoadingShow(true)
        let tempArray = [];
        cancelId?.map(() => tempArray.push(3))        
        if (cancelId && buttonActive && cancelStatus)
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/update`, { id: cancelId, booking_status: tempArray })
                .then((res) => {
                    dispatch(select_booking(res.data));
                    setBookings(res.data)
                    setLoadingShow(false)

                    cancelId.map((item, index) => {                        
                        let dateTime = notificationDateTimeFormat(new Date());
                        let bookingInfo = bookings.find(b=>b.id == item);
                        let notificationObj = {
                            data: "Booking Canceled",
                            is_read: 0,
                            user_to_notify:bookingInfo.users[0]?.id,
                            passenger_id:bookingInfo.passenger_infos[0]?.id,
                            booking_id:bookingInfo.id,
                            driver_id:bookingInfo.drivers.length > 0 ? bookingInfo.drivers[0].id : null,
                            notification_type: 8, //"Booking Cancelled"
                            tagline: JSON.stringify({
                                PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                                PickUpLocation: bookingInfo.pickup_location,
                                DropOffLocation: bookingInfo.dropoff_location,
                                AdminTagline:`Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                                UserTagline:"Your booking is canceled at "+ dateTime,
                                DriverTagline:"",
                            })
                        }
                        postToNotification(notificationObj);
                        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/send-email-for-booking-cancel`,{id:bookingInfo.id});
                    });
                    setNotificationModalShow(true);                                        
                })
    }

    const booking_delete = () => {        
        let temp_array = [];
        bookings.map((val) => {
            if (val.active) {
                temp_array.push(val.id)
            }            
        });
        
        if (temp_array.length > 0){
            setLoadingShow(true)
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/delete`, { temp_array: temp_array })
            .then((res) => {                
                setLoadingShow(false)
                temp_array.map((item, index) => {
                    let bookingInfo = bookings.find(b=>b.id == item);                    

                    let notificationObj = {
                        data: "Delete Booking",
                        is_read: 0,
                        booking_id:item,
                        user_to_notify:bookingInfo.users[0]?.id,
                        passenger_id:bookingInfo.passenger_infos[0]?.id,
                        driver_id:bookingInfo.drivers.length > 0 ? bookingInfo.drivers[0].id : null,
                        notification_type: 7, // BOOKING DELETED
                        tagline: JSON.stringify({
                            PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                            PickUpLocation: bookingInfo.pickup_location,
                            DropOffLocation: bookingInfo.dropoff_location,
                            AdminTagline:`Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                            UserTagline:"",
                            DriverTagline:"",
                        })
                    }
                    postToNotification(notificationObj);
                });  
                initial_function();                  
            })
        }        
    }

    const [confirmModalContent, setConfirmModalContent] = useState('')
    const [confirmModalTitle, setconfirmModalTitle] = useState('')
    const [confirmButtonName, setConfirmButtonName] = useState('')
    const updateVehicle = async () => {
        const formData = new FormData();
        let temp_files = []
        setLoadingShow(true)
        if (images)
            images.map((image) => {
                temp_files.push(image.file)
            })

        {
            temp_files.map(file => {
                formData.append("uploadImages", file);
            });
        }
        let temp = {};
        temp.name = modalName;
        temp.max_passenger = modalPassenger;
        temp.rate = modalRate;
        temp.max_bags = modalBag;
        temp.images = images;

        if (modalId) {
            temp.id = modalId;
            const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'boundary': '${form_data._boundary}'
                },
            });
            temp.urls = []
            if (modalImageurl)
                modalImageurl.map(val =>
                    temp.urls.push(val.id))
            if (result.data.data)
                result.data.data.map(val =>
                    temp.urls.push(val.id))

            axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/update`, temp)
                .then((res) => {
                    setModalshow(false)
                    setLoadingShow(false)
                })
        }
        else {
            const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'boundary': '${form_data._boundary}'
                },
            });
            temp.urls = [...result.data.data]

                ;
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/vehicle/create`, temp)
                .then((res) => {
                    setModalshow(false)
                    setLoadingShow(false)
                })
        }
    }
    const updateBookingRecord = () => {
        
        let id = []; let bookingStatuses = []; let estimate_price; let estimate_price_info = []; let cancel_status;
        bookings.map((val, index) => {
            if (val.active) {
                id.push(val.id)

                bookingStatuses.push(booking_status[index])
                estimate_price = val.estimate_price
                estimate_price_info.push({ id: val.id, estimate_price: val.estimate_price })
                cancel_status = val.cancel;
            }
            setCancelId(id)
        })

        switch (key) {
            case 'booking_status':
                if (id && buttonActive) {
                    setLoadingShow(true)

                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/update`, { id: id, booking_status: bookingStatuses })
                        .then((res) => {                            
                            dispatch(select_booking(res.data));
                            setBookings(res.data)
                            setLoadingShow(false)

                            id.map((item, index) => {                                                     
                                let statusName = "";
                                let bookingInfo = bookings.find(b=>b.id == item);           
                                //let statusId = res.data.find(x => x.id === item)?.booking_status;                                
                                let statusId = bookingStatuses[index];                                
                                let dateTime = notificationDateTimeFormat(new Date());

                                if(statusId == 1){
                                    statusName = "ACCEPTED";
                                    let notificationObj = {
                                        data: "Booking Confirmed/Accepted",
                                        is_read: 0,
                                        booking_id:bookingInfo.id,
                                        user_to_notify:bookingInfo.users[0]?.id,
                                        passenger_id:bookingInfo.passenger_infos[0]?.id,
                                        driver_id:bookingInfo.drivers.length > 0 ? bookingInfo.drivers[0].id : null,
                                        notification_type: 2, //BOOKING CONFIRMED
                                        tagline: JSON.stringify({
                                            PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                                            PickUpLocation: bookingInfo.pickup_location,
                                            DropOffLocation: bookingInfo.dropoff_location,
                                            AdminTagline:`Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                                            UserTagline:"Your booking for "+ dateTime +" confirmed successfully by cab owner, be ready to experience the personalized services",
                                            DriverTagline:"",
                                        })
                                    }
                                    postToNotification(notificationObj);
                                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/send-email-for-booking-confirm`,{id:bookingInfo.id});
                                }
                                if(statusId == 2){
                                    statusName = "PENDING";
                                    let notificationObj = {
                                        data: "Booking Status Updated",
                                        is_read: 0,
                                        booking_id:bookingInfo.id,
                                        user_to_notify:bookingInfo.users[0]?.id,
                                        passenger_id:bookingInfo.passenger_infos[0]?.id,
                                        driver_id:bookingInfo.drivers.length > 0 ? bookingInfo.drivers[0].id : null,
                                        notification_type: 9, // BOOKING STATUS UPDATED
                                        tagline: JSON.stringify({
                                            PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                                            PickUpLocation: bookingInfo.pickup_location,
                                            DropOffLocation: bookingInfo.dropoff_location,
                                            AdminTagline:`Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                                            UserTagline:"",
                                            DriverTagline:"",
                                        })
                                    }
                                    postToNotification(notificationObj);
                                }
                                if(statusId == 3){
                                    statusName = "CANCELLED";
                                    let notificationObj = {
                                        data: "Booking Canceled",
                                        is_read: 0,
                                        booking_id:bookingInfo.id,
                                        user_to_notify:bookingInfo.users[0]?.id,
                                        passenger_id:bookingInfo.passenger_infos[0]?.id,
                                        driver_id:bookingInfo.drivers.length > 0 ? bookingInfo.drivers[0].id : null,
                                        notification_type: 8, //"Booking Cancelled"
                                        tagline: JSON.stringify({
                                            PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                                            PickUpLocation: bookingInfo.pickup_location,
                                            DropOffLocation: bookingInfo.dropoff_location,
                                            AdminTagline:`Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                                            UserTagline:"Your booking is canceled at " + dateTime,
                                            DriverTagline:"",
                                        })
                                    }
                                    postToNotification(notificationObj);
                                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/send-email-for-booking-cancel`,{id:bookingInfo.id});
                                }                                
                            });
                            
                            setBookingUpdatedModalShow(true)
                        })
                }
                break
            case 'Cancel_booking':                
                setConfirmModalContent('"Do you want to cancel this ride ?"');
                if (cancel_status) {
                    setConfirmModalShow(true);
                    setconfirmModalTitle('Cancel the ride')
                    setConfirmButtonName('Cancel')                    
                }
                break
            case 'driver':
                //setConfirmModalContent('"Do you want to Reassign this ride ?"');
                //setConfirmModalShow(true);
                //setconfirmModalTitle('Reassign the ride')
                //setConfirmButtonName('Reassign')
                setReassignModalShow(true)
                break
            case 'fix_price':
                if (id && buttonActive) {
                    setLoadingShow(true)
                    //axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/update`,{id:id,estimate_price: estimate_price})
                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/fix-price-multiple`, { estimate_price_info: estimate_price_info })
                        .then((res) => {
                            // dispatch(select_booking(res.data));
                            // setBookings(res.data)
                            initial_function()
                            setLoadingShow(false)
                            
                            id.map((item, index) => {                                 
                                let updatedPrice = estimate_price_info.find(x=>x.id == item).estimate_price;
                                let bookingInfo = bookings.find(b=>b.id == item);

                                let notificationObj = {
                                    data: "Fix Booking Price",
                                    is_read: 0,
                                    user_to_notify:bookingInfo.users[0]?.id,
                                    passenger_id:bookingInfo.passenger_infos[0]?.id,
                                    booking_id:item,
                                    driver_id:bookingInfo.drivers.length > 0 ? bookingInfo.drivers[0].id : null,
                                    notification_type: 10, // PRICE HAS BEEN FIXED
                                    tagline: JSON.stringify({
                                        PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                                        UpdatedPrice:updatedPrice,
                                        PickUpLocation: bookingInfo.pickup_location,
                                        DropOffLocation: bookingInfo.dropoff_location,
                                        AdminTagline:`Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Updated Price: ${updatedPrice} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                                        UserTagline:"",
                                        DriverTagline:"",
                                    })
                                }    
                                postToNotification(notificationObj)
                                axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/send-email-for-booking-price-fixed`,{id:bookingInfo.id});
                            });
                            
                            setBookingUpdatedModalShow(true)
                        })
                }
                break
        }
    }

    const reassignDriver = () => {
        
        if (selected_driver.length > 0) {

            var BookingId = selectedReassignBookingId;
           
            var driver = selected_driver.find(driver => driver !== undefined && driver.BookingId === BookingId);
            
            if (driver) {

                var DriverId = driver.Id;

                setSelectedDriver(DriverId); 

                setDriverReassignBookings((prev) => {
                    const filteredBookings = prev.filter((item) => item.BookingId !== BookingId);
                    return [...filteredBookings, { DriverId, BookingId }];
                });

                let key = bookings.findIndex(b=>b.id == BookingId);
                let temp_array = [...bookings]; 
                temp_array[key] = { ...temp_array[key], reassignFlag: true };
                setBookings(temp_array);
            }

        }
        setModalshow(false);
    };


    const closeReAssignPopUp = () => {
        setReassignModalShow(false)
    }

    const closeBookingUpdatePopUp = () => {
        setBookingUpdatedModalShow(false)
    }

    const reAssignDriver = () => {        
        if (driverReassignBookings.length > 0) {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/reAssignDriver`, driverReassignBookings)
                .then((res) => {
                    initial_function()
                    setDriverReassignBookings([])
                    setReassignModalShow(false)                   

                    driverReassignBookings.map((item, index) => {                         
                        let driverName = allActiveDrivers.find(x=>x.value == item.DriverId).label;
                        let bookingInfo = bookings.find(b=>b.id == item.BookingId);
                        let driverExist = bookingInfo.drivers.length;
                        let dateTime = notificationDateTimeFormat(new Date());

                        let adminNotificationObj = {
                            data: driverExist == 0 ? "Rider is Assign to Booking" : "Rider is ReAssign to Booking",
                            is_read: 0,
                            user_to_notify:0,
                            passenger_id:bookingInfo.passenger_infos[0]?.id,
                            booking_id:item.BookingId,
                            driver_id:item.DriverId,
                            notification_type: driverExist == 0 ? 6 : 11, // 6 BOOKING ASSIGNED and 11 BOOKING REASSIGNED
                            tagline: JSON.stringify({
                                DriverName:driverName,
                                PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                                PickUpLocation: bookingInfo.pickup_location,
                                DropOffLocation: bookingInfo.dropoff_location,
                                AdminTagline:`Driver Name: ${driverName} Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                                UserTagline:"",
                                DriverTagline:`Driver Name: ${driverName} Passenger Name: ${bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name} Pickup Address: ${bookingInfo.pickup_location} Drop Off Address: ${bookingInfo.dropoff_location}`,
                            })
                        }    
                        postToNotification(adminNotificationObj)

                        // let userNotificationObj = {
                        //     data: "Driver has been assigned to Booking",
                        //     is_read: 0,
                        //     user_to_notify:bookingInfo.users[0]?.id,
                        //     passenger_id:bookingInfo.passenger_infos[0]?.id,
                        //     booking_id:item.BookingId,
                        //     driver_id:item.DriverId,
                        //     notification_type: 6, // 6 BOOKING ASSIGNED
                        //     tagline: JSON.stringify({
                        //         DriverName:driverName,
                        //         PassengerName: bookingInfo.passenger_infos[0]?.first_name + " " + bookingInfo.passenger_infos[0]?.last_name,
                        //         PickUpLocation: bookingInfo.pickup_location,
                        //         DropOffLocation: bookingInfo.dropoff_location,
                        //         AdminTagline:"",
                        //         UserTagline:"Your booking is Assigned Successfully to "+ driverName +" at "+ dateTime +" Ready with your Bags.",
                        //         DriverTagline:"",
                        //     })
                        // }    
                        // postToNotification(userNotificationObj)
                    });

                    setBookingUpdatedModalShow(true)
                })
        }
        else{
            setReassignModalShow(false)
        }
    }

    useEffect(() => {
        let temp_array = Array.from(bookings)
        let count = 0;
        temp_array.map((val) => {
            if (val.active)
                count++
        })

        if (count > 0)
            setDeleteButtonActive(true)
        else
            setDeleteButtonActive(false)
        // if (count === 1)
        //     setButtonactive(true);
        // else 
        //     setButtonactive(false);

        //check if checkbox is selected
        if (count > 0)
            setButtonactive(true)
        else
            setButtonactive(false)


    }, [bookings])

const getAllActiveDrivers = () =>{
    setAllActiveDrivers([]);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/get-all-active-drivers`)
    .then((res)=>{      
        let temp_array=[];                  
        if (res.data)
            res.data.map((val)=>{
                temp_array.push({label:val.first_name  + ' ' + val.last_name,value:val.id})
            })
        setAllActiveDrivers(temp_array)
    })
}

    return (
        <div className='dashboard'>
            <Sidebar />
            <div className='content admin-booking'>
                <div className='content-panel'>
                    <div className='content-panel__heading'>
                        <div className='caption'>
                            <h5>bookings</h5>
                            <DynamicTimer />
                        </div>
                        <div className='dropdown'>
                            <div className='nav-item'>
                                <div className='search'>
                                    <input type="text" value={searchKey} onChange={handleSearchChange} placeholder="search.." />
                                    <i onClick={searchFilter} className='fa fa-search' style={{ cursor: 'pointer' }}></i>
                                </div>
                            </div>
                            <div className='nav-item'>
                                <div className='svg-container'>
                                   <BellPic></BellPic>
                                 </div>
                            </div>
                            <UserIcon></UserIcon>
                        </div>
                    </div>
                    <div className='content-panel__content IncreasZindex'>
                        <Row>
                            <Col xs={12}>
                                <div className='card'>
                                    <div className='card-body'>
                                        <div className={ visibleUpdateBtn ? 'btns' : '' }>
                                            {visibleUpdateBtn ? (
                                                <h6 className={buttonActive ? 'update active' : 'update'} onClick={updateBookingRecord}>
                                                update
                                                <i className="fas fa-chevron-down"></i>
                                            </h6>
                                            ):''}                                            
                                            {/* <h6 className={deleteButtonActive ? 'delete active' : 'delete'} onClick={booking_delete}>delete</h6> */}
                                        </div>
                                        <Tabs
                                            id="controlled-tab-example"
                                            activeKey={key}
                                            onSelect={handleTabChange}
                                            className="section-header "
                                        >

                                            <Tab eventKey="booking" className='w-tabpanel' title="Bookings">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            {/* <th> <Form.Check.Input
                                                                type={"checkbox"}
                                                                checked={isAllchecked}
                                                                onClick={checkBoxClick}

                                                            />
                                                            </th> */}
                                                            <th>Trip Number</th>
                                                            <th>Pickups</th>
                                                            <th>Drop Off</th>
                                                            <th>Passenger Name</th>
                                                            <th>Passenger Number</th>
                                                            <th>Passengers</th>
                                                            <th>Date & time</th>
                                                            <th>Vehicle</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            bookings.map((val, key) => {

                                                                return (
                                                                    <tr key={key}>
                                                                        {/* <td>
                                                                            <Form.Check
                                                                                type={"checkbox"}
                                                                                checked={val.active}
                                                                                onChange={(e) => {
                                                                                    let temp_array = Array.from(bookings);
                                                                                    e.target.checked ? temp_array[key].active = true : temp_array[key].active = false;
                                                                                    setBookings(temp_array);
                                                                                }}
                                                                            />
                                                                        </td> */}
                                                                        <td className='w-88'>#{val.id}</td>
                                                                        <td className='w-210'>{val.pickup_location}</td>
                                                                        <td className='w-210'>{val.dropoff_location}</td>
                                                                        <td className='w-116'>{val.passenger_infos ? val.passenger_infos[0]?.first_name + " " + val.passenger_infos[0]?.last_name : ''}</td>                                                                        
                                                                        <td className='w-133'>{val.passenger_infos ? val.passenger_infos[0]?.mobile_phone : ''}</td>                                                                        
                                                                        <td className='w-78'>{val.passenger}</td>
                                                                        <td className='w-90'>{formatDate(val.pickup_date)} {val.pickup_time != null ? Convert12hourformat(val.pickup_time) : ''}</td>
                                                                        <td className='w-51'>{val.vehicles[0]?.name ? val.vehicles[0].name : 'No vehicle available'}</td>                                                                        
                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                </table>
                                            </Tab>
                                            <Tab eventKey="booking_status" className='w-tabpanel' title="Booking status">
                                                <table>
                                                    <thead className='TheadZindex'>
                                                        <tr>
                                                            <th>
                                                                <Form.Check.Input
                                                                    type={"checkbox"}
                                                                    checked={isAllchecked}
                                                                    onClick={checkBoxClick}

                                                                />
                                                            </th>
                                                            <th className='w-88'>Trip Number</th>
                                                            <th className='w-210'>Pickups</th>
                                                            <th className='w-210'>Drop Off</th>
                                                            <th className='w-116'>Passenger Name</th>
                                                            <th className='w-133'>Passenger Number</th>
                                                            <th className='w-90'>Date & time</th>
                                                            <th className='w-119'>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {

                                                            bookings.map((val, key) => {
                                                                let temp_date = new Date(val.pickup_date);
                                                                let temp_date_string = '';
                                                                let temp_date_date = temp_date.getDate();
                                                                let temp_date_year = temp_date.getFullYear();
                                                                temp_date_string = temp_date_date + temp_date_year;

                                                                return (
                                                                    <tr key={key}>
                                                                        <td>
                                                                            <Form.Check
                                                                                type={"checkbox"}
                                                                                checked={val.active}
                                                                                onChange={(e) => {
                                                                                    let temp_array = Array.from(bookings);
                                                                                    e.target.checked ? temp_array[key].active = true : temp_array[key].active = false;
                                                                                    setBookings(temp_array);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className='w-88'>#{val.id}</td>
                                                                        <td className='w-210'>{val.pickup_location}</td>
                                                                        <td className='w-210'>{val.dropoff_location}</td>
                                                                        <td className='w-116'>{val.passenger_infos[0]?.first_name + " " + val.passenger_infos[0]?.last_name}</td>
                                                                        <td className='w-133'>{val.passenger_infos[0]?.mobile_phone}</td>
                                                                        <td className='w-90'>{formatDate(val.pickup_date)} {val.pickup_time != null ? formatTime(val.pickup_time) : ''}</td>
                                                                        <td className='w-119'>
                                                                            <CustomSelect options={options} value={val.booking_status} indexKey={key} bookingStatus={booking_status} function={setBooking_status} bookings={bookings} 
    setBookings={setBookings}></CustomSelect>
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                </table>
                                            </Tab>
                                            <Tab eventKey="Cancel_booking" className='w-tabpanel' title="Cancel booking">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <Form.Check.Input
                                                                    type={"checkbox"}
                                                                    checked={isAllchecked}
                                                                    onClick={checkBoxClick}

                                                                />
                                                            </th>
                                                            <th className='w-88'>Trip Number</th>
                                                            <th className='w-210'>Pickups</th>
                                                            <th className='w-210'>Drop Off</th>
                                                            <th className='w-116'>Passenger Name</th>
                                                            <th className='w-133'>Passenger Number</th>
                                                            <th className='w-90'>Date & time</th>
                                                            <th className='w-119'>Cancel Ride</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            bookings.map((val, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>
                                                                            <Form.Check
                                                                                type={"checkbox"}
                                                                                checked={val.active}
                                                                                onChange={(e) => {
                                                                                    let temp_array = Array.from(bookings);
                                                                                    e.target.checked ? temp_array[key].active = true : temp_array[key].active = false;
                                                                                    
                                                                                    let temp_arrayy = Array.from(cancelStatus);
                                                                                    if (cancelStatus[key]) {
                                                                                        temp_arrayy[key] = false; temp_array[key].cancel = false;
                                                                                        
                                                                                    }
                                                                                    else {
                                                                                        temp_arrayy[key] = true; temp_array[key].cancel = true;                                                                                        
                                                                                    }
                                                                                    setCancelStatus(temp_arrayy)
                                                                                    setBookings(temp_array);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className='w-88'>#{val.id}</td>
                                                                        <td className='w-210'>{val.pickup_location}</td>
                                                                        <td className='w-210'>{val.dropoff_location}</td>
                                                                        <td  className='w-116' style={{ textAlign: 'center' }}>{val.passenger_infos[0]?.first_name + " " + val.passenger_infos[0]?.last_name}</td>
                                                                        <td className='w-133' style={{ textAlign: 'center' }}>{val.passenger_infos[0]?.mobile_phone}</td>

                                                                        <td className='w-90'>{formatDate(val.pickup_date)}<br />
                                                                            {val.pickup_time != null ? formatTime(val.pickup_time) : ''}
                                                                        </td>
                                                                        <td className='cancel-status w-119'>{val.booking_status != 3 ?
                                                                            <h6 className={cancelStatus[key] ? 'canceled' : 'cancelling'}
                                                                                onClick={() => {                                                                                    
                                                                                    let temp_array = Array.from(cancelStatus);
                                                                                    let temp_booking = Array.from(bookings);

                                                                                    if (cancelStatus[key]) {
                                                                                        temp_array[key] = false; temp_booking[key].cancel = false;
                                                                                        temp_booking[key].active = false
                                                                                    }
                                                                                    else {
                                                                                        temp_array[key] = true; temp_booking[key].cancel = true;
                                                                                        temp_booking[key].active = true
                                                                                    }
                                                                                    setCancelStatus(temp_array)
                                                                                    setBookings(temp_booking)
                                                                                }}
                                                                            > {cancelStatus[key] ? 'canceled Ride' : 'cancel ride'}
                                                                            </h6>
                                                                            : <h6 className='canceled'>cancelled ride</h6>}
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </Tab>
                                            <Tab eventKey="fix_price" className='w-tabpanel' title="Fix booking price">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <Form.Check.Input
                                                                    type={"checkbox"}
                                                                    checked={isAllchecked}
                                                                    onClick={checkBoxClick}

                                                                />
                                                            </th>
                                                            <th className='w-88'>Trip Number</th>
                                                            <th className='w-210'>Pickups</th>
                                                            <th className='w-210'>Drop Off</th>
                                                            <th className='w-116'>Passenger Name</th>
                                                            <th className='w-133'>Passenger Number</th>
                                                            <th className='w-90'>Date & time</th>
                                                            <th className='w-138'>Fix the price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            bookings.map((val, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>
                                                                            <Form.Check
                                                                                type={"checkbox"}
                                                                                checked={val.active}
                                                                                onChange={(e) => {
                                                                                    let temp_array = Array.from(bookings);
                                                                                    e.target.checked ? temp_array[key].active = true : temp_array[key].active = false;
                                                                                    setBookings(temp_array);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className='w-88'>#{val.id}</td>
                                                                        <td className='w-210'>{val.pickup_location}</td>
                                                                        <td className='w-210'>{val.dropoff_location}</td>
                                                                        <td className='w-116'>{val.passenger_infos[0]?.first_name + " " + val.passenger_infos[0]?.last_name}</td>
                                                                        <td className='w-133'>{val.passenger_infos[0]?.mobile_phone}</td>
                                                                        <td className='w-90'>{formatDate(val.pickup_date)} {val.pickup_time != null ? formatTime(val.pickup_time) : ''}</td>
                                                                        <td className='w-138'><div className='table-price'>
                                                                            
                                                                            <span>$</span>
                                                                            <input disabled={!val.active} type='number'
                                                                                value={val.estimate_price}
                                                                                onChange={(e) => {
                                                                                    // let temp_array = Array.from(bookings);
                                                                                    // temp_array[key].estimate_price = e.target.value;
                                                                                    // setBookings(temp_array)
                                                                                    const newValue = e.target.value;
                                                                                    if (/^\d*\.?\d*$/.test(newValue)) { // Allows only numbers and decimals
                                                                                        let temp_array = [...bookings]; 
                                                                                        temp_array[key] = { ...temp_array[key], estimate_price: newValue };
                                                                                        setBookings(temp_array);
                                                                                    }
                                                                                }}
                                                                                >
                                                                            </input>
                                                                        </div>
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                </table>
                                            </Tab>
                                            <Tab eventKey="driver" className='w-tabpanel' title="Driver">
                                                <table>
                                                    <tr>
                                                        <th>
                                                            <Form.Check.Input
                                                                type={"checkbox"}
                                                                checked={isAllchecked}
                                                                onClick={checkBoxClick}

                                                            />
                                                        </th>
                                                        <th className='w-88'>Trip Number</th>
                                                        <th className='w-210'>Pickups</th>
                                                        <th className='w-210'>Drop Off</th>
                                                        <th className='w-116'>Passenger Name</th>
                                                        <th className='w-88'>Date & time</th>
                                                        <th className=''>Driver</th>
                                                        <th></th>
                                                    </tr>
                                                    {
                                                        bookings.map((val, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <td>
                                                                        <Form.Check
                                                                            type={"checkbox"}
                                                                            checked={val.active}
                                                                            onChange={(e) => {
                                                                                let temp_array = Array.from(bookings);
                                                                                e.target.checked ? temp_array[key].active = true : temp_array[key].active = false;
                                                                                setBookings(temp_array);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className='w-88'>#{val.id}</td>
                                                                    <td className='w-210'>{val.pickup_location}</td>
                                                                    <td className='w-210'>{val.dropoff_location}</td>
                                                                    <td className='w-116'>{val.passenger_infos[0]?.first_name + " " + val.passenger_infos[0]?.last_name}</td>
                                                                    <td className='w-90'>{formatDate(val.pickup_date)}<br />
                                                                        {val.pickup_time != null ? formatTime(val.pickup_time) : ''}
                                                                    </td>
                                                                    <td>
                                                                        {val.drivers.length > 0 ? (
                                                                            <div className='driver-meta'>
                                                                                <div className='img-container ProfileImg'>
                                                                                    <img src={val.drivers[0].imgurlpath} alt="img" style={{ width: '100%', height: '100%', objectFit:'cover', objectPosition:'center' }}></img>
                                                                                </div>
                                                                                <h5>{val.drivers[0]?.first_name} {val.drivers[0]?.last_name}</h5>
                                                                            </div>
                                                                        ) : (
                                                                            <div className='driver-meta'>
                                                                                <div className='img-container ProfileImg'>
                                                                                    <img src={driver_img} alt="img" style={{ width: '100%', height: '100%', objectFit:'cover', objectPosition:'center' }}></img>
                                                                                </div>
                                                                                <h5>Driver not assign</h5>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className='reassign'>
                                                                        
                                                                        {/* <h6 className={val.drivers && val.drivers !== undefined && val.drivers.length > 0 && driverReassignBookings.length > 0 && driverReassignBookings.find(driver => driver.DriverId !== val.drivers[0].id && driver.BookingId === val.id) !== undefined ?'reassigned' : 'reassign'} */}
                                                                        <h6 className={val.reassignFlag == true ? "reassigned" : "reassign"}
                                                                            onClick={() => {
                                                                                
                                                                                setSelectedReassignBookingId(val.id);
                                                                                
                                                                                if (val.drivers && val.drivers !== undefined && val.drivers.length > 0 && selected_driver.length === 0) {
                                                                                    setSelectedDriver(val.drivers[0].id)
                                                                                }
                                                                                else if (selected_driver.length > 0){
                                                                                    
                                                                                    var driver = selected_driver.find(driver => driver !== undefined && driver.BookingId === val.id);
                                                                                        
                                                                                    if (driver) {
                                                                                        setSelectedDriver(driver.Id); 
                                                                                    }
                                                                                    else{
                                                                                        if (val.drivers && val.drivers !== undefined && val.drivers.length > 0) {
                                                                                            setSelectedDriver(val.drivers[0].id)
                                                                                        }
                                                                                    }

                                                                                }
                                                                                
                                                                                setModalshow(true);
                                                                                setModaltitle("Reassign the Ride to Driver");
                                                                            }}
                                                                        > {'reassign'}
                                                                        </h6>
                                                                    </td>

                                                                </tr>
                                                            )
                                                        })}
                                                </table>
                                            </Tab>

                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <Confirm_modal classProp="modal" content={confirmModalContent} button_name={confirmButtonName} modalTitle={confirmModalTitle} delete_vehicle={cancel_booking} show={confirmModalShow} onHide={handleConfirmModalClose}>
            </Confirm_modal>
            <Notification_modal content="Rider has been Cancelled Successfully" modalTitle="Rider Canceled" show={notificationModalShow} onHide={handleNotificationModalClose}></Notification_modal>
            {/* <Modal className="confirm-modal modal" show={modalshow} onHide={handleModalClose} dialogClassName="modal-100w" centered>
                <Modal.Header className='pad0'> 
                    <Modal.Title>Reassign the Ride to Driver</Modal.Title>
                </Modal.Header>
                <Modal.Body className='minHeight'>

                    <div className='row mt-4 '>
                        <div className='col-sm-6 m-auto'>
                        <div className="input-wrapper d-flex bgnone">
                            <div>
                            <h5>Drivers</h5>
                            </div>
                               <div>
                               <CustomDriverSelect options={options} value={val_selectedDriver} indexKey={key} bookingStatus={setBooking_Driver} function={setBooking_Driver}></CustomDriverSelect>
                               </div>
                               
                            </div>
                        </div>

                       

                    </div>
                    <div className='row mt-4'>
                    <div className='col-sm-6 m-auto'>
                        <h6 className="update m-auto" type="submit" bookingId={selectedReassignBookingId} onClick={reassignDriver}>
                                {" "}
                                Reassign
                            </h6>
                        </div>
                    </div>
                    
                </Modal.Body>
            </Modal> */}

            <Modal className="confirm-modal modal" show={modalshow} onHide={handleModalClose} dialogClassName="modal-100w" centered>
                <Modal.Header>
                    <Modal.Title>Reassign the Ride to Driver</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-3'>
                    <>

                        <div className='row mt-4 '>
                            <div className='col-sm-6 m-auto'>
                                <div className="input-wrapper d-flex bgnone">
                                    <div>
                                        <h5>Drivers</h5>
                                    </div>
                                    <div className='widthdrop'>
                                        <CustomDriverSelect options={options} value={val_selectedDriver} indexKey={key} bookingDriver={setBooking_Driver} bookingId={selectedReassignBookingId} function={setBooking_Driver}></CustomDriverSelect>
                                    </div>

                                </div>
                            </div>



                        </div>
                        <div className='row mt-4'>
                            <div className='col-sm-6 m-auto'>
                                <h6 className="update m-auto" type="submit" bookingId={selectedReassignBookingId} onClick={reassignDriver}>
                                    {" "}
                                    Reassign
                                </h6>
                            </div>
                        </div>
                    </>
                </Modal.Body>
            </Modal>

            <Modal className="confirm-modal modal" show={getReassignModalShow} dialogClassName="modal-100w" centered>
                <Modal.Header>
                    <Modal.Title>Reassign the ride</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <h6>
                            Are you sure!
                            <br />
                            Do you wan to Reassign this Ride?
                        </h6>
                        <div className='btns modal-buttons'>
                            <h6 className='update' onClick={closeReAssignPopUp}>No, Go Back</h6>
                            <h6 className='delete mb-0' style={{ marginLeft: "10px" }} onClick={reAssignDriver}>Yes, Reassign </h6>
                        </div>
                    </>
                </Modal.Body>
            </Modal>

            <Modal className="confirm-modal modal" show={getBookingUpdatedModalShow} dialogClassName="modal-100w" centered>
                <Modal.Header>
                    <Modal.Title>Booking Updated Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>                        
                        <div className='btns modal-buttons text-center'>
                            <h6 className='update d-inline-block' onClick={closeBookingUpdatePopUp}>Okay, Go Back</h6>                            
                        </div>
                    </>
                </Modal.Body>
            </Modal>

            <LoadingShow show={loadingShow}></LoadingShow>
        </div>

        

    )
};

export { Booking };