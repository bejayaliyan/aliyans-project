import { useEffect } from 'react'
import './customTooltip.scss'
const CustomTooltip = (props) => {
    const { point } = props;
    useEffect(()=>{
    },[])
    return (
        <div className="customTooltip">
            <div className='customTooltip-header'>
                <p>{point?.point?.data?.x}</p>
                <div className='three-dot'>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                </div>
            </div>
        </div>
    )
}
export { CustomTooltip }