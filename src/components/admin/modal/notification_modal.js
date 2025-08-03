import { useEffect } from 'react';
import {
    Modal 
} from 'react-bootstrap';
import './notification_modal.scss'
const Notification_modal = (props) => {
    useEffect(()=>{        
    },[])
    return (
        <Modal className="notification-modal modal" show={props.show} dialogClassName="modal-100w" centered>
                <Modal.Header>
                    <Modal.Title>{props.modalTitle}</Modal.Title>
                    </Modal.Header>
                <Modal.Body>               
                    <>
                        <h6>
                            {props.content}
                        </h6>
                        <div className='btns'>
                            <h6 className='update' onClick={props.onHide}>Okay, Go Back</h6>
                        </div>
                    </>
                </Modal.Body>
        </Modal>
    )
}
export default Notification_modal