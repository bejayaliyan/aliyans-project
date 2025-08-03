import { useEffect,useState } from 'react';
import {
    Modal,
    Row,
    Col,
    CloseButton
} from 'react-bootstrap';
import Select from 'react-select'
import './driver_modal.scss'
import ImageUploading from 'react-images-uploading';
import axios from 'axios' 
import LoadingShow from '../components/LoadingShow';
import validator from 'validator' 
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';

const DriverModal = (props) => {
    const { modalshow, modaltitle, handleModalClose, getDrivers,val,buttonName} = props;
    const [ modalFirstName, setModalFirstName ]=useState();
    const [ modalLastName, setModalLastName ]= useState();
    const [ modalId, setModalId] = useState();
    const [ modalMobileNumber, setModalMobileNumber]=useState();
    const [ location, setLocation ]= useState("");
    const [ active, setActive ]= useState(false);
    const [ registration, setRegisteration]=useState();
    const [ insurance, setInsurance]=useState();
    const [ inspection,setInspection]=useState();
    const [ backgroundCheck,setBackgroundCheck]=useState();
    const [ drivingLicense, setDrivingLicense ] = useState();
    const [ IdDocument, setIdDocument ] = useState();
    const [ images,setImages ] = useState();
    const [ availability, setAvailability ]= useState();
    const maxNumber = 69;
    const [modalImageurl,setModalImageUrl]=useState([]);
    const [dropdownShow,setDropdownShow]=useState(false)
    const [loadingShow, setLoadingShow] = useState(false);
    const [errors, setErrors] = useState([])
    const [livery, setLivery]=useState();
    const [licensePlate, setLicensePlate]=useState();
    const [email, setEmail]= useState();    
    const [suggestions, setSuggestions] = useState([]);

    const validatePhoneNumber = (number) => {
        if (!number)
            return "field is required"
        const isValidPhoneNumber = validator.isMobilePhone(number+"")
        if (!isValidPhoneNumber)
            return "not valid phone number"
        return ""
       }
        
    const DriverModalClose = () =>{
        setModalImageUrl([]);
        setModalFirstName('')
        setModalLastName('')
        setImages([])
        setErrors([])
        setModalMobileNumber('')
        setLocation('')
        setRegisteration('')
        setInsurance('')
        setInspection('')
        setModalId('')
        setBackgroundCheck('')
        setDrivingLicense('')
        setIdDocument('')
        setModalImageUrl('')
        setAvailability('')
        setLivery('')
        setLicensePlate('')
        setEmail('')
        setActive(false)
        handleModalClose()
    }
    const options = [
        {label: 'On Duty', value:1},
        {label: 'Off Duty', value:0}
    ]
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        let filesize = 0;
          for (let i =0;i<imageList.length;i++)
        {
            filesize = filesize + imageList[i].file.size
            
        }
        
        // if(filesize >  500 * 1024 * 5)
        //     setErrors({file:'image size is too big'})
        if (filesize > 500 * 1024) setErrors({ file: "image size is too big" });
        else
            setErrors({file:''})
    };
    const onImageTempRemove = (index) => {
        var updatedList = Array.from(modalImageurl);
        if (Array.isArray(index)) {
            index.forEach(function (i) {
                updatedList.splice(i, 1);
            });
        }
        else {
            updatedList.splice(index, 1);
        }
        setModalImageUrl(updatedList)
    }
    const validate = (value) => {
        if (!value){
            return "Field is required"
        }
    }
    const next = () => {
        const validationErrors = {}
        if (!images)
             validationErrors['file'] = 'image is required'
        let error =  validate(modalFirstName)
        if (error && error.length > 0)
            validationErrors['modalFirstName']=error;
        error =  validate(modalLastName)
        if (error && error.length > 0)
            validationErrors['modalLastName']=error;
        error =  validatePhoneNumber(modalMobileNumber)
        if (error && error.length > 0)
            validationErrors['modalMobileNumber']=error;
        error =  validate(location)
        if (error && error.length > 0)
            validationErrors['location']=error;
        error =  validate(email)
        if (error && error.length > 0)
            validationErrors['email']=error;
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        }
        else if (errors && errors.file && errors.file.length > 0)
        {
            //console.log('error')
        }
        else{
            setActive(true)
        }   
    }
    const submit = async () => {        
        let temp = {}
        temp.first_name = modalFirstName;
        temp.last_name = modalLastName;
        temp.phone_number = modalMobileNumber;
        temp.location = location;
        temp.vehicle_registration = registration;
        temp.vehicle_insurance = insurance;
        temp.vehicle_inspection = inspection;
        temp.background_check = backgroundCheck;
        temp.identify_document = IdDocument;
        temp.driving_licence=drivingLicense;
        temp.livery = livery;
        temp.license_plate = licensePlate;
        temp.email = email;
        temp.availability = availability;

        const formData = new FormData();
        let temp_files = []
        

        if (images)
            images.map((image)=>{
                temp_files.push(image.file)
            })
        
        {temp_files.map(file=>{
            formData.append("uploadImages", file);
          });}
        
        if (errors && errors.file && errors.file.length > 0)
        {
          //console.log('error')
        }
        else if (modalId)
          {   
                
              temp.id = modalId;
                setLoadingShow(true);
              const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/upload`,formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    'boundary':'${form_data._boundary}'
                  },
                });
                temp.img_url=[]

            // old code    
            //   if (modalImageurl)
            //       modalImageurl.map(val=>
            //           temp.img_url.push(val.id))
            //   if (result.data.data)
            //       result.data.data.map(val=>
            //           temp.img_url.push(val.id))
              
            // new code
            if (result.data.data.length > 0){ // If user change image
                result.data.data.map(val=>temp.img_url.push(val.id))
            }
            else{
                if (modalImageurl){ 
                    modalImageurl.map(val=> temp.img_url.push(val.id))
                }
            }          

            axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/update`,temp)
              .then((res)=>{
                  getDrivers();
                  DriverModalClose()
                  setLoadingShow(false);
                  
                  let dateTime = notificationDateTimeFormat(new Date());
                  let notificationObj = {
                    data: "Update Driver Profile",
                    is_read: 0,
                    user_to_notify:0,
                    driver_id:temp.id,
                    notification_type: 12, // DRIVER UPDATED
                    tagline: JSON.stringify({
                        DriverName: temp.first_name + " " + temp.last_name,    
                        AdminTagline:"Updated Driver Profile " + temp.first_name + " " + temp.last_name + " at " + dateTime,
                        UserTagline:"",
                        DriverTagline:"",            
                    })
                }
                postToNotification(notificationObj);                
              })
          }
          else{
            temp.availability = 0;
            setLoadingShow(true);
            if (images)
            {
              const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/upload`,formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    'boundary':'${form_data._boundary}'
                  },
                });
              temp.urls = [...result.data.data]
            }
            
              axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/create`,temp)
              .then((res)=>{                
                getDrivers();
                DriverModalClose();
                setLoadingShow(false);
                props.notify();
                
                if(res.status == 200){
                    let dateTime = notificationDateTimeFormat(new Date());
                    let notificationObj = {
                        data: "New Driver Added",
                        is_read: 0,
                        user_to_notify:0,
                        driver_id:res.data.id,
                        notification_type: 4, // DRIVER ADDED
                        tagline: JSON.stringify({
                            DriverName: temp.first_name + " " + temp.last_name,
                            AdminTagline:"New Driver Added " + temp.first_name + " " + temp.last_name + " at " + dateTime,
                            UserTagline:"",
                            DriverTagline:"",
                        })
                    }
                    postToNotification(notificationObj);                    
                }                
              })
          }
    }
    const submitValidate =  () =>{

        const validationErrors = {}
        let error =  validate(registration)
        if (error && error.length > 0)
            validationErrors['registration']=error;
        error =  validate(insurance)
        if (error && error.length > 0)
            validationErrors['insurance']=error;
        error =  validate(inspection)
        if (error && error.length > 0)
            validationErrors['inspection']=error;
        error =  validate(backgroundCheck)
        if (error && error.length > 0)
            validationErrors['backgroundCheck']=error;
        error =  validate(IdDocument)
        if (error && error.length > 0)
            validationErrors['IdDocument']=error;
        error =  validate(drivingLicense)
        if (error && error.length > 0)
            validationErrors['drivingLicense']=error;
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        }
        else{
            submit();
        }
    }
    useEffect(()=>{
        if (val){
            setImages([])
            setErrors([])
            setModalFirstName(val.first_name)
            setModalLastName(val.last_name)
            setModalMobileNumber(val.phone_number)
            setLocation(val.location)
            setRegisteration(val.vehicle_registration)
            setInsurance(val.vehicle_insurance)
            setInspection(val.vehicle_inspection)
            setModalId(val.id)
            setBackgroundCheck(val.background_check)
            setDrivingLicense(val.driving_licence)
            setIdDocument(val.identify_document)
            setModalImageUrl(val.imgurls)
            setAvailability(val.availability)
            setLivery(val.livery)
            setLicensePlate(val.license_plate)
            setEmail(val.email)
        }
    },[val])

    useEffect(() => {        
        if (modalshow) {
            
          // Reset dropdownShow when the modal is opened
          setDropdownShow(false);
          setSuggestions([]);
        }
      }, [modalshow]);  // Depend on modalshow so it resets each time the modal is opened
      
    const postToNotification = (data) => {        
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
    }

    const fetchSuggestions = async (input) => {
        if (!input) {
            setSuggestions([]);
            return;
        }

        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/autocomplete/get?query=${input}`);
            let predictions = response.data.predictions;
            if (predictions.length > 0) {
                setSuggestions(response.data.predictions);
            }
            else{
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        fetchSuggestions(value);
    };

    // Handle selection of a suggestion
    const handleSelect = (place) => {
        setLocation(place.description);
        setSuggestions([]);
    };

    return(
        <Modal className="driver-modal" show={modalshow} dialogClassName="modal-100w" onHide={DriverModalClose} centered>
                <Modal.Header>
                    <h3 style={{cursor:'pointer'}} className={active?'':'active'} onClick={()=>setActive(false)}>{modaltitle}</h3>
                    <h3 style={{cursor:'pointer'}} className={active?'active':''} onClick={()=>setActive(true)}>Recomendation & Submission</h3>
                </Modal.Header>
                <Modal.Body>
                   <Row className={!active?'active':'display-none'}>
                       <Col md={6}>
                          <div className='modal-left'>
                              <div className='modal-left__thumb' style={{display:'flex',justifyContent:'center'}}>
                                <div style={{width:'100%'}}>
                                    <ImageUploading                                            
                                            value={images}
                                            onChange={onChange}
                                            maxNumber={maxNumber}
                                            dataURLKey="data_url"
                                            acceptType={['jpg','png', 'jpeg']}
                                        >
                                            {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps
                                            }) => (
                                            // write your building UI
                                            <div style={{marginTop:'50px'}}> 
                                                <div className="btns" style={{display:'flex',justifyContent:'space-between',position:'relative'}}>                                        
                                                    
                                                    {
                                                        props.modaltitle != 'add new driver'?
                                                        <>
                                                            <h6  onClick={onImageUpload} {...dragProps} className="delete" style={{width:'300px'}}>
                                                                Add Image
                                                                &nbsp;
                                                            
                                                            </h6>
                                                            <h6 className='duty-select' onClick={()=>{dropdownShow? setDropdownShow(false):setDropdownShow(true)}}>{availability? 'On Duty' : 'Off Duty'}<i className='fas fa-chevron-down'></i></h6>
                                                            <div className={dropdownShow? 'duty-dropdown active':'duty-dropdown'}>
                                                                <h3 onClick={()=>{setAvailability(1);setDropdownShow(false)}}>On Duty</h3>
                                                                <h3 onClick={()=>{setAvailability(0);setDropdownShow(false)}}>Off Duty</h3>
                                                            </div>
                                                        </>
                                                        :
                                                        <h6  onClick={onImageUpload} {...dragProps} className="delete">
                                                         Add Image
                                                         &nbsp;
                                                    
                                                        </h6>
                                                    }
                                                </div>
                                                <div className="modal-left__thumb driver-img__wrapper" style={{display:'grid',marginTop:'50px'}}> 
                                                    {modalImageurl ? modalImageurl.map((val,index)=>(
                                                        <div style={{display:'relative'}} key={index}>
                                                            {/* <img src={`${process.env.REACT_APP_IMAGE_BASE_URL+val.name}`} width="94px" height="94px" alt="car"/> */}
                                                            <img src={`${val.name}`} width="94px" height="94px" alt="car"/>
                                                            <CloseButton onClick={() => onImageTempRemove(index)} style={{position:'absolute'}}/>
                                                        </div>
                                                      )):''}
                                                    {imageList.map((image, index) => (
                                                        
                                                    <div key={index} className="image-item ImageWidth" style={{position:'relative'}}>
                                                        <img src={image.data_url} alt="" width="94px" height="94px" />
                                                        <CloseButton onClick={() => onImageRemove(index)} style={{position:'absolute' ,top:"-8px",right:"-15px"}}/>
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                            )}
                                    </ImageUploading>
                                    <span className="text-danger">{errors.file}</span>
                                </div>            
                              </div>
                          </div>                        
                       </Col>
                       <Col md={6}>
                           <div className='modal-right'>
                               <div className='input-wrapper'>
                                   <h5>First Name :</h5>
                                   <input type="text" value={modalFirstName} onChange={(e)=>setModalFirstName(e.target.value)}></input>
                                                    
                               </div>
                               <span className="text-danger">{errors.modalFirstName}</span>

                               <div className='input-wrapper'>
                                    <h5>Last Name :</h5>
                                    <input type="text" value={modalLastName} onChange={(e)=>setModalLastName(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.modalLastName}</span>
                               
                               <div className='input-wrapper'>
                                    <h5>Phone Number :</h5>
                                    <input type="text" value={modalMobileNumber} onChange={(e)=>setModalMobileNumber(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.modalMobileNumber}</span>
                               
                               {/* old code */}
                               {/* <div className='input-wrapper'>
                                    <h5>Location :</h5>
                                    <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)}></input>
                               </div> */}
                            <div className='input-wrapper'>
                                <h5>Location :</h5>
                                <input type="text" value={location} onChange={handleChange}></input>
                                {suggestions.length > 0 && (
                                    <ul className="suggestions">
                                        {suggestions.map((place) => (
                                            <li key={place.place_id} onClick={() => handleSelect(place)}>
                                                {place.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                               <span className="text-danger">{errors.location}</span>
                               <div className='input-wrapper'>
                                    <h5>Email :</h5>
                                    <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.email}</span>
                               <div>
                                   <h6 className='update' onClick={next} style={{widhth:'100%'}}>Next</h6>
                                </div>
                           </div>
                       </Col>
                   </Row>
                   <Row className={active?'active':'display-none'}>
                       <Col md={6}>
                       <div className='modal-right'>
                               <div className='input-wrapper'>
                                   <h5>Vehicle Registration :</h5>
                                   <input type="text" value={registration} onChange={(e)=>setRegisteration(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.registration}</span>                
                               <div className='input-wrapper'>
                                    <h5>Vehicle Insurance :</h5>
                                    <input type="text" value={insurance} onChange={(e)=>setInsurance(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.insurance}</span>                
                               <div className='input-wrapper'>
                                    <h5>Vehicle inspection :</h5>
                                    <input type="text" value={inspection} onChange={(e)=>setInspection(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.inspection}</span>
                               <div className='input-wrapper'>
                                    <h5>Livery :</h5>
                                    <input type="text" value={livery} onChange={(e)=>setLivery(e.target.value)}></input>
                               </div>
                           </div>                        
                       </Col>
                       <Col md={6}>
                           <div className='modal-right'>
                               <div className='input-wrapper'>
                                   <h5>Background Check :</h5>
                                   <input type="text" value={backgroundCheck} onChange={(e)=>setBackgroundCheck(e.target.value)}></input>
                                                    
                               </div>
                               <span className="text-danger">{errors.backgroundCheck}</span>
                               <div className='input-wrapper'>
                                    <h5>Driving License :</h5>
                                    <input type="text" value={drivingLicense} onChange={(e)=>setDrivingLicense(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.drivingLicense}</span>
                               <div className='input-wrapper'>
                                    <h5>Identity Document :</h5>
                                    <input type="text" value={IdDocument} onChange={(e)=>setIdDocument(e.target.value)}></input>
                               </div>
                               <span className="text-danger">{errors.IdDocument}</span>
                               <div className='input-wrapper'>
                                    <h5>License Plate :</h5>
                                    <input type="text" value={licensePlate} onChange={(e)=>setLicensePlate(e.target.value)}></input>
                               </div>
                           </div>
                       </Col>
                       <h6 className='update w-auto' onClick={submitValidate}>{buttonName}</h6>
                   </Row>

                </Modal.Body>
                <LoadingShow show={loadingShow}></LoadingShow>                     
        
        </Modal>
    )
}
export default DriverModal;