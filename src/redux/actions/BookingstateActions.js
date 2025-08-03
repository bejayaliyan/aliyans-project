
export const ADD_BOOKING = 'ADD_BOOKING';
export const SELECT_BOOKING = 'SELECT_BOOKING';
export const TEMP_BOOKING = 'TEMP_BOOKING';
export function AddBooking(booking) {
    return {
        type: ADD_BOOKING,
        payload: booking
    }
};
export function select_booking(booking){
        return {
            type:SELECT_BOOKING,
            payload:booking
        }  
   
}
export function save_booking(booking){
    return{
        type:TEMP_BOOKING,
        payload:booking
    }
}