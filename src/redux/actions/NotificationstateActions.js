
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const SELECT_NOTIFICATION = 'SELECT_NOTIFICATION';
export const TEMP_NOTIFICATION = 'TEMP_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const ADD_BADGE = 'ADD_BADGE';
export function Add_notification(notification) {
    return {
        type: ADD_NOTIFICATION,
        payload: notification
    }
};
export function add_badge(val){
    return{
        type:ADD_BADGE,
        payload:val
    }
}
export function select_notification(notification){
        return {
            type:SELECT_NOTIFICATION,
            payload:notification
        }  
   
}
export function new_notification(notification){
    return {
        type:NEW_NOTIFICATION,
        payload:notification
    }
}
export function update_notification(notification){
    return {
        type:UPDATE_NOTIFICATION,
        payload:notification
    }  

}
export function delete_notification(notification){
    return {
        type:DELETE_NOTIFICATION,
        payload:notification
    }  

}
export function save_temp_notification(notification){
    return{
        type:TEMP_NOTIFICATION,
        payload:notification
    }
}