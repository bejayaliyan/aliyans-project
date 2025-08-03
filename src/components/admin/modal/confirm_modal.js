import {
    Modal 
} from 'react-bootstrap';
import './confirm_modal.scss'
const Confirm_modal = (props) => {
    return (
        <Modal className="confirm-modal modal" show={props.show} dialogClassName="modal-100w" onHide={props.onHide} centered>
                <Modal.Header>
                    <Modal.Title>{props.modalTitle}</Modal.Title>
                    </Modal.Header>
                <Modal.Body>               
                    <>
                        <h6>
                            Are you sure?
                            <br/>
                            {props.content}
                        </h6>
                        <div className='btns modal-buttons'>
                            <h6 className='update' onClick={props.onHide}>No, Go Back</h6>
                            <h6 className='delete mb-0' style={{marginLeft: "10px"}} onClick={props.delete_vehicle}>Yes, {props.button_name}</h6>
                        </div>
                    </>
                </Modal.Body>
        </Modal>
    )
}
export default Confirm_modal