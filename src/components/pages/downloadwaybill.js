import { useEffect, useState } from "react";
import axios from "axios";

const DownloadWayBill = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const bookingCode = decodeURIComponent(queryParams.get('code') ?? '');

    useEffect(() => {
        handleDownloadWayBill();
    }, [])


    const handleDownloadWayBill = async () => {
        console.log(bookingCode);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/down-load-way-bill-pdf`, { code: bookingCode }, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blob) => {
                if (blob.size > 9 && blob.type == "application/pdf") {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'waybill.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
                else {
                    alert("Waybill not generated yet");
                }
            })
            .catch((error) => {
                console.error('Error generating PDF receipt: ', error);
            });
    };

    return (
        <div></div>
    );
};
export { DownloadWayBill };