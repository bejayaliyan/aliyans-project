import {
    Modal,Row,Col,FormControl
} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading'; 
import LoadingShow from '../../admin/components/LoadingShow'
import ImageCropper from "../../../utils/ImageCropper"
import "./image_cropper.scss";
import { notificationDateTimeFormat } from '../../../utils/notificationDateTimeFormat.js';
import { getAuthUser } from "../../../auth";
import validator from 'validator'

export const Profile_modal = (props) => {  
    const authUser = getAuthUser();  
    const [name,setName]=useState();
    const [showImageCropper,setShowImageCropper]=useState(false);
    const [email,setEmail]=useState();
    const [phone,setPhone]=useState();
    const [loadingShow, setLoadingShow] = useState();
    const [address,setAddress]=useState();
    const [postcode,setPostcode]=useState();
    const [country,setCountry]=useState();
    const [images, setImages] = useState([]);
    const [errors,setErrors]= useState([]);
    const [modalImageurl,setModalImageUrl]=useState([]);
    const [uploadedImageURL, setUploadedImageURL] = useState();
    const [isImageCrop, setImageCrop] = useState(false);
    const [imgAfterCrop, setImgAfterCrop] = useState("");    
    const maxNumber = 2;

    const validatePhoneNumber = (number) => {        
        if (!number)
            return "field is required"
        const isValidPhoneNumber = validator.isMobilePhone(number,"en-US")
        if (!isValidPhoneNumber)
            return "not valid phone number"
        return ""
    }

    const getCropImage = (image) => {
        setImageCrop(true);
        setImgAfterCrop(image);
        setShowImageCropper(false);
    }
    const cancelImageCropper = () => {
        setShowImageCropper(false);
    }

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        // setUploadedImageURL(imageList[0].data_url);
        setUploadedImageURL(imageList[0].data_url);
        let filesize = 0;
          for (let i =0;i<imageList.length;i++)
        {
            filesize = filesize + imageList[i].file.size   
        }
        setShowImageCropper(true);
        if(filesize >  500 * 1024 * 5)
            setErrors({file:'image size is too big'})
        else
            setErrors({file:''})
    };

    const submitValidate =  () =>{
        const validationErrors = {}
        let error =  validatePhoneNumber(phone)
        if (error && error.length > 0)
            validationErrors['phone']=error;
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        }
        else{
            confirm();
        }
    }

    const confirm = (async ()=>{        

        const formData = new FormData();
        if(isImageCrop) {
            formData.append("uploadImages", imgAfterCrop.file);
        }
        if (errors && errors.file && errors.file.length > 0)
        {
          console.log('error')
        }
        else {
            
           setLoadingShow(true)
          const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/driver/upload`,formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'boundary':'${form_data._boundary}'
            },
          })
          
           if (isImageCrop) {
            props.setUserImg(result.data.data[0].name);
            upload_user_data(result.data.data[0].id);
          }
          else
            upload_user_data()
        }
    })
    const upload_user_data = ((id = null) => {
        let data = {}
        data.first_name = name
        data.email = email
        data.address = address
        data.postcode = postcode
        data.country = country
        data.mobile_phone = phone == (null || "") ? null : phone

        if (id)
           data.img_url = id
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/update`,data)
            .then((res)=>{
                const data = res.data
                setLoadingShow(false)
                props.onHide(data.username);

                let dateTime = notificationDateTimeFormat(new Date());
                let notificationObj = {
                    data:"Profile Updated",
                    is_read: 0,
                    user_to_notify:authUser?.id,
                    notification_type: 16, // PROFILE UPDATED
                    tagline: JSON.stringify({
                      UserName:data.username,
                      AdminTagline:"",
                      UserTagline:"Your profile is updated successfully at " + dateTime,
                      DriverTagline:"",                
                    })
                  }
                  //postToNotification(notificationObj)
            })
    })
    useEffect(()=>{
        if (props.data)
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/info`,{email:props.data.email})
            .then((res)=>{
                
                const data = res.data;
                setName(data.username)
                setAddress(data.address)
                setCountry(data.country)
                setPostcode(data.postcode)
                setEmail(data.email)
                setPhone(data.phone == null ? '' : data.phone)
                
                let temp=[];
                temp.push({name:data.imgurl})
                if (data.imgurl)
                    setModalImageUrl(temp)
                else
                    setModalImageUrl([{name:'default.svg'}])
            })
    },[])

    const postToNotification = (data) => {        
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/notification/create`, data)
    }

    return (
        <>
        <Modal
            show = {props.show}
            onHide = {props.closeModal}
            className={showImageCropper?'image-cropper-modal':'profile-modal'}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Body>
             {showImageCropper?
              <div className="image-cropper">
              <ImageCropper cancelCropImage={cancelImageCropper} cropImage={getCropImage} image={uploadedImageURL}></ImageCropper>
              </div>
              :
              <Row>
              <Col md={6}>
                  <div className='header-wrap'>
                      <div className='title'>
                          Your Profile
                      </div>
                      <div className='description'>
                          <h6>Brief us with your personal information so the we can better serve you</h6>
                      </div>

                          <ImageUploading
                                      value={images}
                                      onChange={onChange}
                                      maxNumber={maxNumber}
                                      dataURLKey="data_url"
                                      acceptType={['jpg','png', 'jpeg']}
                                  >
                                      {({
                                      multiple,
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging,
                                      dragProps
                                      }) => (
                                          <>
                                          <div className="modal-left__thumb"> 
                                             <div className="img-wrapper">
                                                  {isImageCrop ?
                                                  <img className="user-image" src={imgAfterCrop.data_url} alt="profile" width="195px" height="112px" /> :
                                                   imageList.length > 0 ?
                                                      <>
                                                      {imageList.map((image, index) => (
                                                          <img className="user-image" src={image.data_url} alt="profile" key={index} width="195px" height="112px" />
                                                     ))}
                                                     </>:
                                                        <div className='ProfileImgWidth' style={{position:'relative', display:'inline-table'}}>
                                                          {/* <img style={{width:'140px',height:'140px',borderRadius:'50%'}} src={modalImageurl[0] ? `${process.env.REACT_APP_IMAGE_BASE_URL+modalImageurl[0].name}`:''} alt="car"/> */}
                                                          <img style={{ width: '100%', height: '100%', objectFit:'cover',objectPosition:'center' }} src={modalImageurl[0] ? `${modalImageurl[0].name}`:''} alt="car"/>
                                                      </div>
                                                      }
                                                      <div title='Please click on icon to change the profile picture' className='i-wrapper CursorePointer'>
                                                          <img onClick={onImageUpload} src = "/images/mark/camera.png" width="18px" height="18px" />
                                                      </div>
                                              </div>                                                  
                                          </div>
                                      </>
                                      )}
                          </ImageUploading>
                          <span className="text-danger">{errors.file}</span>
                  </div>
              </Col>
              <Col md={6}>
                  <div className='content-wrap '>
                      <div className='street d-flex input-wrapper align-items-center'>
                          <div className='label'>Name:</div>
                          <input
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              value={name}
                              onChange={(e)=>setName(e.target.value)}
                          />
                      </div>
                      <div className='city d-flex input-wrapper align-items-center'>
                          <div className='label'>Email:</div>
                          <input
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              value={email}
                              onChange={(e)=>setEmail(e.target.value)}
                          />
                      </div>
                      <div className='city d-flex input-wrapper align-items-center'>
                          <div className='label'>Phone:</div>
                          <input
                              aria-label="Phone"
                              aria-describedby="basic-addon1"
                              value={phone}
                              onChange={(e)=>setPhone(e.target.value)}
                          />
                      </div>
                      <span className="text-danger">{errors.phone}</span>
                      <div className='state d-flex input-wrapper align-items-center'>
                          <div className='label'>Address:</div>
                          <input
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              value={address}
                              onChange={(e)=>setAddress(e.target.value)}
                          />
                      </div>
                      <div className='postalcode d-flex input-wrapper align-items-center'>
                          <div className='label'>Postal Code:</div>
                          <input
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              value={postcode}
                              onChange={(e)=>setPostcode(e.target.value)}
                          />
                      </div>
                      <div className='country d-flex input-wrapper align-items-center'>
                          <div className='label'>Country:</div>
                          <input
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              value={country}
                              onChange={(e)=>setCountry(e.target.value)}
                          />
                      </div>
                      <div className='btns'>
                          <h6 className='update' onClick={()=>submitValidate()}>Continue</h6>
                          <button type='button' className='edit' onClick={() => props.closeModal()}>Skip</button>
                      </div>
                  </div>
                  
              </Col>
          </Row> 
            }
            </Modal.Body>
            <LoadingShow show={loadingShow}></LoadingShow>   
        </Modal>
        </>
    );
}