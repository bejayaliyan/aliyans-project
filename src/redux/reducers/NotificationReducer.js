import {
    NEW_NOTIFICATION,
    ADD_NOTIFICATION,
    SELECT_NOTIFICATION,
    TEMP_NOTIFICATION,
    UPDATE_NOTIFICATION,
    DELETE_NOTIFICATION,
    ADD_BADGE
} from '../actions/NotificationstateActions';


const initialState = {
    notification:[],
    newMessage:false
};


// REDUCER

export const NotificationReducer = (state=initialState, action) => {
    switch(action.type) {
        case ADD_BADGE:
            return{
                ...state,
                newMessage:action.payload
            }
        case ADD_NOTIFICATION:
            return {
                ...state,
                notification:action.payload
            };
        case SELECT_NOTIFICATION:
            return {
                ...state,
                notification:action.payload
            }
        case UPDATE_NOTIFICATION:
            return {
                ...state,
                notification:action.payload
            }
        case DELETE_NOTIFICATION:
            return {
                ...state,
                notification:action.payload
            }
        case TEMP_NOTIFICATION:
            return {
                ...state,
                temp_notification:action.payload
            }
        default:
            return state;
    }
};