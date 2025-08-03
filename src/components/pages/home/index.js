import React, {
    useState,
    createContext,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { Link, redirect, useHistory,useLocation   } from "react-router-dom";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import Randomstring from "randomstring";
import GoogleMapReact from "google-map-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Nav, Container, Modal, FormControl, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Header } from "../../layout/header";
import AutoComplete from "./Autocomplete";
import LocationCheck from "../../../images/location-check.png";
import Trash from "../../../images/trash.png";
import "./Home.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    select_booking,
    save_booking,
} from "../../../redux/actions/BookingstateActions";
import axios from "axios";
import Status_board from "../../layout/Status_board";
import CustomTimePicker from "../../../utils/CustomTimePicker";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
export const UserContext = createContext();

const Home = () => {
    const location = useLocation();

    const temp = useSelector((state) => state.bookingState.temp_booking);
    const [selectedOption, setSelectedOption] = useState(temp.pick_location);
    const [startDate, setStartDate] = useState("");
    const [isSwitchOn, setIsSwitchOn] = useState(temp.isSwitchOn);
    const [stopNum, setStopNum] = useState([{ id: Randomstring.generate(10) }]);
    const [modalShow, setModalShow] = useState(false);
    const [passenger, setPassenger] = useState(
        temp.passenger ? temp.passenger : 3
    );
    const [value, onChange] = useState(new Date());
    const [children, setChildren] = useState(temp.children ? temp.children : 3);
    const [bag, setBag] = useState(temp.bags ? temp.bags : 3);
    const [key, setKey] = useState("searchall");
    const [key2, setKey2] = useState("searchall");
    const [stopFields, setStopFields] = useState(
        [{
            id: 0,
            children: {
                searchall: true,
                address: "",
                airport: "",
                landmark: ""
            }
        }]
    )

    const [stopVisible, setStopVisible] = useState(false)
    const [stopKey, setStopKey] = useState('searchall')
    const [methodkey, setMethodKey] = useState(1);
    const [startTime, setStartTime] = useState(temp.pickup_time);
    const [dropoff, setDropoff] = useState(temp.dropoff_location);
    const [stop, setStop] = useState([]);
    const [mapInstance, setMapInstance] = useState();
    const [mapApi, setMapApi] = useState();
    const [dropoffAddress, setDropoffAddress] = useState();
    const [pickupAddress, setPickupAddress] = useState();

    useEffect(() => {
        // temp.pickup_date
        //     ? setStartDate(temp.pickup_date)
        //     : setStartDate(moment(new Date()));
        // temp.pickup_time
        //     ? setStartTime(temp.pickup_time)
        //     : setStartTime(moment(new Date()));
        setSelectedOption(temp.pick_location);
        setIsSwitchOn(temp.isSwitchOn);
        temp.passenger ? setPassenger(temp.passenger) : setPassenger(0);
        temp.passenger ? setChildren(temp.children) : setChildren(0);
        temp.methodKey ? setMethodKey(temp.methodKey) : setMethodKey(1);
        setDropoff(temp.dropoff_location);
        temp.bags ? setBag(temp.bags) : setBag(0);
        temp.stop ? setStop(temp.stop) : setStop([]);
        temp.stopNum
            ? setStopNum(temp.stopNum)
            : setStopNum([{ id: Randomstring.generate(10) }]);
        // setMins(temp.mins);
        // setHours(temp.hours);
    }, []);

    const [errors, setErrors] = useState({
        pickup: "",
        dropoff: "",
        mins: "",
        hours: "",
        startDate: "",
        startTime: "",
        passenger: ""
    });
    const handleSUbmit = () => {
       
        const validationErrors = {};
        let error = validate(selectedOption);
        if (error && error.length > 0) validationErrors["pickup"] = error;
        error = validate(dropoff);
        if (error && error.length > 0) validationErrors["dropoff"] = error;
        error = validate(startDate);
        if (error && error.length > 0 && !isSwitchOn)
            validationErrors["startDate"] = error;
        error = validate(startTime);
        if (error && error.length > 0 && !isSwitchOn)
            validationErrors["startTime"] = error;
        error = validate(mins);
        if (error && error.length > 0 && methodkey == 2)
            validationErrors["mins"] = error;
        error = validate(hours);
        if (error && error.length > 0 && methodkey == 2)
            validationErrors["hours"] = error;

        if(passenger < 1) {
            validationErrors["passenger"] = 'Field is Required';
        }

        console.log(dropoff, 'e.target.value', passenger)
        console.log(validationErrors, 'validationErrors')

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
        select_vehicle();
        }
    };
    let navigate = useNavigate();
    const validate = (value) => {
        if (!value) return "Field is Required";
        else return "";
    };

    const { t } = useTranslation();
    const _onClick = (value) => {
        // setLat(value.lat)
        // setLng(value.lng)
    };
    const setCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter([position.coords.latitude, position.coords.longitude]);
            });
        }
    };
    const apiHasLoaded = (map, maps) => {
        setMapapitLoaded(true);
        setMapApi(maps);
        setMapInstance(map);
        _generateAddress();
    };
    const switch_onChange_handle = () => {
        setIsSwitchOn(!isSwitchOn);
    };
    const updateStop = (rowId, data) => {
        stop.filter(function (value, index, arr) {
            //Row to update
            if (value.id == rowId) {
                return { address: data };
            } else {
                return { ...value };
            }
        });
        setStop([]);
    };

    const addStop = () => {
        setStopNum([...stopNum, { id: Randomstring.generate(10) }]);
    };

    const deleteStop = (index) => {
        if (stopFields.length > 1) {
            setStopFields([
                ...stopFields.slice(0, index),
                ...stopFields.slice(index + 1, stopFields.length)
            ]);
        } else {
            setStopVisible(false)
        }
    };
    const _generatePickupAddress = async (id) => {
        if(!isNaN(pickuplat) && !isNaN(pickuplng)) {
        let latlng = parseFloat(pickuplat)+','+parseFloat(pickuplng);
        let gecocodeResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/geocode/get?query=${latlng}`);
        let results = gecocodeResponse.data.results;
        if (gecocodeResponse.data.status === "OK") {
            if (results[0]) {
                setZoom(10);
                setPickupAddress(results[0].formatted_address);
            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + gecocodeResponse.data.status);
        }
    }
    };
    const _generateDropoffAddress = async (id) => {
        if(!isNaN(dropofflat) && !isNaN(dropofflng)) {
        let latlng = parseFloat(dropofflat)+','+parseFloat(dropofflng);
        let gecocodeResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/geocode/get?query=${latlng}`);
        let results = gecocodeResponse.data.results;
        if (gecocodeResponse.data.status === "OK") {
            if (results[0]) {
                setZoom(10);
                setPickupAddress(results[0].formatted_address);
            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + gecocodeResponse.data.status);
        }
    }
    };
    const _generateAddress = async (id) => {
        if(!isNaN(pickuplat) && !isNaN(pickuplng)) {
        let latlng = parseFloat(pickuplat)+','+parseFloat(pickuplng);
        let gecocodeResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/geocode/get?query=${latlng}`);
        let results = gecocodeResponse.data.results;
        if (gecocodeResponse.data.status === "OK") {
            if (results[0]) {
                setZoom(10);
                setPickupAddress(results[0].formatted_address);
            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + gecocodeResponse.data.status);
        }
    }
    };
    const onMarkerInteraction = (childKey, childProps, mouse) => {
        // setLat(mouse.lat);
        // setLng(mouse.lng);
        setDraggable(false);
    };
    const onMarkerInteractionMouseUp = (childKey, childProps, mouse) => { };

    const _onChange = ({ center, zoom }) => {
        setCenter(center);
        setZoom(zoom);
    };

    const [center, setCenter] = useState([]);
    const [draggable, setDraggable] = useState(true);
    const [pickuplat, setPickupLat] = useState();
    const [dropofflat, setDropoffLat] = useState();
    const [pickuplng, setPickupLng] = useState();
    const [dropofflng, setDropoffLng] = useState();
    const [stopplace, setStopPlace] = useState([]);
    const [zoom, setZoom] = useState();
    const [pickUpPlace,setPickUpPlace] = useState();
    const [dropOffPlace,setDropoffPlace] = useState();
    const [mapApiLoaded, setMapapitLoaded] = useState(false);
    const [apiKey, setGoogleMapApiKey] = useState(process.env.REACT_APP_GOOGLE_MAP_API_KEY); 

    const addPickupPlace = (place) => {
        setPickUpPlace(place);
        setPickupLat(place.geometry.location.lat);
        setPickupLng(place.geometry.location.lng);
        _generatePickupAddress();
        setErrors((prevState) => ({
            ...prevState,
            pickup: '',
          }));
    };
    const addDropoffPlace = (place) => {
        setDropoffPlace(place);
        setDropoffLat(place.geometry.location.lat);
        setDropoffLng(place.geometry.location.lng);
        _generateDropoffAddress();
        setErrors((prevState) => ({
            ...prevState,
            dropoff: '',
          }));
    };
    const addStopPlace = (place) => {
        setStopPlace([
            ...stopplace,
            {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
            },
        ]);
        _generateAddress();
    };

    // if(temp.pickUpPlace) {
    //     addPickupPlace(temp.pickUpPlace);
    // }
    // if(temp.dropOffPlace) {
    //     addDropoffPlace(temp.dropOffPlace);
    // }

    const booking = useSelector((state) => state.bookingState);
    const login_status = useSelector((state) => state.userState.login_status);
    const dispatch = useDispatch();
    const select_vehicle = () => {
        let booking = {};
        booking.pickup_date = startDate;
        booking.pickup_time = startTime;
        booking.pick_location = selectedOption;
        booking.passenger = passenger;
        booking.children = children;
        booking.bags = bag;
        booking.trip_duration_hour = hours;
        booking.trip_duration_min = mins;
        booking.key = key;
        booking.booking_type_id = methodkey;
        booking.dropoff_location = dropoff;
        booking.stop = stop;
        booking.isSwitchOn = isSwitchOn;
        booking.stopNum = stopNum;
        booking.pickup_lat = pickuplat;
        booking.pickup_lng = pickuplng;
        booking.dropff_lat = dropofflat;
        booking.dropff_lng = dropofflng;
        booking.pickUpPlace = pickUpPlace;
        booking.dropOffPlace = dropOffPlace;
        dispatch(save_booking(booking));
        if(location.pathname == "/home") {
        navigate("/vehicles");
        } else {
        navigate("/price-quote-vehicles");
        }
    };
    useEffect(() => {
        _generateDropoffAddress();
    }, [dropofflat, dropofflng]);
    useEffect(() => {
        _generatePickupAddress();
    }, [pickuplat, pickuplng]);
    const [hours, setHours] = useState(1);
    const [mins, setMins] = useState(1);
    useEffect(() => {
        setCurrentLocation();
    }, []);
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
    const getStartDate = (date) => {
        let day = date.getDay();
        day = weekday[day];
        let month = date.getMonth();
        month = monthNames[month];
        const exactdate = date.getDate();
        const year = date.getFullYear();
        const startDate = day + ", " + month + ", " + exactdate + ", " + year;
        return startDate;
    };
    const datechange = (nowdate) => {
     //   const startDate = dayjs(nowdate);
        setStartDate(nowdate);
    };
    // const timechange = (time) => {
    //     setStartTime(dayjs(time).format('hh:mm a'));
    // };
    const inputTimeChange = (e) => {
        setStartTime(e.target.value);
    };
    useEffect(() => {
        if (login_status) {
            axios
                .get(`${process.env.REACT_APP_API_BASE_URL}/booking/get`)
                .then((res) => {
                    dispatch(select_booking(res.data));
                });
        }
    }, [login_status]);

    // const handleFormChange = (index, event) => {
    //     let data = [...inputFields];
    //     data[index][event.target.name] = event.target.value;
    //     setInputFields(data);
    // }

    const setNewStop = (type, index) => {
        const updatedStop = stopFields.map((stop, i) => {
            if (i === index) {

                Object.keys(stop.children).forEach(v => {

                    if (v == type) {
                        stop.children[v] = true
                    } else {
                        stop.children[v] = false
                    }
                })
                return stop;
                //   retur n stop;
            } else {
                return stop;
            }
        });
        // stopFields[index][type] = true
        setStopFields(updatedStop)
    }
    const addFields = (stops) => {
        if (stopFields.length > 0 && stopVisible) {
            stops.map((stop) => {
                let id = stop.id
                let newfield = {
                    id: id + 1,
                    children: {
                        searchall: true,
                        address: "",
                        airport: "",
                        landmark: ""
                    }
                }
                setStopFields([...stopFields, newfield])
            })
        } else {
            setStopVisible(true);
        }


    }

    const pickupCallback = (selectedtype) => {
        setKey(selectedtype)
    }

    const dropoffCallback = (selectedtype) => {
        setKey2(selectedtype)
    }

    const cancelForm = () => {
      window.location.href = "./home";

    }

    const droffBackCall = (e, type) => {
        if(e) {
        } else {
            if(type == 'pickup') {
                setSelectedOption('')
            } else {
                setDropoff('')
            }
        }
    }

    const [startDate1, setStartDate1] = useState(new Date());

    return (
        <div className="home">
        <Header />
        <div className="main">
            <Container>
                {location.pathname == "/home"?<Status_board /> :''}
                <Row>
                <Col md={7} id="ride-booking-wrapper">
                <div className="ride-booking-wrapper">
                            <b className="step-count">1 OF 3 STEP</b>
                            <b className="mobile-pickup-dropoff">PICKUP AND DROPOFF</b>
                            <div className="ride-booking-details">
                                <div className="booking-header">

                                {location.pathname == "/home"?
                                <div className="ride-now">
                                {t("RIDE_NOW")}
                                <Toggle
                                    defaultChecked={isSwitchOn}
                                    icons={{
                                        checked: "Yes",
                                        unchecked: "No"
                                    }}
                                    onChange={() => switch_onChange_handle()}
                                />
                            </div> :<h3 className="price-qoute">Price Quote</h3>}
                                    
                                    <div className="control-btns">
                                        <Nav defaultActiveKey="/#" as="div">
                                            <h5
                                                className={
                                                    methodkey === 1 ? "nav-link active" : "nav-link"
                                                }
                                                onClick={() => {
                                                    setMethodKey(1);
                                                }}
                                            >
                                                <img
                                                    src={
                                                        methodkey === 1
                                                            ? "/images/mark/location.svg"
                                                            : "/images/mark/black_location.svg"
                                                    }
                                                    width="14px"
                                                    height="14px"
                                                ></img>
                                                {t("Transfer")}
                                            </h5>
                                            <h5
                                                className={
                                                    methodkey === 2 ? "nav-link active" : "nav-link"
                                                }
                                                onClick={() => {
                                                    setMethodKey(2);
                                                }}
                                            >
                                                <img
                                                    src={
                                                        methodkey === 2
                                                            ? "/images/mark/clock.svg"
                                                            : "/images/mark/black_clock.svg"
                                                    }
                                                    width="14px"
                                                    height="14px"
                                                ></img>
                                                {t("Hourly")}
                                            </h5>
                                        </Nav>
                                    </div>
                                </div>
                                <div className="ride-booking-data-wrapper DurationHoursMargin">
                                {methodkey === 2 ? (
                                        <div className="ride-booking-data timing">
                                            <div className="hour-min-input">
                                                <div className="hour-min">
                                                    <div className="hour-input">
                                                        <div className="hour-input__wrapper">
                                                            <label className="title">
                                                                * Trip Duration Hours:
                                                            </label>
                                                            <span className="count">{hours}</span>
                                                            {/* <input
                                                                type="number"
                                                                value={hours}
                                                                onChange={(e) =>
                                                                    e.target.value >= 0 || ""
                                                                        ? setHours(e.target.value)
                                                                        : setHours(0)
                                                                }
                                                            /> */}
                                                        </div>
                                                        <div className="plus-minus">
                                                        <button
                                                                className="plus"
                                                                onClick={() => {
                                                                    setHours(hours + 1);
                                                                }}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                            <button
                                                                className="minus"
                                                                onClick={() => {
                                                                    hours > 0
                                                                        ? setHours(hours - 1)
                                                                        : setHours(0);
                                                                }}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            
                                                        </div>

                                                    </div>
                                                    <span className="text-danger">{errors.hours}</span>
                                                </div>
                                                <div className="hour-min">
                                                    <div className="hour-input">
                                                        <div className="hour-input__wrapper">
                                                            <label className="title">
                                                                * Trip Duration Mins:
                                                            </label>
                                                            <span className="count">{mins}</span>
                                                        </div>
                                                        <div className="plus-minus">
                                                        <button
                                                                className="plus"
                                                                onClick={() => {
                                                                    setMins(mins + 1);
                                                                }}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                            <button
                                                                className="minus"
                                                                onClick={() => {
                                                                    mins > 0
                                                                        ? setMins(mins - 1)
                                                                        : setMins(0);
                                                                }}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            
                                                        </div>

                                                    </div>
                                                    <span className="text-danger">{errors.mins}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="ride-booking-date-time-wrapper ride-booking-sidebar">
                                    <Row>
                                    <Col md={6}>
                                {!isSwitchOn ? (
                                    <div className="ride-booking-input datetimeInput">
                                        <div className="title">{t("Pickup Date")}:</div>
                                        <div className="inputs">
                                                 <DatePicker calendarIcon={<img
                                                src="/images/mark/newcalendar.png"
                                               
                                                id="calender-icon"
                                                height="20px"
                                                style={{top: "0"}}
                                            />} 
                                            dayPlaceholder="Select Date" monthPlaceholder="" yearPlaceholder=""  format={startDate?"d, MMM, y":"d  MMM  y"} onChange={datechange} minDate={moment().toDate()} clearIcon={null} value={startDate} />
                                        </div>
                                        
                                    </div>) : ("")}
                                    <span className="text-danger datetimeErr ">
                                                {errors.startDate}
                                            </span>
                                    </Col>
                                    <Col md={6}>
                                {!isSwitchOn ? (
                                    <div className="ride-booking-input datetimeInput">
                                        <div className="title">{t("Pickup Time")}:</div>
                                        <div className="inputs">
                                            <CustomTimePicker updatedTime={setStartTime}/>
                                        </div>
                                    </div>) : ("")}
                                    <span className="text-danger datetimeErr">
                                                {errors.startTime}
                                            </span>
                                    </Col>
                                    </Row>
                                </div>
                                {/* PickUp Location widget */}
                                <div className="ride-booking-data-wrapper">
                                    <div className="ride-booking-data">
                                        <div className="ride-booking-data-header">
                                            <div className="booking-type type">Location Type: </div>
                                            <div className={key == "searchall" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey("searchall");
                                                }}
                                            >
                                                Search All
                                            </div>
                                            <div className={key == "address" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey("address");
                                                }}
                                            >
                                                Address
                                            </div>
                                            <div className={key == "airport" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey("airport");
                                                }}
                                            >
                                                Airport
                                            </div>
                                            <div className={key == "landmark" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey("landmark");
                                                }}
                                            >
                                                Landmark
                                            </div>
                                        </div>
                                        <div className="ride-booking-data-inputs">
                                            <div className="ride-booking-data-input-wrapper pickup">
                                                    <div className="ride-booking-data-title">
                                                        <label className="title">{t("Pickup")}:</label>
                                                    </div>
                                                    <div className="ride-booking-data-input">
                                                        {mapApi ? (
                                                            <AutoComplete
                                                                map={mapInstance}
                                                                mapApi={mapApi}
                                                                initialValue={selectedOption}
                                                                setValue={setSelectedOption}
                                                                addplace={addPickupPlace}
                                                                searchkey={key}
                                                                selectedType={pickupCallback}
                                                                droffBackCall={droffBackCall}
                                                                type={"pickup"}
                                                                
                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                        </div>
                                        <span className="text-danger">{errors.pickup}</span>
                                        {key === "airport" ? (
                                            <div className="ride-booking-data-input airport">
                                                <div className="d-flex justify-content-between">
                                                    <div className="ride-booking-data-inputs">
                                                        <input type="text" placeholder="Select airline"></input>
                                                    </div>
                                                    <div className="ride-booking-data-inputs">
                                                        <input
                                                            type="number"
                                                            placeholder="Flight number"
                                                        ></input>
                                                    </div>
                                                    <div className="ride-booking-data-inputs arivalTimeInput">
                                                        <input id="ferfre" className="timeType" type="time" required  placeholder="arrival time"></input>
                                                            <img
                                                                className="timepickerArival" 
                                                                src="/images/mark/new_clock.png"
                                                                width="20px"
                                                                height="20px"
                                                                htmlFor="ferfre"
                                                                />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div>
                                        {stopVisible && stopFields.map((stops, index) => {
                                            return (
                                                <div className="ride-booking-data">
                                                    <div className="ride-booking-data-header">
                                                    <div className="booking-type type">Location Type: </div>
                                                        <div className={stops.children.searchall ? "booking-type active" : "booking-type"}
                                                            onClick={() => {
                                                                setNewStop('searchall', index)
                                                            }}
                                                        >
                                                            Search All
                                                        </div>
                                                        <div className={stops.children.address ? "booking-type active" : "booking-type"}
                                                            onClick={() => {
                                                                setNewStop('address', index)
                                                            }}
                                                        >
                                                            Address
                                                        </div>
                                                        <div className={stops.children.airport ? "booking-type active" : "booking-type"}
                                                            onClick={() => {
                                                                setNewStop('airport', index)
                                                            }}
                                                        >
                                                            Airport
                                                        </div>
                                                        <div className={stops.children.landmark ? "booking-type active" : "booking-type"}
                                                            onClick={() => {
                                                                setNewStop('landmark', index)
                                                            }}
                                                        >
                                                            Landmark
                                                        </div>
                                                    </div>
                                                    <div className="ride-booking-data-inputs">
                                                        {stops.children.searchall ? (
                                                            <div
                                                                className="stop d-flex align-items-center justify-content-between"
                                                            >
                                                                <div className="stop-location w-100">
                                                                    <label className="title">
                                                                        {t("Stop-")}
                                                                        {index + 1}:
                                                                    </label>
                                                                    {mapApi ? (
                                                                        <AutoComplete
                                                                            map={mapInstance}
                                                                            mapApi={mapApi}
                                                                            value={stop}
                                                                            initialValue={stop[index]}
                                                                            setValue={setStop}
                                                                            addplace={addStopPlace}
                                                                            selectedType={pickupCallback}
                                                                            searchkey={'searchall'}
                                                                            id={index}
                                                                            droffBackCall={droffBackCall}
                                                                            type={"stop"}
                                                                        />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className="trash"
                                                                    onClick={() => deleteStop(index)}
                                                                >
                                                                    <img
                                                                        src={Trash}
                                                                        alt="trash"
                                                                        width="24px"
                                                                        height="24px"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {stops.children.address ? (
                                                            <div
                                                                className="stop d-flex align-items-center justify-content-between"
                                                            >
                                                                <div className="stop-location w-100">
                                                                    <label className="title">
                                                                        {t("Stop-")}
                                                                        {index + 1}:
                                                                    </label>
                                                                    {mapApi ? (
                                                                        <AutoComplete
                                                                            map={mapInstance}
                                                                            mapApi={mapApi}
                                                                            value={stop}
                                                                            initialValue={stop[index]}
                                                                            setValue={setStop}
                                                                            addplace={addStopPlace}
                                                                            searchkey={'address'}
                                                                            id={index}
                                                                            droffBackCall={droffBackCall}
                                                                            type={"stop"}
                                                                        />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className="trash"
                                                                    onClick={() => deleteStop(index)}
                                                                >
                                                                    <img
                                                                        src={Trash}
                                                                        alt="trash"
                                                                        width="24px"
                                                                        height="24px"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {stops.children.airport ? (
                                                            <div
                                                                className="stop d-flex align-items-center justify-content-between"
                                                            >
                                                                <div className="stop-location w-100">
                                                                    <label className="title">
                                                                        {t("Stop-")}
                                                                        {index + 1}:
                                                                    </label>
                                                                    {mapApi ? (
                                                                        <AutoComplete
                                                                            map={mapInstance}
                                                                            mapApi={mapApi}
                                                                            value={stop}
                                                                            initialValue={stop[index]}
                                                                            setValue={setStop}
                                                                            addplace={addStopPlace}
                                                                            searchkey={'airport'}
                                                                            id={index}
                                                                            droffBackCall={droffBackCall}
                                                                            type={"stop"}
                                                                        />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className="trash"
                                                                    onClick={() => deleteStop(index)}
                                                                >
                                                                    <img
                                                                        src={Trash}
                                                                        alt="trash"
                                                                        width="24px"
                                                                        height="24px"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {stops.children.landmark ? (
                                                            <div
                                                                className="stop d-flex align-items-center justify-content-between"
                                                            >
                                                                <div className="stop-location w-100">
                                                                    <label className="title">
                                                                        {t("Stop-")}
                                                                        {index + 1}:
                                                                    </label>
                                                                    {mapApi ? (
                                                                        <AutoComplete
                                                                            map={mapInstance}
                                                                            mapApi={mapApi}
                                                                            value={stop}
                                                                            initialValue={stop[index]}
                                                                            setValue={setStop}
                                                                            addplace={addStopPlace}
                                                                            searchkey={'landmark'}
                                                                            id={index}
                                                                            droffBackCall={droffBackCall}
                                                                            type={"stop"}
                                                                        />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>

                                                                <div
                                                                    className="trash"
                                                                    onClick={() => deleteStop(index)}
                                                                >
                                                                    <img
                                                                        src={Trash}
                                                                        alt="trash"
                                                                        width="24px"
                                                                        height="24px"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>

                                                    {stops.children.airport ? (
                                                        <div className="ride-booking-data-input airport">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="ride-booking-data-inputs">
                                                                    <input type="text" placeholder="Select airline"></input>
                                                                </div>
                                                                <div className="ride-booking-data-inputs">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Flight number"
                                                                    ></input>
                                                                </div>
                                                                <div className="ride-booking-data-inputs">
                                                                    <input type="time" placeholder="arrival time"></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="ride-booking-data">
                                    <div className="ride-booking-data-header">
                                         <div className="booking-type type">Location Type: </div>
                                            <div className={key2 == "searchall" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey2("searchall");
                                                }}
                                            >
                                                Search All
                                            </div>
                                            <div className={key2 == "address" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey2("address");
                                                }}
                                            >
                                                Address
                                            </div>
                                            <div className={key2 == "airport" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey2("airport");
                                                }}
                                            >
                                                Airport
                                            </div>
                                            <div className={key2 == "landmark" ? "booking-type active" : "booking-type"}
                                                onClick={() => {
                                                    setKey2("landmark");
                                                }}
                                            >
                                                Landmark
                                            </div>
                                        </div>
                                        <div className="ride-booking-data-inputs">
                                            <div className="ride-booking-data-input-wrapper dropoff">
                                                    <div className="ride-booking-data-title">
                                                        <label className="title">{t("Dropoff")}:</label>
                                                    </div>
                                                    <div className="ride-booking-data-input">
                                                        {mapApi ? (
                                                            <AutoComplete
                                                                map={mapInstance}
                                                                mapApi={mapApi}
                                                                initialValue={dropoff}
                                                                setValue={setDropoff}
                                                                addplace={addDropoffPlace}
                                                                searchkey={key2}
                                                                selectedType={dropoffCallback}
                                                                droffBackCall={droffBackCall}
                                                                type={"dropoff"}

                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                        </div>
                                        
                                       
                                        <span className="text-danger">{errors.dropoff}</span>
                                        {key2 === "airport2" ? (
                                            <div className="ride-booking-data-input airport">
                                                <div className="d-flex justify-content-between">
                                                    <div className="ride-booking-data-inputs">
                                                        <input type="text" placeholder="Select airline"></input>
                                                    </div>
                                                    <div className="ride-booking-data-inputs">
                                                        <input
                                                            type="number"
                                                            placeholder="Flight number"
                                                        ></input>
                                                    </div>
                                                    <div className="ride-booking-data-inputs">
                                                        <input type="time" placeholder="arrival time"></input>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="addstop">
                                        {/* <div className="add-stop" onClick={() => addStop()}> */}
                                        <div className="add-stop" onClick={() => addFields(stopFields)}>

                                            <i className="fa fa-plus"></i>
                                            {t("Add_Stop")}
                                        </div>
                                    </div>
                                    {/* {methodkey === 2 ? (
                                        <div className="ride-booking-data timing">
                                            <div className="hour-min-input">
                                                <div className="hour-min">
                                                    <div className="hour-input">
                                                        <div className="hour-input__wrapper">
                                                            <label className="title">
                                                                * Trip Duration Hours:
                                                            </label>
                                                            <span className="count">{hours}</span>
                                                           
                                                        </div>
                                                        <div className="plus-minus">
                                                        <button
                                                                className="plus"
                                                                onClick={() => {
                                                                    setHours(hours + 1);
                                                                }}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                            <button
                                                                className="minus"
                                                                onClick={() => {
                                                                    hours > 0
                                                                        ? setHours(hours - 1)
                                                                        : setHours(0);
                                                                }}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            
                                                        </div>

                                                    </div>
                                                    <span className="text-danger">{errors.hours}</span>
                                                </div>
                                                <div className="hour-min">
                                                    <div className="hour-input">
                                                        <div className="hour-input__wrapper">
                                                            <label className="title">
                                                                * Trip Duration Mins:
                                                            </label>
                                                            <span className="count">{mins}</span>
                                                        </div>
                                                        <div className="plus-minus">
                                                        <button
                                                                className="plus"
                                                                onClick={() => {
                                                                    setMins(mins + 1);
                                                                }}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                            <button
                                                                className="minus"
                                                                onClick={() => {
                                                                    mins > 0
                                                                        ? setMins(mins - 1)
                                                                        : setMins(0);
                                                                }}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                            
                                                        </div>

                                                    </div>
                                                    <span className="text-danger">{errors.mins}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )} */}
                                </div>
                            </div>

                            <div className="counts ride-booking-sidebar">
                            <Row>
                                    <Col md={4}>
                                <div className="ride-booking-input">
                                    <div className="title">{t("Passengers")}</div>
                                    <div className="inputs body">
                                        <span className="count">{passenger}</span>
                                        <div className="btns">
                                            
                                            <button
                                                type="button"
                                                className="plus"
                                                onClick={() => {
                                                    setPassenger(passenger + 1);
                                                }}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="minus"
                                                onClick={() => {
                                                    passenger > 0
                                                        ? setPassenger(passenger - 1)
                                                        : setPassenger(0);
                                                }}
                                            >
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                

                                </div>
                              
                                   <span className="text-danger">
                                                {errors.passenger}
                                            </span>
                                   
                                </Col>
                                    <Col md={4}>
                                <div className="ride-booking-input">
                                    <div className="title" onClick={select_vehicle}>
                                        {t("Childrens")}
                                    </div>
                                    <div className="body inputs">
                                        <span className="count">{children}</span>
                                        <div className="btns">
                                            
                                            <button
                                                type="button"
                                                className="plus"
                                                onClick={() => {
                                                    setChildren(children + 1);
                                                }}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="minus"
                                                onClick={() => {
                                                    children > 0
                                                        ? setChildren(children - 1)
                                                        : setChildren(0);
                                                }}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </Col>
                                    <Col md={4}>
                                <div className="ride-booking-input">
                                    <div className="title">{t("Bags")}</div>
                                    <div className="body inputs">
                                        <span className="count">{bag}</span>
                                        <div className="btns">
                                            
                                            <button
                                                type="button"
                                                className="plus"
                                                onClick={() => {
                                                    setBag(bag + 1);
                                                }}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="minus"
                                                onClick={() => {
                                                    bag > 0 ? setBag(bag - 1) : setBag(0);
                                                }}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </Col>
                                </Row>
                            </div>
                            <div className="action-btns">
                            {/* <Link to="/home" >   {t("Cancel")}</Link> */}
                                <button className="btn-outline" onClick={cancelForm}>
                                    {t("Cancel")}
                                </button>
                                <button className="btn-fill" onClick={handleSUbmit}>
                                   {location.pathname == "/home"?t("Continue"):t("Get Quote")} 
                                </button>
                            </div>
                            
                       
                </div>
                </Col>
                <Col md={5} sm={12} id="google-map-wrapper">
                <div className="google-map">
                    <div className="map-title">Create New Reservation (Transfer)</div>
                    <GoogleMapReact
                        center={center ? center : [0, 0]}
                        zoom={zoom ? zoom : 6}
                        draggable={true}
                        onChange={_onChange}
                        onChildMouseDown={onMarkerInteraction}
                        onChildMouseUp={onMarkerInteractionMouseUp}
                        onChildMouseMove={onMarkerInteraction}
                        onClick={_onClick}
                        styles={[
                            {
                                featureType: "water",
                                stylers: [{ color: "#46bcec" }, { visibility: "on" }],
                            },
                            { featureType: "landscape", stylers: [{ color: "#f2f2f2" }] },
                            {
                                featureType: "road",
                                stylers: [{ saturation: -100 }, { lightness: 45 }],
                            },
                            {
                                featureType: "road.highway",
                                stylers: [{ visibility: "simplified" }],
                            },
                            {
                                featureType: "road.arterial",
                                elementType: "labels.icon",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "administrative",
                                elementType: "labels.text.fill",
                                stylers: [{ color: "#444444" }],
                            },
                            { featureType: "transit", stylers: [{ visibility: "off" }] },
                            { featureType: "poi", stylers: [{ visibility: "off" }] },
                        ]}
                        bootstrapURLKeys={{
                            key: apiKey,
                            libraries: ["places", "geometry"],
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
                    ></GoogleMapReact>
                </div>
                </Col>
                    </Row>
            </Container>
        </div>
    </div>
    );
};

export { Home };
