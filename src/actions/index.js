import unsplash from '../api/unsplash';
import history from '../history';
import {
    AUTH_FAILED,
    AUTH_SUCCESS,
    HIDE_ERROR,
    LOG_OUT,
    FETCH_PHOTOS,
    FETCH_PHOTOS_SUCCESS,
    FETCH_PHOTOS_FAIL,
    CLEAR_PHOTOS,
    SET_SEARCH_TERM,
    RESET_SEARCH,
    FETCH_PHOTO_SUCCESS,
    CLEAR_ERROR,
    LIKE_PHOTO,
    UNLIKE_PHOTO,
} from './actionTypes';

export const onAuthError = errorMsg => {
    history.push('/');
    return {
        type: AUTH_FAILED,
        payload: errorMsg,
    };
};

export const requestUserName = token => dispatch => {
    unsplash.auth
        .userAuthentication(token)
        .then(res => {
            if (!res.ok) {
                throw new Error(
                    'Failed to get access token. Please try again later'
                );
            } else return res.json();
        })
        .then(data => {
            unsplash.auth.setBearerToken(data.access_token);
        })
        .then(() => {
            unsplash.currentUser
                .profile()
                .then(res => {
                    if (!res.ok) {
                        throw new Error(
                            'Failed to get access to your private profile. Please try to log in again'
                        );
                    } else return res.json();
                })
                .then(profile => {
                    dispatch({
                        type: AUTH_SUCCESS,
                        payload: profile.first_name,
                    });
                });
        })
        .catch(error => {
            dispatch({
                type: AUTH_FAILED,
                payload: error.message,
            });
        });

    history.push('/');
};

export const hideError = () => {
    return {
        type: HIDE_ERROR,
    };
};

export const logOut = () => {
    return {
        type: LOG_OUT,
    };
};

export const getPhotos = pageNum => dispatch => {
    dispatch({
        type: FETCH_PHOTOS,
    });

    unsplash.photos
        .listPhotos(pageNum, 12, 'latest')
        .then(res => {
            if (!res.ok) {
                throw new Error(
                    'Failed to fetch photos. Please, try again later'
                );
            } else return res.json();
        })
        .then(photos => {
            dispatch({
                type: FETCH_PHOTOS_SUCCESS,
                payload: photos,
            });
        })
        .catch(error => {
            dispatch({
                type: FETCH_PHOTOS_FAIL,
                payload: error.message,
            });
        });
};

let totalFoundPages = 1;

export const searchPhotos = pageNum => (dispatch, getState) => {
    if (pageNum <= totalFoundPages) {
        dispatch({
            type: FETCH_PHOTOS,
        });

        const searchTerm = getState().photos.searchTerm;

        unsplash.search
            .photos(searchTerm, pageNum, 12)
            .then(res => {
                if (!res.ok) {
                    throw new Error(
                        'Failed to fetch photos. Please, try again later'
                    );
                } else return res.json();
            })
            .then(photos => {
                if (!photos.results.length) {
                    throw new Error('No results found :(');
                } else {
                    totalFoundPages = photos.total_pages;
                    dispatch({
                        type: FETCH_PHOTOS_SUCCESS,
                        payload: photos.results,
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: FETCH_PHOTOS_FAIL,
                    payload: error.message,
                });
            });
    } else {
        dispatch({
            type: FETCH_PHOTOS_FAIL,
            payload: 'No more photos available so far :(',
        });
    }
};

export const clearPhotos = () => {
    return {
        type: CLEAR_PHOTOS,
    };
};

export const setSearchTerm = searchTerm => {
    return {
        type: SET_SEARCH_TERM,
        payload: searchTerm,
    };
};

export const resetSearch = () => {
    return {
        type: RESET_SEARCH,
    };
};

export const getPhoto = id => (dispatch, getState) => {
    const photos = getState().photos.photos;

    if (!photos.length) {
        dispatch({
            type: FETCH_PHOTOS,
        });

        unsplash.photos
            .getPhoto(id)
            .then(res => {
                if (!res.ok) {
                    throw new Error(
                        'Failed to fetch photo. Please, try again later'
                    );
                } else return res.json();
            })
            .then(photo => {
                dispatch({
                    type: FETCH_PHOTO_SUCCESS,
                    payload: photo,
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_PHOTOS_FAIL,
                    payload: error.message,
                });
            });
    }
};

export const clearError = () => {
    return {
        type: CLEAR_ERROR,
    };
};

export const likePhoto = id => dispatch => {
    unsplash.photos
        .likePhoto(id)
        .then(res => res.json())
        .then(data => {
            dispatch({
                type: LIKE_PHOTO,
                payload: {
                    id,
                    likes: data.photo.likes,
                },
            });
        });
};

export const unlikePhoto = id => dispatch => {
    unsplash.photos
        .unlikePhoto(id)
        .then(res => res.json())
        .then(data => {
            dispatch({
                type: UNLIKE_PHOTO,
                payload: {
                    id,
                    likes: data.photo.likes,
                },
            });
        });
};
