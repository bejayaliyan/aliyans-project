import { useEffect,useState } from 'react';
import axios from 'axios';
import './customSelect.scss';
const CustomSelect = (props) => {
    const [ label,setLabel] = useState()
    const [ active,setActive ] = useState(false)
    const [ value,setValue ] = useState();
    const [options,setOptions ] = useState([]);
    const onclick = () => {
        active ? setActive(false) : setActive(true)
    }

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/getbookingstatus`)
        .then((res)=>{
            let temp_array=[];
            if (res.data)
                res.data.map((val)=>{
                    temp_array.push({label:val.booking_status,value:val.id})
                })
            
            setOptions(temp_array)
        })
    },[])

    useEffect(()=>{
        
        if (options)

            {options.map((val)=>{
                if (val.value === props.value)
                   {
                    
                    setLabel(val.label)
                    setValue(val.value)
                   }
                })
            }
    },[options])

    const option_select = (val) => {
        
        setLabel(val.label);
        setValue(val.value);
        let temp_array = Array.from(props.bookingStatus)
        temp_array[props.indexKey] = val.value
        props.function(temp_array)

        // Check the checkbox for this row
        let updatedBookings = [...props.bookings];
        updatedBookings[props.indexKey].active = true; // Set active to true
        props.setBookings(updatedBookings);

        setActive(false);
    }
    return (
        <div className="custom-select">
            <h6 className={'label'+value} onClick={onclick}>{label} <span><i className='fas fa-chevron-down'></i></span></h6>
           
            <div className={active? "active select-panel":'select-panel'}>
                {options.map((val,key)=>{
                    return(
                        <h6 className={'HoverDroLable label'+val.value} key={key} onClick={()=>option_select(val)}>{val.label}</h6>
                    )
                })}
               
            </div>
        </div>
    )
}
export default CustomSelect