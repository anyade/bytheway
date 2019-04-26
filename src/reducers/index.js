import { combineReducers } from 'redux';
import authReducer from './authReducer';
import photosReducer from './photosReducer';

export default combineReducers({
    auth: authReducer,
    photos: photosReducer,
});
