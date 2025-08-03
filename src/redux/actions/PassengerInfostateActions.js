
export const ADD_PASSENGER_INFO = 'ADD_PASSENGER_INFO';
export const SELECT_PASSENGER_INFO = 'SELECT_PASSENGER_INFO';
export const TEMP_PASSENGER_INFO = 'TEMP_PASSENGER_INFO';
export const UPDATE_PASSENGER_INFO = 'UPDATE_PASSENGER_INFO';
export const DELETE_PASSENGER_INFO = 'DELETE_PASSENGER_INFO';

export function Add_passenger_info(passenger_info) {
    return {
        type: ADD_PASSENGER_INFO,
        payload: passenger_info
    }
};
export function select_passenger_info(passenger_info){
        return {
            type:SELECT_PASSENGER_INFO,
            payload:passenger_info
        }  
   
}
export function update_passenger_info(passenger_info){
    return {
        type:UPDATE_PASSENGER_INFO,
        payload:passenger_info
    }  

}
export function delete_passenger_info(passenger_info){
    return {
        type:DELETE_PASSENGER_INFO,
        payload:passenger_info
    }  

}
export function save_temp_passenger_info(passenger_info){
    return{
        type:TEMP_PASSENGER_INFO,
        payload:passenger_info
    }
}