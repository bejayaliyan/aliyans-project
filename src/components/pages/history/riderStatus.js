import React, { useEffect, useState } from 'react'
import rider_status from './rider_status_data.js'
const RiderStatusPanel = (props) =>{
    const [currentStatus, setCurrentStatus] = useState();
    const temp =  rider_status;
    useEffect(()=>{
        
        setCurrentStatus(props.currentStatus)
        if (props.currentStatus == 3)
        {
            rider_status[1].name ="Ride Requested Canceled";
            rider_status[1].content = "Your booking request for a ride has been canceled by the admin"
            rider_status[1].unread =true
        }
        else{
            rider_status[1].name ="Ride Requested Accepted";
            rider_status[1].content = "Your booking request for a ride has been accepted by the admin"
            rider_status[1].unread =true
        }

    },[props.currentStatus])
    return(
        <>
        {
            currentStatus == 1 ?
            <div className='rider-status__container'>
                {rider_status.map((value,key)=>{
                    if (value.unread)
                    return(
                        <div className={key === 0 ? "rider-status first":'rider-status'} key={key}>
                            <h5>{value.name}</h5>
                            <h6>{value.content}</h6>
                        </div>)
                    else
                    return(
                        <div  key={key} className="rider-status unread">
                            <h5>{value.name}</h5>
                            <h6>{value.content}</h6>
                        </div>
                    )
                    }
                    )
                } 
             </div>:''
        }
        {
            currentStatus == 2?
            <div className='rider-status__container'>
                {rider_status.map((value,key)=>{
                    return(
                        <div className={key === 0 ? "rider-status first":'rider-status unread'} key={key}>
                            <h5>{value.name}</h5>
                            <h6>{value.content}</h6>
                        </div>
                        )
                    }
                    )
                } 
             </div>:''
        }
        {
            currentStatus == 3?
            <div className='rider-status__container'>
                {rider_status.map((value,key)=>{
                    if (value.unread)
                    return(
                        <div className={key === 0 ? "rider-status first":'rider-status'} key={key}>
                            <h5>{value.name}</h5>
                            <h6>{value.content}</h6>
                        </div>)
                    else
                    return(

                        <div className= "rider-status first unread" key={key}>
                            <h5>{value.name}</h5>
                            <h6>{value.content}</h6>
                        </div>
                        )
                    }
                    )
                } 
             </div>:''
        }
        </>
    )
}
export {RiderStatusPanel}