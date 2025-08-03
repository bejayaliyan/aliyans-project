import {
    ADD_PASSENGER_INFO,SELECT_PASSENGER_INFO,TEMP_PASSENGER_INFO,UPDATE_PASSENGER_INFO,DELETE_PASSENGER_INFO
} from '../actions/PassengerInfostateActions';


const initialState = {
    passenger_info:[],
};


// REDUCER

export const PassengerInfoReducer = (state=initialState, action) => {
    switch(action.type) {
        case ADD_PASSENGER_INFO:
            return {
                ...state,
                passenger:action.payload
            };
        case SELECT_PASSENGER_INFO:
            return {
                ...state,
                notification:action.payload
            }
        case UPDATE_PASSENGER_INFO:
            return {
                ...state,
                notification:action.payload
            }
        case DELETE_PASSENGER_INFO:
            return {
                ...state,
                notification:action.payload
            }
        case TEMP_PASSENGER_INFO:
            return {
                ...state,
                temp_notification:action.payload
            }
        default:
            return state;
    }
};