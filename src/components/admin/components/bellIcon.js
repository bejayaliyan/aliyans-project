import {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
// import Pusher from 'pusher-js';
const BellIcon = () => {
    // Pusher.logToConsole = true;
    // const [ newMessage, setNewMessage]= useState(false);
    // const pusher = new Pusher("17f0a8bb6c344bc6ddba", {
    //     cluster: "ap3"
    //   });
    //   const channel = pusher.subscribe("channel");
    //   channel.bind("event", (newMessage) => {
    //     //setMessages([...messages, newMessage]);
    //     setNewMessage(true)
    //   });
    return(
        <div className='nav-item'>
            <div className='svg-container'>
                <Link to="/admin/notification">
                   {newMessage? <img src='/images/mark/active_notification.png' alt='bell'  width="24px" height="24px" />:
                                <img src='/images/mark/notification.png' alt='bell'  width="24px" height="24px" />}
                </Link>
            </div>
        </div>
    )
}
export {BellIcon};