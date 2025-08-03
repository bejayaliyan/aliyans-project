
export const ADD_VEHICLE = 'ADD_VEHICLE';
export const SELECT_VEHICLE = 'SELECT_VEHICLE';
export const TEMP_VEHICLE = 'TEMP_VEHICLE';
export const UPDATE_VEHICLE = 'UPDATE_VEHICLE';
export const DELETE_VEHICLE = 'DELETE_VEHICLE';

export function AddBooking(vehicle) {
    return {
        type: ADD_VEHICLE,
        payload: vehicle
    }
};
export function select_vehicle(vehicle){
        return {
            type:SELECT_VEHICLE,
            payload:vehicle
        }  
   
}
export function update_vehicle(vehicle){
    return {
        type:UPDATE_VEHICLE,
        payload:vehicle
    }  

}
export function delete_vehicle(vehicle){
    return {
        type:DELETE_VEHICLE,
        payload:vehicle
    }  

}
export function save_temp_vehicle(vehicle){
    return{
        type:TEMP_VEHICLE,
        payload:vehicle
    }
}