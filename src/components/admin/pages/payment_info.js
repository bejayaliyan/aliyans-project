import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    Container, Row, Col
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { select_vehicle } from '../../../redux/actions/VehiclestateActions';
import axios from 'axios';
import { Add_passenger_info } from '../../../redux/actions/PassengerInfostateActions';
import { useNavigate } from 'react-router-dom';
import { select_booking, save_booking } from '../../../redux/actions/BookingstateActions';
import Filters from '../../../images/filters.png';
import Profile_user from '../../../images/profile-user.png';
import Shopping_bag from '../../../images/shopping-bag.png';
import { Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import DriverModal from '../modal/driver_modal'
import UserIcon from '../components/userIcon'
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer';
import Status_board from '../../layout/Status_board';
import './dashboard.scss';
import './payment_info.scss';



const PaymentInfo = () => {
    const temp = useSelector(state => state.bookingState.temp_booking);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [mobileNum, setMobileNum] = useState();
    const [email, setEmail] = useState();
    const [contractName, setContractName] = useState();
    const [aliasSign, setAliasSign] = useState();
    const [cardNumber, setCardNumber] = useState();
    const [copyCardNumber, setCopyCardNumber] = useState('');
    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [bookingSaveId, setBookingSaveId] = useState(null);
    const [cardHolder, setCardHolder] = useState();
    const [instruction, setInstruction] = useState();
    const [postalCode, setPostalCode] = useState();
    const [time, setTime] = useState(temp.pickup_time)
    const [startDate, setStartDate] = useState(temp.pickup_date?.format("ddd, MMM DD, YYYY"));
    const [paymentMethod, setPaymentMethod] = useState();
    const [cvv, setCvv] = useState();
    const [loadingShow, setLoadingShow] = useState(false);

    const options = [
        { label: 'paypal', value: 1 },
        { label: 'credit card', value: 2 }
    ]
    const dispatch = useDispatch();
    const clickPayment = async () => {
        let temp_passenger = {}
        temp_passenger.first_name = firstName;
        temp_passenger.last_name = lastName;
        temp_passenger.mobile_phone = mobileNum;
        temp_passenger.email = email;
        temp_passenger.contact_name = aliasSign;
        temp_passenger.alias_namesign = cardNumber;
        setLoadingShow(true);
        await window.handlePaymentMethodSubmission();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/passengerInfo/add/`, temp_passenger)
            .then((res) => {
                if (res.data && res.data.status === 'ok') {
                    temp.user_info_id = res.data.id
                    temp.pickup_location = temp.pick_location;
                    postToBooking(res.data.id);
                }
            })
        dispatch(Add_passenger_info(temp_passenger));
    }
    const postToBooking = (id) => {
        temp.special_instruction = instruction;
        temp.estimate_price = temp.vehicle
        temp.booking_status = 2;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/create`, temp)
            .then((res) => {
                setBookingSaveId(res.data.id)
                postToPassInfo(res.data.id, id)
                postTostop(res.data.id)
            })
    }

    const postToPassInfo = (id, passenger_id) => {
        const passengertemp = {};
        passengertemp.passenger_id = passenger_id;
        passengertemp.booking_id = id;
        passengertemp.payment_method_id = paymentMethod;
        passengertemp.card_number = copyCardNumber;
        passengertemp.month = month;
        passengertemp.year = year;
        passengertemp.card_holder = cardHolder;
        passengertemp.postal_code = postalCode;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/paymentCreate`, passengertemp)
    }

    const getTimeString = (time) => {
        let str = new Date(time)
        // let hour = str.substring(0,2);
        // let MP
        // if (hour > 12)
        //     {hour = hour -12 ; MP = 'PM';}
        // else if (hour == 12){
        //     MP = 'PM'
        // }
        // else {
        //     MP = "AM"
        // }

        // let min = str.slice(-2);
        // let return_str = hour + " : " +min + " "+ MP;
        return str.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    }

    const mobileNumInputChange = (e) => {
        var x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
        if (x) {
            var v = x[1] + '-' + x[2] + '-' + x[3];
            setMobileNum(v)
        }
        else {
            setMobileNum(e.target.value)
        }
    }
    const updateCardNumber = (e) => {
        let keyCode = e.keyCode;
        var val = copyCardNumber;
        var iVal = e.target.value;
        var selStart = e.target.selectionStart;

        switch (keyCode) {
            case 8: // backspace
                if (selStart > 0) {
                    val = val.substr(0, selStart - 1) + val.substr(selStart, val.length);
                }
                break;
            case 46: // del
                if (selStart < (val.length - 1)) {
                    val = val.substr(0, selStart) + val.substr(selStart + 1, val.length);
                }
                break;
            default:
                if (e.key.length > 1) break;
                if (val.length == 0) {
                    val = e.key;

                } else {
                    val = val.substr(0, selStart) + e.key + val.substr(selStart, val.length);
                }
                break;
        }
        setCopyCardNumber(val);
        var reg = /\d(?=\d{4})/mg
        val.replace(reg, "*")
        setCardNumber(val.replace(reg, "*"))
    }

    const postTostop = (id) => {
        temp.booking_id = id;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/stopsave`, temp)
            .then((res) => {
                if (res.data.status === 'ok')
                    postToNotification();
            })
    }
    let navigate = useNavigate();
    const postToNotification = () => {
        let tmp_notification = {
            data: 'Booking requested',
            is_read: 0,
            notification_type: 3

        }
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, tmp_notification)
            .then((res) => {
                setLoadingShow(false);
                naviageToHistory()
            })
    }
    const naviageToHistory = () => {
        let temp_booking = {}
        dispatch(save_booking(temp_booking))
        navigate('/history')
    }
    return (
        <div className='dashboard payment'>
            <Sidebar />
            <div className='content book_rider'>
                <div className='content-panel'>
                    <div className='content-panel__heading'>
                        <div className='caption'>
                            <h5>Select Vehicle</h5>
                            <DynamicTimer />
                        </div>
                        <div className='dropdown'>
                        <div className='nav-item'>
                                <div className='button'>
                                    <i className='fa fa-plus'></i>
                                    <h6>Add driver</h6>
                                </div>
                            </div>
                            <div className='nav-item bell'>
                                <div className='svg-container'>
                                    <Link to="/admin/notification">
                                        <BellPic />
                                    </Link>
                                </div>
                            </div>

                            <UserIcon></UserIcon>
                        </div>
                    </div>
                    <div className='content-panel__content'>
                        <div className='main-wrap payment-board'>
                            <Row>
                                <Col xs={7}>
                                    <div className='passenger-control-btn'>

                                        <div className='passenger-control'>
                                            <div className='header-text'>Passenger Info</div>
                                            <div className='custom-row'>
                                                <div className='input-wrapper'>
                                                    <h5>First Name: </h5>
                                                    <p>Danny</p>
                                                </div>
                                                <div className='input-wrapper'>
                                                    <h5>Last Name: </h5>
                                                    <p>Wills</p>
                                                </div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='input-wrapper'>
                                                    <h5>Mobile Num: </h5>
                                                    <p>561-734-2086</p>
                                                </div>
                                                <div className='input-wrapper'>
                                                    <h5>Email: </h5>
                                                    <p>Lorem@mail.com</p>
                                                </div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='input-wrapper'>
                                                    <h5>Contract Name: </h5>
                                                    <p>Flora</p>
                                                </div>
                                                <div className='input-wrapper'>
                                                    <h5>Alias/Name sign:</h5>
                                                    <p>321654</p>
                                                </div>
                                            </div>
                                            <div className='header-text'>Payment Option</div>
                                            <div className='custom-row half-size'>
                                                <div className='vehicle-type'>
                                                    <label className='title'>Payment type:</label>
                                                    <Select

                                                        onChange={(e) => setPaymentMethod(e.value)}
                                                        options={options}
                                                        isSearchable="true"
                                                    />
                                                </div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='input-wrapper w-100'>
                                                    <h5>Card Number: </h5>
                                                    <p>xxxx xxxx xxxx 9099</p>
                                                </div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='input-wrapper'>
                                                    <h5>MM/YY:</h5>
                                                    <p>09/27</p>
                                                </div>
                                                <div className='input-wrapper'>
                                                    <h5>CVV:</h5>
                                                    <p>XXX</p>
                                                </div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='input-wrapper'>
                                                    <h5>Card holder Name:</h5>
                                                    <p>Flora Wills</p>
                                                </div>
                                                <div className='input-wrapper'>
                                                    <h5>Card Billing postal code:</h5>
                                                    <p>Flora Wills</p>
                                                </div>
                                            </div>
                                            <div className='header-text'>Special Instructions</div>
                                            <Row>
                                                <Col md={12}>
                                                    <div className='input-wrapper instruction'>
                                                        <h5>Instructions: </h5>
                                                        <div>
                                                            <p></p>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={5}>
                                    <div className='journey-vehicle'>
                                        <div className='journey'>
                                            <div className='header-wrap d-flex justify-content-between'>
                                                <label className='header-text'>Journey</label>
                                                <div style={{ display: 'inline-flex' }} className="date-time-wrapper">
                                                    <div className='date'>
                                                        <img src="/images/calendar.png" alt="calender" width="20px" height="20px" />
                                                        <h6>{startDate}</h6>
                                                    </div>
                                                    <div className='time'>
                                                        <img src="/images/clock.png" alt="clock" width="20px" height="20px" />
                                                        <p style={{ fontSize: '1vw' }}>{temp.pickup_time ? getTimeString(time) : ''}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='journey-information'>
                                                <div className='pickup-wrapper'>
                                                    <div className='pickup'>
                                                        <label className='title'>Pickup:</label>
                                                        <p>3348 Mulberry Lane, Boynton Beach, United States</p>
                                                    </div>
                                                </div>
                                                {temp.stop ? temp.stop.map((val, key) => (
                                                    <div className='pickup-wrapper'>
                                                        <div className='stop d-flex align-items-center justify-content-between'>
                                                            <div className='stop-location w-100'>
                                                                <label className='title'>Stop{key}:</label>
                                                                <p>33 mile Lane, Boynton Beach, United States</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                ) : ''}
                                                <div className='pickup-wrapper'>
                                                    <div className='dropoff'>
                                                        <label className='title'>Dropoff:</label>
                                                        <p>Victoria Park, Boynton Beach, United States</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='passenger-board'>
                                                <div className='passenger'>
                                                    <div className='label'>Passenger</div>
                                                    <div className='count'>3</div>
                                                </div>
                                                <div className='childrens'>
                                                    <div className='label'>Childrens</div>
                                                    <div className='count'>3</div>
                                                </div>
                                                <div className='bags'>
                                                    <div className='label'>Bags</div>
                                                    <div className='count'>3</div>
                                                </div>
                                            </div>
                                            <div className='vehicle'>
                                                <div className='label'>Vehicle</div>
                                                <div className='name'>Sedan</div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='vehicle'>
                                                    <div className='label'>Passenger Name</div>
                                                    <div className='name'>Danny</div>
                                                </div>
                                                <div className='vehicle'>
                                                    <div className='label'>Mobile Number</div>
                                                    <div className='name'>561-734-2086</div>
                                                </div>
                                            </div>
                                            <div className='custom-row'>
                                                <div className='vehicle'>
                                                    <div className='label'>Payment Option</div>
                                                    <div className='name'>Credit card</div>
                                                </div>
                                                <div className='vehicle'>
                                                    <div className='label'>card number</div>
                                                    <div className='name'>xxxx xxxx xxxx 9099</div>
                                                </div>
                                            </div>
                                            <div className='dash-line'>
                                                <img src="/images/Line 109.png" width="100%" alt='dashed line' />
                                            </div>
                                            <div className='estimated-fair'>
                                                <div className='label'>Estimated Fair</div>
                                                <div className='cost'>$120</div>
                                            </div>

                                        </div>
                                        <div className='btns'>
                                            <div className="back"><Link to='/vehicles'>Go Back</Link></div>
                                            <div className="payment" id="sq-creditcard" onClick={() => clickPayment()}><span >Book your ride</span></div>
                                            <div className="terms"><p>By booking, I agree to all the Trems & Conditions</p></div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            {/* <DriverModal modalshow={modalshow} val={modalData}  getDrivers={getDrivers} handleModalClose={handleModalClose} modaltitle={modaltitle}></DriverModal> */}
        </div>
    )
};

export { PaymentInfo };