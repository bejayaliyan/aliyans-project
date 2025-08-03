import {
    ADD_VEHICLE,SELECT_VEHICLE,TEMP_VEHICLE,UPDATE_VEHICLE,DELETE_VEHICLE
} from '../actions/VehiclestateActions';


const initialState = {
    vehicle:[],
    temp_vehicle:[]
};


// REDUCER

export const VehicleReducer = (state=initialState, action) => {
    switch(action.type) {
        case ADD_VEHICLE:
            return {
                ...state,
                vehicle:action.payload
            };
        case SELECT_VEHICLE:
            return {
                ...state,
                vehicle:action.payload
            }
        case UPDATE_VEHICLE:
            return {
                ...state,
                vehicle:action.payload
            }
        case DELETE_VEHICLE:
            return {
                ...state,
                vehicle:action.payload
            }
        case TEMP_VEHICLE:
            return {
                ...state,
                temp_vehicle:action.payload
            }
        default:
            return state;
    }
};