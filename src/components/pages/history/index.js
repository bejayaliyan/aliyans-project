import React, {useEffect, useState} from 'react';
import { Container,Row, Col,Modal } from 'react-bootstrap';
import { Header } from '../../layout/header';
import './history.scss';
import Filters from '../../../images/white-filters.svg';
import { Link } from "react-router-dom";
import { BookingDetailModal } from './bookingDetailModal.js';
import axios from 'axios';
import Map from './Map';
import {RiderStatusPanel} from './riderStatus';
import Pickup from "../../../images/pickup.svg";
import Dropoff from "../../../images/dropoff.svg";
import AddStop from "../../../images/addstop.svg";
import { formatDateTime } from '../../../utils/formatDateTime.js';
import { formatDate } from '../../../utils/formatDate.js';
import { formatTime } from '../../../utils/formatTime.js';
import { Convert12hourformat } from '../../../utils/Convert12hourformat.js';
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const History = () => {    
    const [selectedId,setSelectedId] = useState(0)
    const [ historyData, setHistoryData]=useState([])
    const [ selectedHistory, setSelectedHistory]= useState({vehicles:[],passenger_infos:[],users:[]})
    const [ places,setPlaces ] =useState([]);
    const [ currentStatus, setCurrentStatus ] = useState()
    const [showModal, setModalShow] = useState(false);
    const [showCancelRideModel, setShowCancelRideModel] = useState(false);
    const closeModal = () => {
        setModalShow(false);
    };
    const setHistory = (key)  => {
        setSelectedId(key);
        if(window.screen.availWidth < 991) { 
        setModalShow(true); 
        }
    }
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/get`)
        .then((res)=>{
            setHistoryData(res.data)
            
        })
    },[])   
    useEffect(()=>{
        setSelectedHistory(historyData[selectedId]);

        if (historyData[selectedId])
            setCurrentStatus(historyData[selectedId].booking_status)
        
    },[selectedId,historyData])
    useEffect(async ()=>{
        
            const temp_array=[];
            console.log(selectedHistory)
            if (selectedHistory && selectedHistory.pickup_location && selectedHistory.dropoff_location){
            // geocodeByAddress(selectedHistory.pickup_location)
            let pickup_res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/geocode_address/get?query=${selectedHistory.pickup_location}`);
            let pickup_location = pickup_res.data?.results[0]?.geometry?.location;
            temp_array.push({latitude:pickup_location.lat, longitude:pickup_location.lng, icon: Pickup});
            // Stops..
            for(let i=0; i<selectedHistory.stops.length; i++) {
            let stop = selectedHistory.stops[i];
            let stop_res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/geocode_address/get?query=${stop.address}`);
            let stop_location = stop_res.data?.results[0]?.geometry?.location;
            temp_array.push({latitude:stop_location.lat, longitude:stop_location.lng, icon: AddStop});
            }

            let dropoff_res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/geocode_address/get?query=${selectedHistory.dropoff_location}`);
            let drop_location = dropoff_res.data?.results[0]?.geometry?.location;
            temp_array.push({latitude:drop_location.lat, longitude:drop_location.lng, icon: Dropoff});

            setPlaces(temp_array);
            console.log(temp_array); 
            }
    },[selectedHistory])
    const reg = /\d(?=\d{4})/mg 
    
    const handleDownloadWayBill = () => {                
        if(selectedHistory != null){
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/generate-way-bill-pdf`,{ id: selectedHistory.id},{responseType: 'blob'})
            .then((response) => response.data)
              .then((blob) => {            
                if(blob.size > 9 && blob.type == "application/pdf"){                    
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'waybill.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
                else{
                    alert("Waybill not generated yet");
                }
              })
              .catch((error) => {
                console.error('Error generating PDF receipt: ', error);
              });
        }        
    }
    
    const postToNotification = (data) => {
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
    }

    const handleCancelRide = () => {       
        if (selectedHistory != null) {
            let id = []; let bookingStatuses = [];
            id.push(selectedHistory.id);
            bookingStatuses.push(3);
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/update`, { id: id, booking_status: bookingStatuses })
                .then((res) => {
                    let dateTime = notificationDateTimeFormat(new Date());
                    let notificationObj = {
                        data: "Booking Canceled",
                        is_read: 0,
                        user_to_notify: selectedHistory.users[0]?.id,
                        passenger_id: selectedHistory.passenger_infos[0]?.id,
                        booking_id: selectedHistory.id,
                        driver_id: selectedHistory.drivers.length > 0 ? selectedHistory.drivers[0].id : null,
                        notification_type: 8, //"Booking Cancelled"
                        tagline: JSON.stringify({
                            PassengerName: selectedHistory.passenger_infos[0]?.first_name + " " + selectedHistory.passenger_infos[0]?.last_name,
                            PickUpLocation: selectedHistory.pickup_location,
                            DropOffLocation: selectedHistory.dropoff_location,
                            AdminTagline: `Passenger Name: ${selectedHistory.passenger_infos[0]?.first_name + " " + selectedHistory.passenger_infos[0]?.last_name} Pickup Address: ${selectedHistory.pickup_location} Drop Off Address: ${selectedHistory.dropoff_location}`,
                            UserTagline: "Your booking is canceled at " + dateTime,
                            DriverTagline: "",
                        })
                    }
                    postToNotification(notificationObj);
                    axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/send-email-for-booking-cancel`, { id: selectedHistory.id });
                    setShowCancelRideModel(false)
                    alert("Ride cancelled successfully");
                })
        }
    }

    const closeCancelRidePopup = () => {
        setShowCancelRideModel(false)
    }

    const cancelRide = () => {
        setShowCancelRideModel(true)
    }

    return (
       <div className='history-board'>
            <Header />
        {historyData && historyData.length > 0 ? 
        <div className='container-fluid'>
           <BookingDetailModal currentStatus={currentStatus} selectedHistory={selectedHistory} places={places} closeModal={closeModal} show={showModal}/>
           <div className='row'>
                <div className='col-sm-5'>
                <div className='history'>
                    <div className='history-header'>
                        <p>Bookings</p>
                        <div className='filters'>
                            <h6>Filters</h6>
                            <img src={Filters} alt="filter" width="20px" height="20px"/>
                        </div>
                    </div>
                    <div className='history-content'>
                        {
                            historyData.map((data,key)=>{
                                return(
                                    <div className={ selectedId === key ? 'history-content__wrapper control-body selected' : 'history-content__wrapper control-body'} onClick={()=>setHistory(key)} key={key}>
                                        <div className='pickup'>
                                            <div className='title'>Pickup:</div>
                                            <p>{data.pickup_location}</p>
                                        </div>                            
                                        <div className='stop'>
                                            <div className='stop-location'>
                                                <div className='title'>Dropoff:</div>
                                                <p>{data.dropoff_location}</p>
                                            </div>
                                        </div>
                                        <div className='date-time-info'>
                                            <div className='date'>
                                                <img src="/images/calendar.svg" alt="calendar" width="20px" height="20px"/>
                                                {/* <h6>{data.pickup_date ? data.pickup_date.substring(0,10):''}</h6> */}
                                                <h6>{data.pickup_date ? formatDate(data.pickup_date):''}</h6>
                                            </div>
                                            <div className='time'>
                                                <img src="/images/clock.svg" alt="clock" width="20px" height="20px"/>
                                                <h6>{data.pickup_time ? Convert12hourformat(data.pickup_time) : ''}</h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>  
</div>
                  <div className='col-sm-7'>
                    <div className='mt30'>
                    <div className="main w-100">
                    <div className='main-location-map'>
                        {places[0] && places[1]?
                        <Map
                            googleMapURL={
                                `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=geometry,drawing,places`
                            }
                            markers={places}
                            loadingElement={<div style={{height: `100%`}}/>}
                            containerElement={ <div style={{height: "450px",width:'100%'}}/>}
                            mapElement={ <div style={{height: `100%`}}/>}
                            defaultZoom={ 11}
                        />:''}
                    </div>            
                        <div className='main-wrap payment-board'>
                            <div className='journey-vehicle'>
                                {selectedHistory && selectedHistory.vehicles[0]?
                                <div className='journey'>
                                    <div className='header-wrap d-flex justify-content-between'>
                                        <div className='header-text'>Journey</div>
                                        <div className='date-time-wrapper'>
                                            <div className='date'>
                                                    <img src="/images/calendar.svg" alt="calendar" width="20px" height="20px"/>
                                                {/* <h6>{selectedHistory.pickup_date?selectedHistory.pickup_date.substring(0,10):''}</h6> */}
                                                <h6>{selectedHistory.pickup_date?formatDate(selectedHistory.pickup_date):''}</h6>                                                
                                            </div>
                                            <div className='time'>
                                                <img src="/images/clock.svg" alt="clock" width="20px" height="20px"/>
                                                <h6>{selectedHistory.pickup_time ? Convert12hourformat(selectedHistory.pickup_time) : ''}</h6>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='reservationNumber'>
                                        <label>Reservation Number</label>
                                        <p>{selectedHistory.id}</p>
                                    </div>

                                    <div className='pickup-wrapper'>
                                        <div className='pickup'>
                                            <label className='title'>Pickup:</label>
                                            <p>{selectedHistory.pickup_location}</p>
                                        </div>
                                    </div>
                                    
                                    {selectedHistory.stops ? selectedHistory.stops.map((val,key)=>{
                                        return(
                                        <div className='pickup-wrapper'>
                                        <div className='stop align-items-center justify-content-between' key={key}>
                                             <div className='stop-location w-100'>
                                                <label className='title'>Stop{key+1}:</label>
                                                <p>{val.address}</p>
                                            </div>
                                        </div>
                                        </div>)  
                                    }):''}     
                                    <div className='pickup-wrapper'>                                                    
                                        <div className='dropoff'>
                                            <label className='title'>Dropoff:</label>
                                            <p>{selectedHistory.dropoff_location}</p>                                
                                        </div>
                                    </div>
                                    <div className='passenger-board'>
                                    <div className='passenger'>
                                        <div className='label'>Passenger</div>
                                        <div className='count'>{selectedHistory.passenger}</div>
                                    </div>
                                    <div className='childrens'>
                                        <div className='label'>Childrens</div>
                                        <div className='count'>{selectedHistory.children}</div>
                                    </div>
                                    <div className='bags'>
                                        <div className='label'>Bags</div>
                                        <div className='count'>{selectedHistory.bags}</div>
                                    </div>
                                </div>
                                    <div className='vehicle'>
                                        <div className='label'>Vehicle</div>
                                        <div className='name'>{selectedHistory.vehicles[0].name}</div>
                                    </div>
                                    <Row>
                                        <Col md={6}>
                                            <div className='vehicle'>
                                                <div className='label'>Passenger Name</div>
                                                <div className='name'>{selectedHistory.passenger_infos[0].first_name ? selectedHistory.passenger_infos[0].first_name+' '+selectedHistory.passenger_infos[0].last_name:''}</div>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className='vehicle'>
                                                <div className='label'>Mobile Number</div>
                                                <div className='name'>{selectedHistory.passenger_infos[0].mobile_phone}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <div className='vehicle'>
                                                <div className='label'>Payment Option</div>
                                                <div className='name'>{selectedHistory?.payment_details && selectedHistory?.payment_details.length > 0 && selectedHistory?.payment_details[0]?.payment_method_id === 1 ? 'Cash':'credit card'}</div>
                                            </div>
                                        </Col>
                                        { selectedHistory?.payment_details && selectedHistory?.payment_details.length > 0 && selectedHistory?.payment_details[0]?.card_number?
                                            <Col md={6}>
                                            <div className='vehicle'>
                                                <div className='label'>card number</div>
                                                <div className='name'>{selectedHistory?.payment_details && selectedHistory?.payment_details.length > 0 && selectedHistory?.payment_details[0]?.card_number.replace(reg,"*")}</div>
                                            </div>
                                        </Col> : ''    
                                        }
                                        
                                    </Row>
                                    <div className='dash-line'>
                                        <img src="/images/Line 109.png" width="100%" alt='dashed line'/>
                                    </div>
                                    <div className='estimated-fair'>
                                        <div className='label'>Estimated Fair</div>
                                        <div className='cost'>USD ${selectedHistory.vehicles && selectedHistory.vehicles.length > 0 && selectedHistory.vehicles[0].rate}</div>
                                    </div>
                                </div>:''}
                            </div>
                            {selectedHistory && selectedHistory.vehicles[0]?
                            <div className='passenger-control-btn'>                                
                                <div className='passenger-control'>
                                    <div className='header-text Header-Postion'>
                                      <div>  Rider Status</div>  
                                      <div> <button className="btn-fill Cancel-Ride-Btn" onClick={cancelRide}>
                                            Cancel Ride 
                                        </button></div>                                   
                                    </div>
                                        <RiderStatusPanel currentStatus = {currentStatus}></RiderStatusPanel>
                                        <button className="btn-fill" onClick={handleDownloadWayBill}>
                                            Download WayBill 
                                        </button>
                                </div>                                                                
                            </div>:""}
                        </div> 
                </div>
                        </div>
               
</div>
            </div>
            </div>
        : 
        <div className='empty-booking-history'>
        <h1>You don't have any bookings yet.</h1>
        <Link to="/">Please book a ride now</Link>
        </div>
        }

            <Modal className="confirm-modal modal" show={showCancelRideModel} dialogClassName="modal-100w" centered>
                <Modal.Header>
                    <Modal.Title>Cancel the ride</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <h6>
                            Are you sure!
                            <br />
                            Do you wan to Cancel this Ride?
                        </h6>
                        <div className='btns modal-buttons'>
                            <h6 className='update' onClick={closeCancelRidePopup}>No, Go Back</h6>
                            <h6 className='delete mb-0' style={{ marginLeft: "10px" }} onClick={handleCancelRide}>Yes, Cancel </h6>
                        </div>
                    </>
                </Modal.Body>
            </Modal>

       </div>
    )    
};

export { History };