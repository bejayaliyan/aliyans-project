import { useEffect, useState } from "react";
import axios from "axios";

const DriverPickUpRide = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const pickUpCode = decodeURIComponent(queryParams.get('code') ?? '');
    const [msg, setMsg] = useState("");

    useEffect(() => {
        pickUpRide();
    }, [])

    const pickUpRide = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/driver-pickup-ride`,
                { code: pickUpCode }
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
export { DriverPickUpRide };