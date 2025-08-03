import { useEffect, useState } from "react";
import axios from "axios";

const BookingConfirm = () => {    
    const queryParams = new URLSearchParams(window.location.search);
    const bookingCode = decodeURIComponent(queryParams.get('code') ?? '');
    const [msg, setMsg] = useState("");

    useEffect(() => {
        updateBookingStatus();
    }, [])


    const updateBookingStatus = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/booking-confirm-or-cancel`,
                { code: bookingCode }
            );

            if (res.status === 200) {
                setMsg(res.data);
            } else {
                setMsg("Something went wrong. Please try again.");
            }
        } catch (error) {
            if (error.response.status == 500) {
                setMsg(error.response.data);
            } else if (error.request) {
                setMsg("No response from the server. Please check your connection.");
            } else {
                setMsg("Request failed. Please try again.");
            }
        }
    };

    return (
        <div>{msg}</div>
    );
};
export { BookingConfirm };