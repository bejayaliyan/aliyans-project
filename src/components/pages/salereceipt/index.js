import React, {
    useState,
    createContext,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { Header } from '../../layout/header';
import { Container, Row, Col } from "react-bootstrap";
import "./Salereciept.scss";
import axios from 'axios';
import { Link } from "react-router-dom";
export const UserContext = createContext();

const SaleReceipt = () => {
    const [reservationNumber, setReservationNumber] = useState("");
    const [lastdigitCC, setLastdigitCC] = useState("");
    const [lastName, setLastName] = useState("");
    const [downloadType, setDownloadType] = useState("PDF");
    const [validationError, setValidationError] = useState(false);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

    function downloadPDF() {        
        if(reservationNumber == "") {
            setValidationError(true);
        } 
        else if(lastName == ""){
            setValidationError(true);
        }
        else if(selectedPaymentMode == ""){
            setValidationError(true);
        }
        else if(selectedPaymentMode == "Card" && lastdigitCC == ""){
            setValidationError(true);
        }
        else {
            setValidationError(false);
        if(downloadType == "PDF") {
            generatePDFReceipt()
        } else {
        generateHTMLReceipt();
        }
        }
    }

    const generatePDFReceipt = () => {
        // Send a request to the backend to generate the PDF receipt
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/generate-pdf-receipt`,{ reservationNumber: reservationNumber, lastdigitCC: lastdigitCC,lastName:lastName,paymentMode:selectedPaymentMode },{responseType: 'blob'})
        .then((response) => response.data)
          .then((blob) => {            
            if(blob.size > 9 && blob.type == "application/pdf"){
                // const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'receipt.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
            else{
                alert("No record found");
            }
          })
          .catch((error) => {
            console.error('Error generating PDF receipt: ', error);
          });
      };
    
      const generateHTMLReceipt = () => {
        // Send a request to the backend to generate the HTML receipt
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/booking/generate-html-receipt`, { reservationNumber: reservationNumber, lastdigitCC: lastdigitCC, lastName:lastName,paymentMode:selectedPaymentMode }, {responseType: 'blob'})
          .then((response) => {
            return response.data;
          })
          .then((htmlContent) => {            
            if(htmlContent.size > 9 && htmlContent.type == "text/html"){
                // Create a Blob with the HTML content
                const blob = new Blob([htmlContent], { type: 'text/html' });
                    
                // Create a URL for the blob and trigger a download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'receipt.html';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
            else{
                alert("No record found");
            }
          })
          .catch((error) => {
            console.error('Error generating HTML receipt: ', error);
          });
      };

    return (
        <div className="sale-receipt">
            <Header />
            <div className="main">
                <Container>
                    <h2 className="mb-3">Quick Receipt</h2>
                    <Row>
                    <Col md={3}>
                        <div className="form-group">
                            <label for="reservation">*Reservation #</label>
                            <input className="form-control" id="reservation" type="text" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value)}/>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="form-group">
                            <label for="reservation">*Payment Mode</label>
                            <select className="custom-dropdown form-control"
                            value={selectedPaymentMode}
                            onChange={(e) => setSelectedPaymentMode(e.target.value)}
                            style={{
                                border: "none",
                                width: "100%",
                                marginLeft: "0",
                                backgroundColor: "#fff",
                              }}>
                                <option value="">Select Payment Mode</option>
                                <option value="Card">Card</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </Col>
                    {selectedPaymentMode === "Card" && (
                        <Col md={3}>
                            <div className="form-group">
                                <label htmlFor="cc" className="cc-label">Last 4 Digits of CC</label>
                                <input
                                    id="cc"
                                    type="number"
                                    value={lastdigitCC}
                                    onChange={(e) => setLastdigitCC(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </Col>
                    )}
                    <Col md={3}>
                        <div className="form-group">
                        <label for="lastname">*Last Name</label>
                        <input  className="form-control" id="lastname" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        </div>
                    </Col>
                    </Row>
                    <div className="download-type">
                      <label className="receiptFormat">Receipt Format</label>
                       <input type="radio" id="pdf" onChange={(e) => setDownloadType(e.target.value)} 
                        checked={downloadType === "PDF"}
                       name="downloadtype" value="PDF"/>
                       <label for="pdf">PDF</label>
                       <input type="radio" id="html"
                        checked={downloadType === "HTML"}
                       onChange={(e) => setDownloadType(e.target.value)} name="downloadtype" value="HTML"/>
                       <label for="html">HTML</label>
                    </div>
                    {validationError?<p className="text-danger">All Fields are Required.</p>:''}
                    <div className="btns">
                        <button className="ok" onClick={downloadPDF}>OK</button>
                        {/* <button className="cancel">CANCEL</button> */}
                        <Link to={'/'} className="cancel">CANCEL</Link>
                    </div>
                </Container>
            </div>
        </div>
    )
};
export { SaleReceipt };