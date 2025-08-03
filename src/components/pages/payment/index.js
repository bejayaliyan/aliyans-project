import React, { useEffect, useState } from 'react';
import {
    Container, Row, Col
} from 'react-bootstrap';
import { Header } from '../../layout/header';
import './payment.scss';
import { getAuthUser } from "../../../auth";
import Select from 'react-select';
import Status_board from '../../layout/Status_board';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { Add_passenger_info } from '../../../redux/actions/PassengerInfostateActions';
import { Link, useNavigate } from 'react-router-dom';
import { select_booking, save_booking } from '../../../redux/actions/BookingstateActions';
import LoadingShow from '../../admin/components/LoadingShow';
import moment from "moment";
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const weekday = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const getStartDate = (dateinput) => {
    let date = new Date(dateinput)
    let day = date.getDay();
    day = weekday[day];
    let month = date.getMonth();
    month = monthNames[month];
    const exactdate = date.getDate();
    const year = date.getFullYear();
    const startDate = day + ", " + month + ", " + exactdate + ", " + year;
    return startDate
};


const Payment = () => {
    const authUser = getAuthUser();
    let navigate = useNavigate();
    const [passengerInfoError, setPassengerInfoError] = useState(false);
    const [passengerInfoErrorMessage, setPassengerInfoErrorMessage] = useState("");
    const [cardPaymentError, setCardPaymentError] = useState(false);
    const temp = useSelector(state => state.bookingState.temp_booking);
    // if (!temp || !temp.pickup_date) {
    //     window.location.href = window.location.origin + "/home";
    // }
    const [nonce, setNonce] = useState(null);
    const [firstName, setFirstName] = useState(authUser?.name ?? "");
    const [lastName, setLastName] = useState("");
    const [mobileNum, setMobileNum] = useState("");
    const [email, setEmail] = useState(authUser?.email ?? "");
    const [contractName, setContractName] = useState();
    const [aliasSign, setAliasSign] = useState();
    const [cardNumber, setCardNumber] = useState();
    const [copyCardNumber, setCopyCardNumber] = useState('');
    const [bookingSaveId, setBookingSaveId] = useState(null);
    const [cardHolder, setCardHolder] = useState();
    const [instruction, setInstruction] = useState();
    const [postalCode, setPostalCode] = useState();
    const [time, setTime] = useState(temp.pickup_time)
    //  const [startDate, setStartDate] = useState(temp.pickup_date?.format("ddd, MMM DD, YYYY"));
    const [startDate, setStartDate] = useState(getStartDate(temp.pickup_date));
    const [paymentMethod, setPaymentMethod] = useState(2);
    const [cvv, setCvv] = useState();
    const [loadingShow, setLoadingShow] = useState(false);
    const [payments, setPayments] = useState(null);
    const [card, setCard] = useState(null);

    const options = [
        { label: 'Credit or Debit Card', value: 2 },
        { label: 'Cash', value: 1 },
    ]
    const dispatch = useDispatch();
    const initializeSquarePayment = async () => {
        if (window.Square) {
            try {
                // Initialize Square Payments
                const payments = window.Square.payments('sandbox-sq0idb-Nw3KfrGcJ5gB0rRbzodWlQ', 'LMTE4SHRYA247');
                setPayments(payments);

                // Create card payment method
                const card = await payments.card();
                setCard(card);

                // Attach the card method to a div (card-container)
                await card.attach('#card-container');
            } catch (error) {
                console.error('Failed to initialize Square Payments', error);
            }
        }
    };

    useEffect(() => {
        initializeSquarePayment();
    }, []);

    function changePaymentMethod(paymentMethodType) {
        setPaymentMethod(paymentMethodType);
        if (paymentMethodType == 2) {
            initializeSquarePayment();
        }
    }

    const clickPayment = async () => {
        if (!firstName || !lastName || !mobileNum || !email) {
            setPassengerInfoError(true);
            setPassengerInfoErrorMessage(`Please Enter ${!firstName?'First Name,':''} ${!lastName?"Last Name,":""} ${!mobileNum?"Mobile Number,":""} ${!email?"Email":""}`)
            window.scrollTo({ top: 0 });
            return;
        } else {
            setPassengerInfoError(false);
        }

        if (paymentMethod == 2) {
            const cardresult = await card.tokenize();

            if (cardresult.status === 'OK') {
                setCardPaymentError(false);
            } else {
                window.scrollTo({ top: 500 });
                setCardPaymentError(true);
                return;
            }

            temp.card_details = cardresult.details;
            temp.card_token = cardresult.token;
        }

        setLoadingShow(true);

        if (!authUser || (authUser && authUser.name == "")) {
            let data = {}
            data.first_name = firstName
            data.email = email
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/update`, data)
                .then((res) => {
                })
        }

        // temp.vehicle = {modalName:"abcd", rate: 123, max_passenger: 2, car_details:null};
        temp.special_instruction = instruction;
        temp.estimate_price = temp.vehicle.rate
        temp.booking_status = 2;
        temp.dropoff_place_id=temp.dropOffPlace.place_id;
        temp.pickup_place_id=temp.pickUpPlace.place_id;
        temp.pickUpPlace=null;
        temp.dropOffPlace=null;
        temp.vehicle=null;
        temp.selectedCar=null;
        let temp_passenger = {
            first_name: firstName,
            last_name: lastName,
            mobile_phone: mobileNum,
            email: email,
            contact_name: contractName,
            alias_namesign: aliasSign,
        };

        let booking_details = { ...temp };
        booking_details.payment_method_id = paymentMethod;
        booking_details.passenger_info = temp_passenger;

        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/create`, { data: booking_details })
            .then(async (res) => {                
                await postToNotification(booking_details,res.data.id,res.data.passengerId);
            });
        setLoadingShow(false);
        // end update profile
        dispatch(Add_passenger_info(temp_passenger));
        navigateToHistory();
    }

    const getTimeString = (time) => {
        var date = moment(time, 'hh:mm A');
        var timeStringFormatted = date.format('HH:mm A');
        return timeStringFormatted;

    }

    // const mobileNumInputChange = (e) => {
    //     var x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
    //     if (x) {
    //         var v = x[1] + '-' + x[2] + '-' + x[3];
    //         setMobileNum(v)
    //     }
    //     else {
    //         setMobileNum(e.target.value)
    //     }
    // }

    const mobileNumInputChange = (e) => {
        // Replace any non-digit characters and format the number
        let value = e.target.value.replace(/\D/g, ''); // Strip out any non-numeric characters
    
        if (value.length <= 10) { // Allow only up to 10 digits
            // Format the number once it has 10 digits
            if (value.length >= 7) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (value.length >= 4) {
                value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
            }
            setMobileNum(value); // Set the formatted value
        }
    }    

    const postToNotification = async (booking_details,bookingId,passengerId) => {
             
        let dateTime = notificationDateTimeFormat(new Date());           
        let tmp_notification = {
            data: 'New Booking Requested',
            is_read: 0,
            user_to_notify:authUser?.id,
            passenger_id:passengerId,
            booking_id:bookingId,
            notification_type: 3, // BOOKING REQUESTED
            tagline: JSON.stringify({
                PassengerName: booking_details.passenger_info.first_name + " " + booking_details.passenger_info.last_name,
                PickUpLocation: booking_details.pick_location,
                DropOffLocation: booking_details.dropoff_location,
                AdminTagline:`Passenger Name: ${booking_details.passenger_info.first_name + " " + booking_details.passenger_info.last_name} Pickup Address: ${booking_details.pick_location} Drop Off Address: ${booking_details.dropoff_location}`,
                UserTagline:"Congratulations, your new Booking is Requested successfully at " + dateTime,
                DriverTagline:"",
            })
        }
       await axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, tmp_notification);           
       await axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/send-new-booking-requested-email`,{id:bookingId});           
    }

    const navigateToHistory = () => {
        let temp_booking = {}
        dispatch(save_booking(temp_booking));
        navigate('/history');
    }

    return (
        <>
            <div className='client-payment' style={loadingShow ? { display: 'none' } : {}}>
                <Header />
                <div className="main">
                    <Container>
                        <Status_board />
                        <div className='main-wrap payment-board'>
                            <div className='passenger-control-btn'>

                                <div className='passenger-control'>
                                    <div className='header-text'>Passenger Info</div>
                                    {passengerInfoError ? <span className="text-danger">{passengerInfoErrorMessage}</span> : ''}
                                    <div className='custom-row'>
                                        <div className='col-sm-6 col-xs-12 mb-3 input-wrapper'>
                                            <h5>First Name: </h5>
                                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        </div>
                                        <div className='col-sm-6 mb-3 input-wrapper'>
                                            <h5>Last Name: </h5>
                                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='custom-row'>
                                        <div className='col-sm-6 mb-3 input-wrapper'>
                                            <h5>Mobile Num: </h5>
                                            <input type="text" value={mobileNum} onChange={mobileNumInputChange} />
                                        </div>
                                        <div className='col-sm-6 mb-3 input-wrapper'>
                                            <h5>Email: </h5>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='custom-row'>
                                        <div className='col-sm-6 mb-3 input-wrapper'>
                                            <h5>Contract Name: </h5>
                                            <input type="text" value={contractName} onChange={(e) => setContractName(e.target.value)} />
                                        </div>
                                        <div className='col-sm-6 mb-3 input-wrapper'>
                                            <h5>Alias/Name sign:</h5>
                                            <input type="text" value={aliasSign} onChange={(e) => setAliasSign(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='header-text payment-options-heading'>Payment Option</div>
                                    {paymentMethod == 2 && cardPaymentError ? <span className="text-danger">Please make a Payment first.</span> : ''}
                                    <div className='payment-options'>
                                        <div className='vehicle-type'>
                                            <label className='title'>Payment Method:</label>
                                            <select onChange={(e) => { changePaymentMethod(e.target.value); }} className='select-payment-method'>
                                                {options.map((value, key) => (
                                                    <option key={key} value={value.value}>{value.label}</option>
                                                ))
                                                }

                                            </select>
                                        </div>
                                    </div>
                                    {paymentMethod == 2 ?
                                        <div id="card-container"></div>
                                        : ''}
                                    <div className='header-text special-instructions'>Special Instructions</div>
                                    <Row>
                                        <Col md={12}>
                                            <div className='input-wrapper instruction'>
                                                <h5>Instructions: </h5>
                                                <div>
                                                    <textarea type="text" id="instruction" cols="4" rows="4" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                            <div className='journey-vehicle'>
                                <div className='journey'>
                                    <div className='header-wrap d-flex justify-content-between'>
                                        <label className='header-text'>Journey</label>
                                        <div style={{ display: 'inline-flex' }} className="date-time-wrapper">
                                            <div className='date'>
                                                <img src="/images/calendar.svg" alt="calender" width="20px" height="20px" />
                                                <p>{startDate}</p>
                                            </div>
                                            <div className='time'>
                                                <img src="/images/clock.svg" alt="clock" width="20px" height="20px" />
                                                <p style={{ fontSize: '16px' }}>{temp.pickup_time ? getTimeString(time) : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='journey-information'>
                                        <div className='pickup-wrapper'>
                                            <div className='pickup'>
                                                <label className='title'>Pickup:</label>
                                                <p>{temp.pick_location}</p>
                                            </div>
                                        </div>
                                        {temp.stop ? temp.stop.map((val, key) => (
                                            <div className='pickup-wrapper'>
                                                <div className='stop d-flex align-items-center justify-content-between'>
                                                    <div className='stop-location w-100'>
                                                        <label className='title'>Stop{key}:</label>
                                                        <p>{val}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        ) : ''}
                                        <div className='pickup-wrapper'>
                                            <div className='dropoff'>
                                                <label className='title'>Dropoff:</label>
                                                <p>{temp.dropoff_location}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='passenger-board'>
                                        <div className='passenger'>
                                            <div className='label'>Passenger</div>
                                            <div className='count'>{temp.passenger}</div>
                                        </div>
                                        <div className='childrens'>
                                            <div className='label'>Childrens</div>
                                            <div className='count'>{temp.children}</div>
                                        </div>
                                        <div className='bags'>
                                            <div className='label'>Bags</div>
                                            <div className='count'>{temp.bags}</div>
                                        </div>
                                    </div>
                                    <div className='vehicle'>
                                        <div className='label'>Vehicle</div>
                                        <div className='name'>{temp.vehicle ? temp.vehicle.name : ''}</div>
                                    </div>
                                    <div className='custom-row passenger-info'>
                                        <div className='vehicle'>
                                            <div className='label'>Passenger Name</div>
                                            <div className='name'>{firstName ? firstName : ''} {' ' + lastName ? lastName : ''}</div>
                                        </div>
                                        <div className='vehicle'>
                                            <div className='label'>Mobile Number</div>
                                            <div className='name'>{mobileNum}</div>
                                        </div>
                                    </div>
                                    <div className='custom-row passenger-info'>
                                        <div className='vehicle PaddingLeftZero'>
                                            <div className='label'>Payment Option</div>
                                            <div className='name'>{paymentMethod == 1 ? 'Cash' : ''}{paymentMethod == 2 ? 'credit card' : ''}</div>
                                        </div>
                                        {paymentMethod === 2 ?
                                            <div className='vehicle'>
                                                <div className='label'>Card Number</div>
                                                <div className='name'>{cardNumber}</div>
                                            </div> : ''
                                        }
                                    </div>
                                    <div className='dash-line'>
                                        <img src="/images/Line 109.png" width="100%" alt='dashed line' />
                                    </div>
                                    <div className='estimated-fair'>
                                        <div className='label'>Estimated Fair</div>
                                        <div className='cost'>${temp.vehicle ? temp.vehicle.rate : ''}</div>
                                    </div>

                                </div>
                                <div className='btns'>
                                    <div className="back"><Link to='/vehicles'>Go Back</Link></div>
                                <div className="payment" id="sq-creditcard" onClick={() => clickPayment()}><span >Book your ride</span></div>
                                    <div className='termsConditions'> <Link to='//notification'>By booking, I agree to all the Trems & Conditions</Link></div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <LoadingShow show={loadingShow}></LoadingShow>
        </>
    )
};

export { Payment };