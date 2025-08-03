import { useEffect,useState } from 'react';
import axios from 'axios';
import './customSelect.scss';
const CustomDriverSelect = (props) => {
    const [ label,setLabel] = useState()
    const [ active,setActive ] = useState(false)
    const [ value,setValue ] = useState();
    const [options,setOptions ] = useState([]);
    const onclick = () => {
        active ? setActive(false) : setActive(true)
    }

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/booking/get-all-active-drivers`)
        .then((res)=>{
            let temp_array=[];
            if (res.data)
                res.data.map((val)=>{
                    temp_array.push({label:val.first_name  + ' ' + val.last_name,value:val.id})
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

        // let temp_array = Array.from(props.bookingDriver)
        // temp_array[props.indexKey] = {BookingId:props.bookingId,Id:val.value,Text:val.label}
        // props.function(temp_array)

        
        let temp_array = Array.from(props.bookingDriver);

        if(temp_array.length > 1){

            const index = temp_array.findIndex(item => item.BookingId === props.bookingId);

            if (index !== -1) {
                temp_array[index] = {
                    ...temp_array[index],
                    Id: val.value,
                    Text: val.label
                };
            } else {
                temp_array.push({
                    BookingId: props.bookingId,
                    Id: val.value,
                    Text: val.label
                });
            }

        }
        else{
            temp_array.push({
                BookingId: props.bookingId,
                Id: val.value,
                Text: val.label
            });
        }

        props.function(temp_array);

        setActive(false);
    }
    return (
        <div className="custom-select">
            <h6 className={'label'+value} onClick={onclick}>{label} <span><i className='fas fa-chevron-down'></i></span></h6>
           
            <div className={active? "active select-panel":'select-panel'}>
                {options.map((val,key)=>{
                    return(
                        // <h6 className={'label'+val.value} key={key} onClick={()=>option_select(val)}>{val.label}</h6>
                        <h6 className={'label'} key={key} onClick={()=>option_select(val)}>{val.label}</h6>
                    )
                })}
               
            </div>
        </div>
    )
}
export default CustomDriverSelect