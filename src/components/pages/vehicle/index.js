import React, {useEffect, useState} from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import {     
    Container,Row,Col   
} from 'react-bootstrap';

import { Header } from '../../layout/header';
import Filters from '../../../images/filters.svg';
import Profile_user from '../../../images/profile-user.svg';
import Shopping_bag from '../../../images/shopping-bag.svg';
import './vehicle.scss';
import { useDispatch, useSelector } from 'react-redux'
import  {select_vehicle}  from '../../../redux/actions/VehiclestateActions';
import axios from 'axios';
import  {save_booking}  from '../../../redux/actions/BookingstateActions';
import Status_board from '../../layout/Status_board';
import { useNavigate } from 'react-router-dom';
import moment from "moment";
const Vehicles = () => {    
    let navigate = useNavigate();
    const location = useLocation();
    const temp = useSelector(state => state.bookingState.temp_booking);
    if(!temp || !temp.pickup_date) {
        console.log(temp);
        window.location.href = window.location.origin+"/home";
    }

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



   // const [startDate, setStartDate] = useState(temp.pickup_date?.format("ddd, MMM DD, YYYY"));
    const [startDate, setStartDate] = useState( getStartDate(temp.pickup_date));
 //   const [startDate, setStartDate] = useState( new Date() );
    const [time, setTime] = useState(temp.pickup_time)
    const [selectFilterOption, setSelectFilterOption] = useState(null);
    const [selectedSortOption, setSelectedSortOption] = useState(null);
    const [selectedCar, setSelectedCar] = useState(temp.vehicle);
    const [filtershow,setFilterShow] =  useState(false);
    const [selectedOption,setSelectedOption] = useState(temp.pick_location);
    const [dropoff,setDropoff] =useState(temp.dropoff_location);
    const [passenger,setPassenger] = useState( temp.passenger? temp.passenger:0);
    const [children,setChildren] = useState(temp.children?temp.children:0);
    const [bag,setBag] = useState(temp.bags? temp.bags:0);
    const [stop,setStop]=useState(temp.stop?temp.stop:[]);
    const dispatch = useDispatch();
    const [carNames,setCarNames] = useState([]);
    const sort_options = [
        {value:0,label:'DES'},
        {value:1,label:'ASC'}
    ]

 




    const vehicle_data = useSelector(state => state.vehicleState.vehicle);
    const [vehicles,setVehicles] = useState([])
    const appy_sort = (vehicle_data) => {
        let temp = [];
        if (!selectFilterOption)
            temp = vehicle_data;
        else if (selectFilterOption.label === "all")
            temp = vehicle_data;
        else
            temp = vehicle_data.filter((val)=>val.name === selectFilterOption.label);
        temp.sort()
        if (!selectedSortOption)
            temp.reverse()
        setVehicles(temp)
    }
    useEffect(()=>{
        
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicle/get`)
        .then((res)=>{
            
            dispatch(select_vehicle(res.data));
            setVehicles(res.data);
            let temp_array=[{value:'all',label:'all'}];
                res.data.map((val)=>{
                    const name_check = vehicel_name_check(temp_array,val)
                    if (name_check)
                        temp_array.push({value:val.name, label:val.name});
                })

                setCarNames(temp_array)
        })

    },[])
    const vehicel_name_check = (a,b) => {
        let count= 0;
        for (let i = 0; i < a.length; i++)
            if (a[i].label == b.name)
                count++;
        if (count)
            return false;
        else
            return true;
    }
    const getTimeString = (time) => {
        var date = moment(time, 'hh:mm A');
        var timeStringFormatted = date.format('HH:mm A'); // 'HH:mm' displays hours in 24-hour format, 'hh:mm' for 12-hour format
        return timeStringFormatted;
    }
    useEffect(()=>{

            if (temp.pickup_location){
                setCarNames(temp);
                setSelectedOption(temp.pickup_location);
                setDropoff(temp.dropoff_location);
                setPassenger( temp.passenger);
                setChildren(temp.children);
                setBag(temp.bags);
                setStop(temp.stop);
                setSelectedCar(temp.vehicle)
            }
    },[])

    const [ vehiclekey, setKey ] = useState(temp.selectedCarIndex);
    const clickPayment=((tm)=>{
        if (selectedCar && selectedCar.id)
            {
                tm.vehicle_id = selectedCar.id
                dispatch(save_booking({...tm, vehicle : selectedCar,selectedCarIndex:vehiclekey, selectedCar,vehicle_id:selectedCar.id}));
                navigate('/payment')
            }
    })
    return (
       <div className='client-vehicle'>
           <Header />
            <div className="main">            
                <Container>
                   {location.pathname == "/vehicles"?<Status_board/>:''} 
                    <div className='main-wrap vehicle-wrap'>
                        <div className='vehicles'>
                            <div className='header-wrap'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='wrap-title'>{location.pathname == "/vehicles"?"Vehicles":"Price Quote"}</div>
                                    <div className='filters' onClick={()=>filtershow?setFilterShow(false):setFilterShow(true)}>Filters
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
                                    <button type="button" className='apply' onClick={()=>appy_sort(vehicle_data)}>Apply</button>
                                </div>:''}                                
                            </div>
                            { vehicles.map((val, key)=>{
                                return(
                                <div className={ key == vehiclekey ? 'active vehicle-information':'vehicle-information'} key={key} onClick={()=>{setSelectedCar(val);setKey(key);}}>
                                    <div style={{width:'178px', height: '120px'}}>
                                        {
                                            val.imgurls[0] ? <img
                                            src={`${
                                              val.imgurls[0].name.includes("amazonaws.com")
                                                ? val.imgurls[0].name
                                                : process.env.REACT_APP_IMAGE_BASE_URL + val.imgurls[0].name
                                            }`}
                                            alt="vehicle1"
                                           className='p-2'
                                          style={{width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'}}
                                            height="120px"
                                          />
                                          :''
                                        }
                                    </div>
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
                        <div className='journey-vehicle control-body'>
                            <div className='journey'>
                                <div className='header-wrap d-flex justify-content-between'>
                                    <label className='header-text'>Journey</label>
                                    <div className='date-time-wrapper'>
                                        <div className='date'>
                                            <img src="/images/calendar.svg" alt="calender" width="18px" height="18px"/>
                                            <p style={{fontSize:'1vw'}}>{startDate}</p>
                                        </div>
                                        <div className='time'>
                                            <img src="/images/clock.svg" alt="clock" width="18px" height="18px"/>
                                            <p style={{fontSize:'16px'}}>{getTimeString(time)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className = 'journey-information'>
                                    <div className='pickup-wrapper'>
                                    <div className='pickup'>
                                        <div className='title picTitle'>Pickup:</div>
                                        <p>{selectedOption}</p>
                                    </div>
                                    </div> 
                                        {stop.map((val,index)=>{
                                            return(
                                                <div className='pickup-wrapper'>
                                                    <div className='stop'>
                                                        <div className='stop-location w-100'>
                                                            <div className='title'>Stop{index+1}:</div>
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
                                        <div className='label'>Passengers:</div>
                                        <div className='count'>{passenger}</div>
                                    </div>
                                    <div className='childrens'>
                                        <div className='label'>Childrens:</div>
                                        <div className='count'>{children}</div>
                                    </div>
                                    <div className='bags'>
                                        <div className='label'>Bags:</div>
                                        <div className='count'>{bag}</div>
                                    </div>
                                </div>
                                <div className='vehicle'>
                                    <div className='label'>Vehicle</div>
                                    <div className='name'>{selectedCar?selectedCar.name:''}</div>
                                </div>
                                
                                <div className='dash-line'>
                                    <img src="/images/Line 109.png" width="100%" alt='dashed line'/>
                                </div>
                                <div className='estimated-fair'>
                                    
                                    <div className='label' >Estimated Fair</div>
                                    <div className='cost'>USD ${selectedCar?selectedCar.rate:''}</div>
                                </div>
                            </div>
                            <div className='btns'>
                                <div className='button-group'>
                                <div className="back"><Link to='/home'>Go Back</Link></div>
                                <div className="back"><Link to='/vehicles'>Cancel</Link></div>
                                </div>
                                <div className="payment" onClick={()=>clickPayment(temp)}><span>Create Reservation</span></div>                        
                            </div>
                        </div>
                    </div>                                     
                </Container>    
            </div>
       </div>
    )    
};

export { Vehicles };