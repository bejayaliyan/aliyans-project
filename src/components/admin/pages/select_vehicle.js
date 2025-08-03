import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    Container, Row, Col
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { select_vehicle } from '../../../redux/actions/VehiclestateActions';
import axios from 'axios';
import Filters from '../../../images/filters.png';
import Profile_user from '../../../images/profile-user.png';
import Shopping_bag from '../../../images/shopping-bag.png';
import selected from '../../../images/selected.svg';
import { Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import DriverModal from '../modal/driver_modal'
import UserIcon from '../components/userIcon'
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer';
import { save_booking } from '../../../redux/actions/BookingstateActions';
import Status_board from '../../layout/Status_board';
import { useNavigate } from 'react-router-dom';
import { fetchdrivers } from '../../../redux/actions/UserstateActions';
import './dashboard.scss';
import './select_vehicle.scss';

const SelectVehicle = () => {
    let navigate = useNavigate();
    const temp = useSelector(state => state.bookingState.temp_booking);
    const [startDate, setStartDate] = useState(temp.pickup_date?.format("ddd, MMM DD, YYYY"));
    const [time, setTime] = useState(temp.pickup_time)
    const [modalshow, setModalshow] = useState(false);
    const [selectFilterOption, setSelectFilterOption] = useState(null);
    const [selectedSortOption, setSelectedSortOption] = useState(null);
    const [selectedCar, setSelectedCar] = useState(temp.vehicle);
    const [filtershow, setFilterShow] = useState(false);
    const [ modalData, setModalData ] = useState()
    const [selectedOption, setSelectedOption] = useState(temp.pick_location);
    const [dropoff, setDropoff] = useState(temp.dropoff_location);
    const [passenger, setPassenger] = useState(temp.passenger ? temp.passenger : 3);
    const [children, setChildren] = useState(temp.children ? temp.children : 3);
    const [modaltitle, setModaltitle] = useState("add new driver");
    const [bag, setBag] = useState(temp.bags ? temp.bags : 3);
    const [stop, setStop] = useState(temp.stop ? temp.stop : []);
    const handleModalClose = () => setModalshow(false);
    const handleModalShow = () => {setModalshow(true);setModaltitle('add new driver');}  
    const [modalButtonName, setModalButtonName]= useState()
    const dispatch = useDispatch();
    const [carNames, setCarNames] = useState([]);
    const sort_options = [
        { value: 0, label: 'DES' },
        { value: 1, label: 'ASC' }
    ]
    const vehicle_data = useSelector(state => state.vehicleState.vehicle);
    const [vehicles, setVehicles] = useState([])
    const appy_sort = (vehicle_data) => {
        let temp = [];
        if (!selectFilterOption)
            temp = vehicle_data;
        else if (selectFilterOption.label === "all")
            temp = vehicle_data;
        else
            temp = vehicle_data.filter((val) => val.name === selectFilterOption.label);
        temp.sort()
        if (!selectedSortOption)
            temp.reverse()
        setVehicles(temp)
    }
    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicle/get`)
            .then((res) => {

                dispatch(select_vehicle(res.data));
                setVehicles(res.data);
                let temp_array = [{ value: 'all', label: 'all' }];
                res.data.map((val) => {
                    const name_check = vehicel_name_check(temp_array, val)
                    if (name_check)
                        temp_array.push({ value: val.name, label: val.name });
                })

                setCarNames(temp_array)
            })

    }, [])
    const vehicel_name_check = (a, b) => {
        let count = 0;
        for (let i = 0; i < a.length; i++)
            if (a[i].label == b.name)
                count++;
        if (count)
            return false;
        else
            return true;
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
    useEffect(() => {

        if (temp.pickup_location) {
            setCarNames(temp);
            setSelectedOption(temp.pickup_location);
            setDropoff(temp.dropoff_location);
            setPassenger(temp.passenger);
            setChildren(temp.children);
            setBag(temp.bags);
            setStop(temp.stop);
            setSelectedCar(temp.vehicle)
        }
    }, [])

    const [vehiclekey, setKey] = useState(temp.selectedCarIndex);
    const clickPayment = ((tm) => {
        if (selectedCar && selectedCar.id) {
            tm.vehicle_id = selectedCar.id
            dispatch(save_booking({ ...tm, vehicle: selectedCar, selectedCarIndex: vehiclekey, selectedCar, vehicle_id: selectedCar.id }));
            navigate('/payment')
        }
    })
    const openDriverModal = () => {
        setModalButtonName('add driver')
        handleModalShow();
    }
    const getDrivers = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/driver/get`)
        .then((res)=>{
            dispatch(fetchdrivers(res.data));
            
        })
    }
    return (
        <div className='dashboard select_vehicle'>
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
                                <div className='button' onClick={openDriverModal}>
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
                        <div className='main-wrap vehicle-wrap'>
                            <Row>
                                <Col xs={7}>
                                    <div className='vehicles'>
                                        <div className='header-wrap'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div className='wrap-title'>Vehicles</div>
                                                <div className='filters' onClick={() => filtershow ? setFilterShow(false) : setFilterShow(true)}>Filters
                                                    <img src={Filters} alt="filters" />
                                                </div>
                                            </div>
                                            {filtershow ?
                                                <div className='sort-wrap'>
                                                    <div className='vehicle-type'>
                                                        <label className='title'>Vehicle type:</label>
                                                        <Select
                                                            defaultValue={selectFilterOption}
                                                            onChange={(e) => setSelectFilterOption(e)}
                                                            options={carNames}
                                                            isSearchable="true"
                                                        // className='w-100'
                                                        />
                                                    </div>
                                                    <div className='sort-by'>
                                                        <label className='title'>Sort by:</label>
                                                        <Select
                                                            defaultValue={selectedSortOption}
                                                            onChange={(e) => setSelectedSortOption(e.value)}
                                                            options={sort_options}
                                                            isSearchable="true"
                                                        />
                                                    </div>
                                                    <button type="button" className='apply' onClick={() => appy_sort(vehicle_data)}>Apply</button>
                                                </div> : ''}
                                        </div>
                                        {vehicles.map((val, key) => {
                                            return (
                                                <div className={key == vehiclekey ? 'active vehicle-information' : 'vehicle-information'} key={key} onClick={() => { setSelectedCar(val); setKey(key); }}>
                                                    {val.imgurls[0] ? <img src={`${process.env.REACT_APP_IMAGE_BASE_URL + val.imgurls[0].name}`} alt="vehicle1" width="195px" height="112px" /> : ''}
                                                    <div className='content'>
                                                        <div className='content-wrap-1'>
                                                            <div className='car-name'>{val.name}</div>
                                                            <div className='car-cost'>USD ${val.rate}</div>
                                                        </div>
                                                        <div className='content-wrap-2'>
                                                            <img src={Profile_user} alt="profile user" />
                                                            <button className='user-count'>{val.max_passenger}</button>
                                                            <img src={Shopping_bag} alt="shopping bag" />
                                                            <button className='bag-count'>{val.max_bags}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Col>
                                <Col xs={5}>
                                    <div className='journey-vehicle control-body'>
                                        <div className='journey'>
                                            <div className='header-wrap d-flex justify-content-between'>
                                                <label className='header-text'>Journey</label>
                                                <div className='date-time-wrapper'>
                                                    <div className='date'>
                                                        <img src="/images/calendar.png" alt="calender" width="20px" height="20px" />
                                                        <p style={{ fontSize: '1vw' }}>{startDate}</p>
                                                    </div>
                                                    <div className='time'>
                                                        <img src="/images/clock.png" alt="clock" width="20px" height="20px" />
                                                        <p style={{ fontSize: '1vw' }}>{getTimeString(time)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='journey-information'>
                                                <div className='pickup-wrapper'>
                                                    <div className='pickup'>
                                                        <div className='title'>Pickup:</div>
                                                        <p>{selectedOption}</p>
                                                    </div>
                                                </div>
                                                {stop.map((val, index) => {
                                                    return (
                                                        <div className='pickup-wrapper'>
                                                            <div className='stop'>
                                                                <div className='stop-location w-100'>
                                                                    <div className='title'>Stop{index + 1}:</div>
                                                                    <p>{val}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                <div className='pickup-wrapper'>
                                                    <div className='dropoff'>
                                                        <label className='title'>Dropoff:</label>
                                                        <p>{dropoff}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='passenger-board'>
                                                <div className='passenger'>
                                                    <div className='label'>Passenger</div>
                                                    <div className='count'>{passenger}</div>
                                                </div>
                                                <div className='childrens'>
                                                    <div className='label'>Childrens</div>
                                                    <div className='count'>{children}</div>
                                                </div>
                                                <div className='bags'>
                                                    <div className='label'>Bags</div>
                                                    <div className='count'>{bag}</div>
                                                </div>
                                            </div>
                                            <div className='vehicle'>
                                                <div className='label'>Vehicle</div>
                                                <div className='name'>{selectedCar ? selectedCar.name : ''}</div>
                                            </div>

                                            <div className='dash-line'>
                                                <img src="/images/Line 109.png" width="100%" alt='dashed line' />
                                            </div>
                                            <div className='estimated-fair'>

                                                <div className='label' >Estimated Fair</div>
                                                <div className='cost'>USD ${selectedCar ? selectedCar.rate : ''}</div>
                                            </div>
                                        </div>
                                        <div className='btns'>
                                            <div className="back"><Link to='/home'>Go Back</Link> <Link to='/home'>Cancel</Link></div>
                                            <div className="payment" onClick={() => clickPayment(temp)}><span>Continue to Payment</span></div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <DriverModal modalshow={modalshow} val={modalData}  getDrivers={getDrivers} handleModalClose={handleModalClose} modaltitle={modaltitle}></DriverModal>
        </div>
    )
};

export { SelectVehicle };