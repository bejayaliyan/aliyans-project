// export const ADD_BOOKING = 'ADD_BOOKING';
export const SELECT_VALUE = 'SELECT_VALUE';
// export const TEMP_BOOKING = 'TEMP_BOOKING';
// export function AddBooking(booking) {
//     return {
//         type: ADD_BOOKING,
//         payload: booking
//     }
// };
export function select_value(value) {
    return {
        type: SELECT_VALUE,
        payload: value
    }

}
// export function save_booking(booking){
//     return{
//         type:TEMP_BOOKING,
//         payload:booking
//     }
// }