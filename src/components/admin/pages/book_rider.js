import React, {useState} from 'react';
import {
    Row,
    Col,
    Tabs,
    Tab,
    Nav
} from 'react-bootstrap';
import axios from 'axios';

import './dashboard.scss';
import './book_rider.scss';
import { Link} from 'react-router-dom';
import Sidebar from './sidebar';
import Randomstring from "randomstring";
import Trash from '../../../images/trash.png';
import Toggle from 'react-toggle';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import DriverModal from '../modal/driver_modal'
import LocationCheck from '../../../images/location-check.png';
import { useDispatch, useSelector } from 'react-redux'
import { fetchdrivers } from '../../../redux/actions/UserstateActions';
import UserIcon from '../components/userIcon'
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer'
import { useTranslation } from 'react-i18next'
const BookRider = () => {        
    const [key, setKey] = useState('airport');
    const dispatch = useDispatch();
    const [modalshow, setModalshow] = useState(false);
    const [modaltitle, setModaltitle] = useState("add new driver");
    const handleModalClose = () => setModalshow(false);
    const handleModalShow = () => {setModalshow(true);setModaltitle('add new driver');}    
    const [ pickupLocation , setPickupLocation ] = useState()
    const [ dropoffLocaiton, setDropoffLocation] = useState()
    const [ stopoff, setStopoff ] = useState()
    const [stopNum, setStopNum] = useState([{ id: Randomstring.generate(10) }]);
    const [ methodkey,setMethodKey]= useState(1)
    const [modalButtonName, setModalButtonName]= useState()
    const deleteStop = (id) => {
        const filter = stopNum.filter(item => item.id !== id)
        setStopNum(filter);
    }
    const addStop = () => {
        setStopNum([...stopNum, { id: Randomstring.generate(10) }]);
    }
    const switch_onChange_handle = () => {
        setIsSwitchOn(!isSwitchOn);
    };
    const { t } = useTranslation(); 
    const [ modalData, setModalData ] = useState()
    const [isSwitchOn, setIsSwitchOn] = useState();
    const [passenger, setPassenger] = useState(0);
    const [bags, setBags] =  useState(0);
    const [children, setChildren] = useState(0);
    const [ hours,setHours] = useState();
    const [ mins, setMins] =  useState();
    const [errors,setErrors]= useState([])
    const getDrivers = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/driver/get`)
        .then((res)=>{
            dispatch(fetchdrivers(res.data));
            
        })
    }
    const openDriverModal = () => {
        setModalButtonName('add driver')
        handleModalShow();
    }
    return (
        <div className='dashboard'>
            <Sidebar/>
            <div className='content book_rider'>
                <div className='content-panel'>
                    <div className='content-panel__heading'>
                        <div className='caption'>
                            <h5>Book a ride</h5>
                            <DynamicTimer/>
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
                                       <BellPic/>
                                  </div>
                            </div>
                            
                            <UserIcon></UserIcon>
                        </div>
                    </div>
                    <div className='content-panel__content'>
                        <Row>
                            <Col md={7}>
                                <div className='card book_rider'>
                                    <div className='card-body'>
                                        <div className='card-body__content'>
                                            {/* <div className='control-btns'>
                                                <Nav defaultActiveKey="/#" as="div">
                                                        <h5 className={methodkey === 1 ? 'nav-link active':'nav-link'} onClick={()=>{setMethodKey(1)}}><img src={methodkey === 1 ? "/images/mark/location.png" : "/images/mark/black_location.png"} width="14px" height="14px"></img>{t('Transfer')}</h5>                                              
                                                        <h5 className={methodkey === 2 ? 'nav-link active':'nav-link'} onClick={()=>{setMethodKey(2)}}><img src={methodkey === 2 ? "/images/mark/clock.png" : "/images/mark/black_clock.png"} width="14px" height="14px"></img>{t('Hourly')}</h5>
                                                </Nav>
                                            </div> */}
                                            <Tabs
                                                id="controlled-tab-example"
                                                activeKey={key}
                                                onSelect={(k) => setKey(k)}
                                                >
                                                <Tab eventKey="airport" title="Airport">
                                                    <div className='input-wrapper pickup'>
                                                        <h5>Pickup:</h5>
                                                        <GooglePlacesAutocomplete
                                                            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                            selectProps={{
                                                            isClearable: true,
                                                            value: pickupLocation,
                                                            placeholder:'Enter location',
                                                            onChange: (val) => {
                                                                setPickupLocation(val);
                                                            }
                                                            }}
                                                        /> 
                                                        <img src={LocationCheck} alt="location-check" width="24px" height="24px" />               
                                                    </div>
                                                    {stopNum.map((item, index) => (
                                                        <div style={{display:'flex',alignItems:'center',paddingRight:'10px'}}>
                                                            <div className='input-wrapper stop pickup'>
                                                                <h5>Stop{index+1}:</h5>
                                                                <GooglePlacesAutocomplete
                                                                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                                    selectProps={{
                                                                    isClearable: true,
                                                                    value: stopoff,
                                                                    outline:'0px',
                                                                    placeholder:'Enter location',
                                                                    onChange: (val) => {
                                                                        setPickupLocation(val);
                                                                    }
                                                                    }}
                                                                />
                                                                <img src={LocationCheck} alt="location-check" width="24px" height="24px"/>
                                                            </div>
                                                            <div className='trash MarginTop' onClick={() => deleteStop(item.id)}><img src={Trash} alt="trash" width="24px" height="24px"/></div>                 
                                                        </div>
                                                    ))}
                                                    
                                                    <div className='input-wrapper dropoff'>
                                                        <h5>Dropoff:</h5>
                                                        <GooglePlacesAutocomplete
                                                            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                            selectProps={{
                                                            isClearable: true,
                                                            value: dropoffLocaiton,
                                                            placeholder:'Enter location',
                                                            onChange: (val) => {
                                                                setDropoffLocation(val);
                                                            }
                                                            }}
                                                        /> 
                                                        <img src={LocationCheck} alt="location-check" width="24px" height="24px"/>                
                                                    </div>
                                                    {methodkey === 2 ?
                                                        <div className="hour-min-input">
                                                            <div className='hour-input'>
                                                                <div className='hour-input__wrapper'>
                                                                    <label className='title'>* Trip Duration Hours:</label>
                                                                    <input type="number" value={hours} onChange = {(e)=>e.target.value >= 0 ||  '' ? setHours(e.target.value) : setHours(0)}/>
                                                                </div>
                                                                <button  className='minus' onClick={()=>{ parseInt(hours) > 0 ? setHours(hours-1):setHours(0)}}><i className='fa fa-minus'></i></button>
                                                                <button className="plus" onClick={()=>{setHours(hours+1)}}><i className='fa fa-plus'></i></button>
                                                                <span className="text-danger">{errors.hours}</span>
                                                            </div>
                                                            
                                                            <div className='hour-input'>
                                                                <div className='hour-input__wrapper'>
                                                                    <label className='title'>* Trip Duration Mins:</label>
                                                                    <input type="number" value={mins} onChange = {(e)=>e.target.value >= 0 ||  '' ? setMins(e.target.value) : setMins(0)}/>
                                                                </div>
                                                                <button className='minus' onClick={()=>{ parseInt(mins) > 0 ? setMins(mins-1):setMins(0)}}><i className='fa fa-minus'></i></button>
                                                                <button className="plus" onClick={()=>{setMins(mins+1)}}><i className='fa fa-plus'></i></button>
                                                                <span className="text-danger">{errors.mins}</span>
                                                            </div>
                                                        </div>
                                                    : ""}
                                                    <div className='ride-now'>
                                                        <div className='button'>
                                                            <p>RIDE NOW</p>
                                                            <Toggle
                                                                defaultChecked={isSwitchOn}
                                                                icons={false}
                                                                onChange={() => switch_onChange_handle()}
                                                            />
                                                        </div>
                                                        <div className='add-stop'  onClick={() => addStop()}>
                                                            <i className='fa fa-plus'></i>
                                                            <p>add stop</p>
                                                        </div>
                                                    </div>
                                                    {!isSwitchOn?
                                                    <div className="date-time-wrapper">
                                                        <div className='input-wrapper'>
                                                            <h5>Pickup date:</h5>
                                                            <input type="date" placeholder='05/08/2022'></input>                 
                                                        </div>
                                                        <div className='input-wrapper time'>
                                                            <h5>Pickup time:</h5>
                                                            <input type="time" placeholder='05/08/2022'></input>                 
                                                        </div>
                                                    </div>:''}
                                                </Tab>
                                                <Tab eventKey="around_town" title="Around town">
                                                <div className='input-wrapper pickup'>
                                                        <h5>Pickup:</h5>
                                                        <GooglePlacesAutocomplete
                                                            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                            selectProps={{
                                                            isClearable: true,
                                                            value: pickupLocation,
                                                            placeholder:'Enter location',
                                                            onChange: (val) => {
                                                                setPickupLocation(val);
                                                            }
                                                            }}
                                                        /> 
                                                        <img src={LocationCheck} alt="location-check" width="24px" height="24px" />               
                                                    </div>
                                                    {stopNum.map((item, index) => (
                                                        <div style={{display:'flex',alignItems:'center',paddingRight:'10px'}}>
                                                            <div className='input-wrapper stop pickup'>
                                                                <h5>Stop{index+1}:</h5>
                                                                <GooglePlacesAutocomplete
                                                                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                                    selectProps={{
                                                                    isClearable: true,
                                                                    value: stopoff,
                                                                    outline:'0px',
                                                                    placeholder:'Enter location',
                                                                    onChange: (val) => {
                                                                        setPickupLocation(val);
                                                                    }
                                                                    }}
                                                                />
                                                                <img src={LocationCheck} alt="location-check" width="24px" height="24px"/>
                                                            </div>
                                                            <div className='trash' onClick={() => deleteStop(item.id)}><img src={Trash} alt="trash" width="24px" height="24px"/></div>                 
                                                        </div>
                                                    ))}
                                                    
                                                    <div className='input-wrapper dropoff'>
                                                        <h5>Dropoff:</h5>
                                                        <GooglePlacesAutocomplete
                                                            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                            selectProps={{
                                                            isClearable: true,
                                                            value: dropoffLocaiton,
                                                            placeholder:'Enter location',
                                                            onChange: (val) => {
                                                                setDropoffLocation(val);
                                                            }
                                                            }}
                                                        /> 
                                                        <img src={LocationCheck} alt="location-check" width="24px" height="24px"/>                
                                                    </div>
            
                                                    <div className='ride-now'>
                                                        <div className='button'>
                                                            <p>RIDE NOW</p>
                                                            <Toggle
                                                                defaultChecked={isSwitchOn}
                                                                icons={false}
                                                                onChange={() => switch_onChange_handle()}
                                                            />
                                                        </div>
                                                        <div className='add-stop'  onClick={() => addStop()}>
                                                            <i className='fa fa-plus'></i>
                                                            <p>add stop</p>
                                                        </div>
                                                    </div>
                                                    {!isSwitchOn?
                                                    <div className="date-time-wrapper">
                                                        <div className='input-wrapper'>
                                                            <h5>Pickup date:</h5>
                                                            <input type="date" placeholder='05/08/2022'></input>                 
                                                        </div>
                                                        <div className='input-wrapper time'>
                                                            <h5>Pickup time:</h5>
                                                            <input type="time" placeholder='05/08/2022'></input>                 
                                                        </div>
                                                    </div>:''}
                                                </Tab>
                                                <Tab eventKey="hourly" title="Hourly">
                                                <div className='input-wrapper pickup'>
                                                        <h5>Pickup:</h5>
                                                        <GooglePlacesAutocomplete
                                                            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                            selectProps={{
                                                            isClearable: true,
                                                            value: pickupLocation,
                                                            placeholder:'Enter location',
                                                            onChange: (val) => {
                                                                setPickupLocation(val);
                                                            }
                                                            }}
                                                        /> 
                                                        <img src={LocationCheck} alt="location-check" width="24px" height="24px" />               
                                                    </div>
                                                    {stopNum.map((item, index) => (
                                                        <div style={{display:'flex',alignItems:'center',paddingRight:'10px'}}>
                                                            <div className='input-wrapper stop pickup'>
                                                                <h5>Stop{index+1}:</h5>
                                                                <GooglePlacesAutocomplete
                                                                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                                    selectProps={{
                                                                    isClearable: true,
                                                                    value: stopoff,
                                                                    outline:'0px',
                                                                    placeholder:'Enter location',
                                                                    onChange: (val) => {
                                                                        setPickupLocation(val);
                                                                    }
                                                                    }}
                                                                />
                                                                <img src={LocationCheck} alt="location-check" width="24px" height="24px"/>
                                                            </div>
                                                            <div className='trash' onClick={() => deleteStop(item.id)}><img src={Trash} alt="trash" width="24px" height="24px"/></div>                 
                                                        </div>
                                                    ))}
                                                    
                                                    <div className='input-wrapper dropoff'>
                                                        <h5>Dropoff:</h5>
                                                        <GooglePlacesAutocomplete
                                                            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                                                            selectProps={{
                                                            isClearable: true,
                                                            value: dropoffLocaiton,
                                                            placeholder:'Enter location',
                                                            onChange: (val) => {
                                                                setDropoffLocation(val);
                                                            }
                                                            }}
                                                        /> 
                                                        <img src={LocationCheck} alt="location-check" width="24px" height="24px"/>                
                                                    </div>
                                                    <div className='ride-now'>
                                                        <div className='button'>
                                                            <p>RIDE NOW</p>
                                                            <Toggle
                                                                defaultChecked={isSwitchOn}
                                                                icons={false}
                                                                onChange={() => switch_onChange_handle()}
                                                            />
                                                        </div>
                                                        <div className='add-stop'  onClick={() => addStop()}>
                                                            <i className='fa fa-plus'></i>
                                                            <p>add stop</p>
                                                        </div>
                                                    </div>
                                                    <div className="hour-min-input">
                                                        <div className="hours-wrapper">
                                                        <label className='title'>Trip Duration Hours:</label>
                                                            <div className='hour-input'>
                                                                <div className='hour-input__wrapper'>
                                                                    
                                                                    <input type="number" value={hours} onChange = {(e)=>e.target.value >= 0 ||  '' ? setHours(e.target.value) : setHours(0)}/>
                                                                </div>
                                                                <button  className='minus' onClick={()=>{ parseInt(hours) > 0 ? setHours(hours-1):setHours(0)}}><i className='fa fa-minus'></i></button>
                                                                <button className="plus" onClick={()=>{setHours(hours+1)}}><i className='fa fa-plus'></i></button>
                                                                <span className="text-danger">{errors.hours}</span>
                                                            </div>
                                                            </div>
                                                            <div className="hours-wrapper">
                                                            <label className='title'>Trip Duration Mins:</label>
                                                            <div className='hour-input'>
                                                                <div className='hour-input__wrapper'>
                                                                    <input type="number" value={mins} onChange = {(e)=>e.target.value >= 0 ||  '' ? setMins(e.target.value) : setMins(0)}/>
                                                                </div>
                                                                <button className='minus' onClick={()=>{ parseInt(mins) > 0 ? setMins(mins-1):setMins(0)}}><i className='fa fa-minus'></i></button>
                                                                <button className="plus" onClick={()=>{setMins(mins+1)}}><i className='fa fa-plus'></i></button>
                                                                <span className="text-danger">{errors.mins}</span>
                                                            </div>
                                                            </div>
                                                        </div>
                                                    {!isSwitchOn?
                                                    <div className="date-time-wrapper">
                                                        <div className='input-wrapper'>
                                                            <h5>Pickup date:</h5>
                                                            <input type="date" placeholder='05/08/2022'></input>                 
                                                        </div>
                                                        <div className='input-wrapper time'>
                                                            <h5>Pickup time:</h5>
                                                            <input type="time" placeholder='05/08/2022'></input>                 
                                                        </div>
                                                    </div>:''}
                                                </Tab>
                                                
                                                
                                            </Tabs>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={5}>
                                <div className='card select-vehicle'>
                                    <div className='card-body'>
                                        <div className='card-body__content'>
                                            <h5>Passengers</h5>
                                            <div className='input-wrapper'>
                                                <input value={passenger} onChange={(e)=>setPassenger(e.target.value)}>
                                                </input>
                                                <div className='button-group'>
                                                    <i className='fa fa-minus' onClick={()=>{passenger>0? setPassenger(passenger-1):setPassenger(0)}}></i>
                                                    <i className='fa fa-plus' onClick={()=>{ setPassenger(Number(passenger)+1)}}></i>
                                                </div>
                                                
                                            </div>
                                            <h5>Childrens</h5>
                                            <div className='input-wrapper'>
                                                <input value={children} onChange={(e)=>setChildren(e.target.value)}>
                                                </input>
                                                <div className='button-group'>
                                                    <i className='fa fa-minus' onClick={()=>{children>0? setChildren(children-1):setChildren(0)}}></i>
                                                    <i className='fa fa-plus' onClick={()=>{setChildren(Number(children)+1)}}></i>
                                                </div>
                                            </div>
                                            <h5>Bags</h5>
                                            <div className='input-wrapper'>
                                                <input value={bags} onChange={(e)=>setBags(e.target.value)}>
                                                </input>
                                                <div className='button-group'>
                                                    <i className='fa fa-minus' onClick={()=>{bags>0? setBags(bags-1):setBags(0)}}></i>
                                                    <i className='fa fa-plus' onClick={()=>{setBags(Number(bags)+1)}}></i>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div>
                                <h6 className='update' style={{marginTop:'40px', width: '100%'}}>Select Vehicle</h6>
                                </div>
                            </Col>
                            
                        </Row>
                    </div>
                </div>
            </div>
            <DriverModal modalshow={modalshow} val={modalData}  getDrivers={getDrivers} handleModalClose={handleModalClose} modaltitle={modaltitle}></DriverModal>
        </div>
    )    
};

export { BookRider };