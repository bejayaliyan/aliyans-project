import { Spinner } from 'react-awesome-spinners'
const LoadingShow = (props) =>{
    return(
        props.show ? 
        <div className="tailspin" style={{width:'100%', height:'100vh'}}>
            <div className='loading-page'>
                <img src='/images/white-Group.png' width='383px' height='100px'/>
                <div className='spinner-wrapper'>
                    <Spinner className="spinner" color="#F4730E" size="131"></Spinner>
                </div>
                <div className='spinner-caption'>
                    <p>LOADING</p>
                </div>
                
            </div>
        </div>  : ""
    )
}
export default LoadingShow