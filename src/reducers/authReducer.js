import {
    AUTH_FAILED,
    AUTH_SUCCESS,
    HIDE_ERROR,
    LOG_OUT,
} from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userName: '',
    error: '',
    errIsShown: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userName: action.payload,
            };

        case AUTH_FAILED:
            return {
                ...state,
                error: action.payload,
                errIsShown: true,
            };

        case HIDE_ERROR:
            return {
                ...state,
                errIsShown: false,
            };

        case LOG_OUT:
            return {
                ...state,
                isLoggedIn: false,
                userName: '',
            };

        default:
            return state;
    }
};
