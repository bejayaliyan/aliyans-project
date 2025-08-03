import {
    Modal,Container,Row, Col
} from 'react-bootstrap';
import Map from './Map';
import {RiderStatusPanel} from './riderStatus'; 
import './bookingDetailModal.scss';
const BookingDetailModal = (props) => {
    const reg = /\d(?=\d{4})/mg 
    const googleMapsApiKey = "";
    return (
        <Modal className="booking-detail-modal lg modal" show={props.show} dialogClassName="modal-100w" onHide={props.onHide} centered>
            <Modal.Header>
                <Modal.Title>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    <div className="main">
                        {/* <div className='main-location-map'>
                            {props.places[0] && props.places[1] ?
                                <Map
                                    googleMapURL={
                                        'https://maps.googleapis.com/maps/api/js?key=' +
                                        googleMapsApiKey +
                                        '&libraries=geometry,drawing,places'
                                    }
                                    markers={props.places}
                                    loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<div style={{ height: "450px", width: '100%' }} />}
                                    mapElement={<div style={{ height: `100%` }} />}
                                    defaultZoom={11}
                                /> : ''}
                        </div> */}
                        <div className='main-wrap payment-board'>
                            <div className='journey-vehicle'>
                                {props.selectedHistory && props.selectedHistory.vehicles[0] ?
                                    <div className='journey'>
                                        <div className='header-wrap d-flex justify-content-between'>
                                            <div className='header-text'>Journey</div>
                                            <div className='date-time-wrapper'>
                                                <div className='date'>
                                                    <img src="/images/calendar.svg" alt="calendar" width="20px" height="20px" />
                                                    <h6>{props.selectedHistory.pickup_date ? props.selectedHistory.pickup_date.substring(0, 10) : ''}</h6>
                                                </div>
                                                <div className='time'>
                                                    <img src="/images/clock.svg" alt="clock" width="20px" height="20px" />
                                                    <h6>{props.selectedHistory.pickup_time}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='pickup-wrapper'>
                                            <div className='pickup'>
                                                <label className='title'>Pickup:</label>
                                                <p>{props.selectedHistory.pickup_location}</p>
                                            </div>
                                        </div>

                                        {props.selectedHistory.stops ? props.selectedHistory.stops.map((val, key) => {
                                            return (
                                                <div className='pickup-wrapper'>
                                                    <div className='stop align-items-center justify-content-between' key={key}>
                                                        <div className='stop-location w-100'>
                                                            <label className='title'>Stop{key + 1}:</label>
                                                            <p>{val.address}</p>
                                                        </div>
                                                    </div>
                                                </div>)
                                        }) : ''}
                                        <div className='pickup-wrapper'>
                                            <div className='dropoff'>
                                                <label className='title'>Dropoff:</label>
                                                <p>{props.selectedHistory.dropoff_location}</p>
                                            </div>
                                        </div>
                                        <div className='passenger-board'>
                                            <div className='passenger'>
                                                <div className='label'>Passenger</div>
                                                <div className='count'>{props.selectedHistory.passenger}</div>
                                            </div>
                                            <div className='childrens'>
                                                <div className='label'>Childrens</div>
                                                <div className='count'>{props.selectedHistory.children}</div>
                                            </div>
                                            <div className='bags'>
                                                <div className='label'>Bags</div>
                                                <div className='count'>{props.selectedHistory.bags}</div>
                                            </div>
                                        </div>
                                        <div className='vehicle'>
                                            <div className='label'>Vehicle</div>
                                            <div className='name'>{props.selectedHistory.vehicles[0].name}</div>
                                        </div>
                                        <Row>
                                            <Col md={6}>
                                                <div className='vehicle'>
                                                    <div className='label'>Passenger Name</div>
                                                    <div className='name'>{props.selectedHistory.passenger_infos[0].first_name ? props.selectedHistory.passenger_infos[0].first_name + ' ' + props.selectedHistory.passenger_infos[0].last_name : ''}</div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className='vehicle'>
                                                    <div className='label'>Mobile Number</div>
                                                    <div className='name'>{props.selectedHistory.passenger_infos[0].mobile_phone}</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <div className='vehicle'>
                                                    <div className='label'>Payment Option</div>
                                                    <div className='name'>{props.selectedHistory.payment_details && props.selectedHistory.payment_details.length > 0 && props.selectedHistory.payment_details[0].payment_method_id === 1 ? 'Cash' : 'credit card'}</div>
                                                </div>
                                            </Col>
                                            {props.selectedHistory.payment_details && props.selectedHistory.payment_details.length > 0 && props.selectedHistory.payment_details[0].card_number ?
                                                <Col md={6}>
                                                    <div className='vehicle'>
                                                        <div className='label'>card number</div>
                                                        <div className='name'>{props.selectedHistory.payment_details[0].card_number.replace(reg, "*")}</div>
                                                    </div>
                                                </Col> : ''
                                            }

                                        </Row>
                                        <div className='dash-line'>
                                            <img src="/images/Line 109.png" width="100%" alt='dashed line' />
                                        </div>
                                        <div className='estimated-fair'>
                                            <div className='label'>Estimated Fair</div>
                                            <div className='cost'>USD ${props.selectedHistory.vehicles[0].rate}</div>
                                        </div>
                                    </div> : ''}
                            </div>
                            {props.selectedHistory && props.selectedHistory.vehicles[0] ?
                                <div className='passenger-control-btn'>

                                    <div className='passenger-control'>
                                        <div className='header-text'>Rider Status</div>

                                        <RiderStatusPanel currentStatus={props.currentStatus}></RiderStatusPanel>

                                    </div>
                                </div> : ""}
                        </div>
                    </div>
                    <div className="btn">
                    <button type='button' className='ok' onClick={() => props.closeModal()}>OK</button>
                    </div>
                    
                </>
            </Modal.Body>
        </Modal>
    )
}
export { BookingDetailModal };