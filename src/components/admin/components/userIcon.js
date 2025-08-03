import { useState,useEffect, useRef } from "react";
import { Profile_modal } from '../../layout/header/profile_modal'
import { logout, profile_change, getAuthUser} from '../../../auth'
import {useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_badge } from '../../../redux/actions/NotificationstateActions';
import {getToken} from '../../../auth'
import axios from 'axios'
const UserIcon = () => {
    const [userimg, setUserImg] = useState("default.svg");
    const [modalShow,setModalShow] = useState();
    const [ click, setClick ] = useState(false);

    const dropdownRef = useRef(null);
    const userIconRef = useRef(null);

    const dispatch = useDispatch();
    const onHide = (data) =>{
        profile_change(data)
        closeModal()
    }
    const closeModal = () => {
        setModalShow(false)
    }
    const token = getToken();
    const AuthUser = getAuthUser();
    let navigate = useNavigate();
    useEffect(()=>{
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !userIconRef.current.contains(event.target)) {
                setClick(false);
            }
        };

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/notification/admin/get`,
            {headers: {
                'x-access-token': token,
              }
            })
            .then((res)=>{
                
                if (res.data.length > 0)
                    dispatch(add_badge(true))
                else
                    dispatch(add_badge(false))
            });
            // Add event listener for clicks outside
        document.addEventListener('click', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    },[])
 return(
    <div className='nav-item user-icon' style={{cursor:'pointer',position:'relative'}}>
        <Profile_modal
                    show={modalShow}
                    onHide={onHide}
                    data={AuthUser}
                    closeModal = {closeModal}
                    setUserImg={setUserImg}
                />  
        <div  ref={userIconRef} className='user-container' style={{cursor:'pointer',position:'relative'}}>
            <img src="/images/mark/profile.png" width="24px" onClick={()=>click?setClick(false):setClick(true)} height = "24px" alt="bell"/>
        </div>
        <div ref={dropdownRef} className={click?'profile active':'profile'} style={{right:'0px',left:'unset'}}>
            <h3 onClick={()=>{ navigate('/home') }} style={{whiteSpace:'nowrap'}}>Switch to userview</h3>
            <h3 onClick={()=>{setModalShow(true); setClick(false);}}>Profile</h3>
            <h3 onClick={logout}>logout</h3>
            <div className='triangle'></div>
        </div>
    </div>
 )
}
export default UserIcon;