import {
    FETCH_PHOTOS,
    FETCH_PHOTOS_SUCCESS,
    FETCH_PHOTOS_FAIL,
    SET_SEARCH_TERM,
    RESET_SEARCH,
    CLEAR_PHOTOS,
    FETCH_PHOTO_SUCCESS,
    CLEAR_ERROR,
    LIKE_PHOTO,
    UNLIKE_PHOTO,
} from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    photos: [],
    error: false,
    errorMsg: '',
    searchTerm: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PHOTOS:
            return {
                ...state,
                isFetching: true,
                error: false,
                errorMsg: '',
            };

        case FETCH_PHOTOS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                photos: [...state.photos, ...action.payload],
            };

        case FETCH_PHOTOS_FAIL:
            return {
                ...state,
                isFetching: false,
                error: true,
                errorMsg: action.payload,
            };

        case CLEAR_PHOTOS:
            return {
                ...state,
                photos: [],
            };

        case SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
            };

        case RESET_SEARCH:
            return {
                ...state,
                isFetching: false,
                photos: [],
                error: false,
                errorMsg: '',
                searchTerm: '',
            };

        case FETCH_PHOTO_SUCCESS:
            return {
                ...state,
                isFetching: false,
                photos: [...state.photos, action.payload],
            };

        case CLEAR_ERROR:
            return {
                ...state,
                error: false,
                errorMsg: '',
            };

        case LIKE_PHOTO:
            return {
                ...state,
                photos: state.photos.map(photo => {
                    if (photo.id === action.payload.id) {
                        photo.likes = action.payload.likes;
                        photo.liked_by_user = true;
                    }
                    return photo;
                }),
            };

        case UNLIKE_PHOTO:
            return {
                ...state,
                photos: state.photos.map(photo => {
                    if (photo.id === action.payload.id) {
                        photo.likes = action.payload.likes;
                        photo.liked_by_user = false;
                    }
                    return photo;
                }),
            };

        default:
            return state;
    }
};
