import './Status_board.scss'
import { useTranslation } from 'react-i18next'

const Status_board = () => {
    const { t } = useTranslation(); 
    return(
    <div className='status-board'>
        <div className='where-when'>
            <div>
                <h5>1</h5>
            </div>
            <h6>{t('Pickup And Dropoff')}</h6>
        </div>
        <div className='where-when-status'></div>
        <div className='vehicle-select'>
            <div>
                <h5>2</h5>
            </div>
            <h6>{t('Vehicle Selection')}</h6>
        </div>
        <div className='vehicle-status'>
        </div>
        <div className='payment-confirmation'>
            <div>
                <h5>
                    3
                </h5>
            </div>
            <h6>
                {t('Payment & Confirmation')}
            </h6>
        </div>
    </div>
)}
export default Status_board;