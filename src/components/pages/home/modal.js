import {
    Modal,Row,Col,FormControl
} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
export const MyVerticallyCenteredModal = (props) => {
    return (
        <Modal
            show = {props.show}
            onHide = {props.onHide}
            className='location-modal'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <div className='header-wrap'>
                            <div className='title'>
                                Location Correction
                            </div>
                            <div className='description'>
                                <div>Please check and confirm your location,</div>
                                <div>or edit it as per your preference</div>
                            </div>
                            <div className='btns'>
                                <h6 className='update' onClick={()=>props.confirm(props.location)}>Confirm Location</h6>
                                <button type='button' className='edit' onClick={()=>{props.onHide(props.location);props.showeditmodal();}}>Edit Location</button>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='content-wrap'>
                            <div className='input-wrapper street d-flex align-items-center'>
                                <div className='label'>Street:</div>
                                <FormControl
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    defaultValue={props.location.street ? props.location.street:''}
                                    disabled
                                />
                            </div>
                            <div className='input-wrapper city d-flex align-items-center'>
                                <div className='label'>City:</div>
                                <FormControl
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    defaultValue={props.location.city ? props.location.city.short_name : ''}
                                    disabled
                                />
                            </div>
                            <div className='input-wrapper state d-flex align-items-center'>
                                <div className='label'>State:</div>
                                <FormControl
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    defaultValue={props.location.state ? props.location.state.short_name : ''}
                                    disabled
                                />
                            </div>
                            <div className='input-wrapper postalcode d-flex align-items-center'>
                                <div className='label'>Postal Code:</div>
                                <FormControl
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    disabled
                                    defaultValue={props.location.postcode?props.location.postcode.short_name:''}
                                />
                            </div>
                            <div className='input-wrapper country d-flex align-items-center'>
                                <div className='label'>Country:</div>
                                <FormControl
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    defaultValue={props.location.country?props.location.country.short_name:''}
                                    disabled
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}
// useEffect (()=>{
//     //console.log(mapAPi)
//     
// },[mapApi])
export const EditModal = (props) => {
    const [ street, setStreet] = useState();
    const [ city, setCity] = useState();
    const [ postcode,setPostCode]=useState();
    const [ country,setCountry] = useState();
    const [ statename,setStateName]=useState();
    useEffect(()=>{
        setStreet(props.data?.street ? props.data.street:'')
        setCity(props.data?.city ? props.data.city.short_name:'')
        setPostCode(props.data?.postcode? props.data.postcode.short_name:'')
        setCountry(props.data?.country? props.data.country.short_name:'')
        setStateName(props.data?.state ? props.data.state.short_name : '')
    },[props.data])
    const confirm = (()=>{
        let data={};
        data.street= street;
        data.city=city;
        data.postcode = postcode;
        data.country = country;
        data.state = statename;
        
        props.address_return(data);
    })
    return (
        <Modal
            show = {props.show}
            onHide = {props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <div className='header-wrap'>
                            <div className='title'>
                                Edit Location
                            </div>
                            <div className='description'>
                                <h6><span>Full address:</span>{ street + (city ? city + ', ' : '') + (statename ? statename + ', ' : '' ) + (postcode ? postcode + ', ' : '') +  country}</h6>
                            </div>
                            <div className='btns'>
                                <h6 className='update' onClick={()=>confirm()}>Confirm Location</h6>
                                <button type='button' className='edit' onClick={() => props.onHide()}>Cancel</button>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='content-wrap'>
                            <div className='input-wrapper street d-flex align-items-center'>
                                <div className='label'>Street:</div>
                                <input
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={street}
                                    onChange={(e)=>setStreet(e.target.value)}
                                />
                            </div>
                            <div className='input-wrapper city d-flex align-items-center'>
                                <div className='label'>City:</div>
                                <input
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={city}
                                    onChange={(e)=>setCity(e.target.value)}
                                />
                            </div>
                            <div className='input-wrapper state d-flex align-items-center'>
                                <div className='label'>State:</div>
                                <input
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={statename}
                                    onChange={(e)=>setStateName(e.target.value)}
                                />
                            </div>
                            <div className='input-wrapper postalcode d-flex align-items-center'>
                                <div className='label'>Postal Code:</div>
                                <input
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={postcode}
                                    onChange={(e)=>setPostCode(e.target.value)}
                                />
                            </div>
                            <div className='input-wrapper country d-flex align-items-center'>
                                <div className='label'>Country:</div>
                                <input
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={country}
                                    onChange={(e)=>setCountry(e.target.value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}