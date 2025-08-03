import React, {useState,useEffect} from 'react';
import {
    Row,
    Col,
    Form,
} from 'react-bootstrap';
import './dashboard.scss';
import Select from 'react-select'
import { ResponsiveBump } from '@nivo/bump'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import data from './data.js'
import driver_img from "../../../assets/images/Ellipse 212.png"
import driver_data from './driver_data.js';
import { Link} from 'react-router-dom';
import Sidebar from './sidebar';
import { useDispatch, useSelector } from 'react-redux' 
import axios from 'axios';
import UserIcon from '../components/userIcon'
import { select_booking } from '../../../redux/actions/BookingstateActions';
import { BellPic } from '../components/bellPic';
import { DynamicTimer } from '../components/timer'
import { Crosshair, useTooltip } from '@nivo/tooltip'
import { CustomTooltip } from '../components/customTooltip'
import { formatDateTime } from '../../../utils/formatDateTime.js';
import { formatDate } from '../../../utils/formatDate.js';
import { formatTime } from '../../../utils/formatTime.js';

const Dashboard = () => {    
    const [searchKey,setSearchKey] = useState();   
    
    const handleSearchChange = (e) => {
        setSearchKey(e.target.value)
    }
    const [booking, setBooking] = useState([]);
    const dispatch = useDispatch();
    const currentYear = new Date().getFullYear();
    const options = [
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: (currentYear - 2).toString(), label: (currentYear - 2).toString() }
    ];
    // const options = [
    //     { value: '2022', label: '2022' },
    //     { value: '2021', label: '2021' },
    //     { value: '2020', label: '2020' }
    // ];


    const [ currentdriver, setCurrentDriver] = useState()//current value for driver search
    const [ drivers, setDrivers ] =  useState()//all drivers in database
    const [ currentDriverList, setCurrentDriverList ] = useState([]);
    const [ driverSearchKey, setDriverSearchKey ] = useState()//search key for drivers
    const [ driverSearchResult, setDriverSearchResult ] = useState();//driver search result for graph
    const [ driverData, setDriverDate ] = useState();//initialize driver data
    const [ year, setYear ] = useState();//year for booking graph
    const [ bookingGraphData, setBookingGraphData ] = useState()//booking graph data
    const [ bookingGraphShowIndex, setBookingGraphShowIndex] = useState(0);
    //driver search
    const driverSearch = () => {
        let filtered = drivers.filter(entry => Object.values(entry).some(val =>  typeof val === "string" &&  val.toLowerCase().includes(searchKey)));            
            setCurrentDriverList(filtered)
            setCurrentDriver(filtered[0])
            
            getDriverStatistic(filtered[0].Bookings)
    }

    //driver data detail for search
    const getDriverStatistic = (booking) => {
        var curr = new Date;
        var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()-6));
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+7));
        let temp = Array.from(driverData);let j = 0;
        for (let day = firstday;day <= lastday; day.setDate(day.getDate() + 1)) {
                let tempday1 = day;let tempCount=0;
                for(let i = 0;i <  booking.length; i++)
                {
                    let tempday2 = new Date(booking[i].pickup_date);
                    if (tempday1.getDate() == tempday2.getDate() && tempday1.getMonth() ==  tempday2.getMonth() && tempday1.getFullYear() == tempday2.getFullYear())
                        tempCount++
                }
                temp[j].Booking = tempCount
                j++;
        }
        setDriverSearchResult(temp)
    }

    const MyCustomLayer: React.FC<CustomLayerProps> = props => {
        const { showTooltipFromEvent, hideTooltip } = useTooltip()
        useEffect(()=>{
            // console.log(props)
        },[])
        return (
          <>
            {props.slices.map(slice => (
              <rect
                x={slice.x0}
                y={slice.y0}
                width={slice.width}
                height={slice.height}
                stroke="red"
                strokeWidth={0}
                strokeOpacity={0.75}
                fill="red"
                fillOpacity={0}
                onMouseEnter={() => props.setCurrentSlice(slice)}
                onClick={() => console.log('clicked!')}
                onMouseMove={event => {
                  showTooltipFromEvent(
                    React.createElement(props.sliceTooltip, {
                      slice,
                      axis: props.enableSlices,
                    }),
                    event,
                    'right'
                  )
                }}
                onMouseLeave={() => {
                  hideTooltip()
                  props.setCurrentSlice(null)
                }}
              />
            ))}
          </>
        )
      }
      
    const MyResponsiveBump = ({data,idx}) => {
        return(
        <>
            { idx == year?   
                <ResponsiveLine
                    animate
                    data={data}
                    margin={{ top: 24, right: 96, bottom: 72, left: 64 }}
                    colors={['#F4730E', '#000000']}
                    yScale={{
                    type: "linear",
                    min: 0,
                    max: 40,
                    stacked: true
                    }}
                    enableGridY={false}
                    curve="natural"
                    borderColor={"#F4730E"}
                    useMesh={true}
                    lineWidth={1}
                    pointSize={10}
                    // tooltip={point => {
                    //     return <CustomTooltip point={point}/>;
                    // }}
                />
            
        :''}
       </>
       ) 
    }
    
    const MyResponsiveBar = ({ data /* see data tab */ }) => (
        <ResponsiveBar
            data={data}
            keys={[
                'Booking',
            ]}
            indexBy="country"
            margin={{ top: 30, right: 10, bottom: 50, left: 0 }}
            padding={0.9}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'white',
                    size: 4,
                    padding: 1,
                    stagger: true
                },

            ]}
            fill={[
                {
                    match: {
                        id: 'fries'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'sandwich'
                    },
                    id: 'lines'
                }
            ]}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={null}
            labelSkipWidth={14}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            enableGridY={false}
            enableLabel={false}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
        />
    )

    //get all data from booking table
    const getAllBooking = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/get`)
        .then((res)=>{
            dispatch(select_booking(res.data));
            setBooking(res.data)
        })
    }

    //get all data from driver table
    const getAllDriver = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/driver/get`)
        .then((res)=>{
            
            setDrivers(res.data)
        })
    }
    
    //initailize Driver Data
    const initailizeDriverData = () => {
        if (driver_data)
            setDriverDate(driver_data)
    }

    //get current's year's data for booking graph
    const initializeBookingStatisticData = () => {
        const year = new Date();
        setYear(year.getFullYear())        
    }

    //select year for booking graph
    const selectYearChange = (e) =>{
        setYear(e.value)
    }

    //get booking statistic date
    const getBookingStatisticData = () => {
        let temp_array = []
        options.map((year,idx)=>{
            temp_array[idx]=[]
            temp_array[idx][0] ={
                id:"Serie 1",
                data:[]
            }
            for (let i=0;i<12;i++)
            {    axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/bookingStatisticData`,{year:year.value,month:i+1})
                .then((res)=>{
                    
                    temp_array[idx][0].data[i] = {
                        "x":monthNames[i],
                        "y":res.data.length
                    }
                })
            }
            
        })
        setBookingGraphData(temp_array)

    }

    // const formatPickupDate = (pickupDate) => {
    //     const date = new Date(pickupDate);
    //     const options = {
    //       month: '2-digit', 
    //       day: '2-digit', 
    //       year: '2-digit',
    //       hour: '2-digit', 
    //       minute: '2-digit',
    //       hour12: true,
    //     };
    //     const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    
    //     return `${formattedDate}`;
    //   };

    useEffect(()=>{   
        initailizeDriverData();
    },[driver_data])

    useEffect(()=>{
    },[bookingGraphData])
    useEffect(()=>{
        getBookingStatisticData()
    },[]
    )
    useEffect(()=>{
        getAllBooking();
        getAllDriver();    
        initializeBookingStatisticData();
    },[])


    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
    return (
        <div className='dashboard'>
            <Sidebar/>
            <div className='content'>
                <div className='content-panel w-77'>
                    <div className='content-panel__heading'>
                        <div className='caption'>
                            <h5>dashboard overview</h5>
                            <DynamicTimer/>
                        </div>
                        <div className='dropdown'>
                            <div className='nav-item bell'>
                                <div className='svg-container'>
                                    <Link>
                                        <BellPic/>
                                    </Link>
                                </div>
                            </div>
                            <UserIcon></UserIcon>
                        </div>
                    </div>
                    <div className='content-panel__content'>
                        <Row>
                            <Col md={12}>
                                <div className='card analytic'>
                                    <div className='card-body'>
                                        <div className='card-body__header'>
                                            <div className='caption'>
                                                <h5 style={{textTransform:'capitalize'}}>booking anayltics</h5>
                                            </div>
                                            <div className='dropdown'>
                                                <Select options={options} onChange={selectYearChange} defaultValue={options[0]}>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className='card-body__content chart'>
                                            {/* <BookingGraph value = {bookingGraphData}/> */}
                                            {bookingGraphData?.map((val,idx)=>{
                                                    return(
                                                         <MyResponsiveBump data={bookingGraphData[idx]} idx = {options[idx].value}/>
                                                    )
                                                    })
                                            }
                                            {/* <ResponsiveLine
                                                animate
                                                data={bookingGraphData}
                                                margin={{ top: 24, right: 96, bottom: 72, left: 64 }}
                                                colors={['#F4730E', '#000000']}
                                                yScale={{
                                                type: "linear",
                                                min: 0,
                                                max: 40,
                                                stacked: true
                                                }}
                                                enableGridY={false}
                                                curve="natural"
                                                borderColor={"#F4730E"}
                                                useMesh={true}
                                                lineWidth={1}
                                                pointSize={10}
                                                tooltip={point => {
                                                    return <CustomTooltip point={point}/>;
                                                }}
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'50px'}}>
                            <Col xs={12}>
                                <div className='card'>
                                    <div className='dashboard-card-body'>
                                    <div className='card-body__header'>
                                            <div className='caption'>
                                                <h5 style={{textTransform:'capitalize'}}>bookings</h5>
                                            </div>
                                        </div>
                                        <div className='card-body__content'>
                                            <div className='table-responsive'>

                                            
                                            <table className='table-dashboard Z_Index'>
                                                <thead>
                                                    <tr>
                                                        <th> <Form.Check.Input
                                                                        type={"checkbox"}
                                                                        checked={false}
                                                                        disabled
                                                                    />
                                                        </th>
                                                        <th className='w-83'>Trip Number</th>
                                                        <th className='w-210'>Pickup</th>
                                                        <th className='w-210'>Drop Off</th>
                                                        <th className='w-85'>Passenger Name</th>
                                                        <th className='w-95'>Passenger Number</th>
                                                        <th className="w-78">Passengers</th>
                                                        <th className='w-88'>Date & time</th>
                                                        <th className='w-51'>Vehicle</th>
                                                        <th className='w-116'>Driver</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                    booking.map((val, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>
                                                                        <Form.Check
                                                                        type={"checkbox"}
                                                                        checked={val.active}
                                                                        onChange={(e) => {
                                                                            let temp_array = Array.from(booking);
                                                                            e.target.checked?temp_array[key].active = true:temp_array[key].active = false;
                                                                            setBooking(temp_array);
                                                                        }}
                                                                    />
                                                            </td>
                                                            <td className='w-88'>#{val.id}</td>
                                                            <td className='w-210'>{val.pickup_location}</td>
                                                            <td className='w-210'>{val.dropoff_location}</td>
                                                            <td className='w-116'>{val.passenger_infos[0].first_name} {val.passenger_infos[0].last_name}</td>
                                                            <td className='w-133'>{val.passenger_infos[0].id}</td>
                                                            <td className="w-78">{val.passenger}</td>
                                                            <td className='w-88'>{val.pickup_date ? formatDate(val.pickup_date) : ''} {val.pickup_time ? formatTime(val.pickup_time):''}</td>                                                            
                                                            <td className='w-51'>{val.vehicles[0]?.name ? val.vehicles[0].name : 'No vehicle available'}</td>
                                                             <td className='w-116'>
                                                             {val.drivers.length > 0 ? (
                                                                            <div className='driver-meta'>
                                                                                <div className='img-container ProfileImg'>
                                                                                    <img src={val.drivers[0].imgurlpath} alt="img" style={{ width: '100%', height: '100%', objectFit:'cover', objectPosition:'center' }}></img>
                                                                                </div>
                                                                                <h5>{val.drivers[0].first_name} {val.drivers[0].last_name}</h5>
                                                                            </div>
                                                                        ) :('No driver available')}
                                                             </td>
                                                        </tr>
                                                    )
                                                    })}
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>                         
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    )    
};

export { Dashboard };