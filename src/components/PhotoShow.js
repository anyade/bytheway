import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Downloader from 'js-file-downloader';
import { connect } from 'react-redux';
import {
    getPhoto,
    clearPhotos,
    clearError,
    likePhoto,
    unlikePhoto,
} from '../actions';
import unsplash from '../api/unsplash';
import './PhotoShow.css';

class PhotoShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenSizeRatio: 1,
            authError: false,
            fullSize: false,
        };
        this.prompt = React.createRef();
        this.darkenBackground = React.createRef();
    }

    componentDidMount() {
        this.props.getPhoto(this.props.match.params.id);

        this.setState({
            screenSizeRatio:
                (document.documentElement.clientWidth - 40) /
                (document.documentElement.clientHeight - 120),
        });

        window.addEventListener('keydown', this.handleEsc);
        window.addEventListener('resize', this.resizeEnqueue);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleEsc);
        window.removeEventListener('resize', this.resizeEnqueue);
    }

    resizeTimeout = null;
    resizeEnqueue = () => {
        if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(() => {
                this.resizeTimeout = null;
                this.handleResize();
            }, 100);
        }
    };

    handleResize = () => {
        this.setState({
            screenSizeRatio:
                (document.documentElement.clientWidth - 40) /
                (document.documentElement.clientHeight - 120),
        });
    };

    handleEsc = e => {
        if (e.keyCode === 27) {
            if (this.state.authError) {
                this.handleAuthErrorClose();
            } else {
                this.handleExit();
            }
        }
    };

    setPhotoStyle = (photoWidth, photoHeight) => {
        if (document.documentElement.clientHeight < 550) {
            return {
                width: '320px',
                height: 'auto',
            };
        } else if (this.state.screenSizeRatio > photoWidth / photoHeight) {
            return {
                height: 'calc(100vh - 120px)',
                width: 'auto',
            };
        } else
            return {
                width: 'calc(100vw - 40px)',
                height: 'auto',
            };
    };

    handleExit = () => {
        const { photos, clearPhotos, error, clearError, history } = this.props;
        const scrollWidth = +window.localStorage.getItem('scrollWidth');

        document.body.classList.remove('disable-scroll');
        document.body.style.marginRight = `-${scrollWidth}px`;

        if (error) clearError();
        if (photos.length === 1) {
            clearPhotos();
        }
        history.push('/');
    };

    handleLikeClick = () => {
        const { isLoggedIn, photo, unlikePhoto, likePhoto, match } = this.props;

        if (isLoggedIn) {
            if (photo.liked_by_user) {
                unlikePhoto(match.params.id);
            } else likePhoto(match.params.id);
        } else {
            this.setState({
                authError: true,
            });
        }
    };

    handleAuthErrorClose = () => {
        this.prompt.current.style.opacity = '0';
        this.darkenBackground.current.style.opacity = '0';
        setTimeout(() => {
            this.setState({
                authError: false,
            });
        }, 1000);
    };

    getFormattedDate = dateString => {
        const options = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };

        const formattedDate = `${dateString.slice(0, -6)}.000${dateString.slice(
            -6
        )}`;
        const mls = Date.parse(formattedDate);
        const date = new Date(mls).toLocaleString('en-US', options);
        return date;
    };

    downloadPhoto = url => {
        new Downloader({
            url: url,
            filename: 'unsplash_photo.jpg',
        });

        unsplash.photos.downloadPhoto(this.props.photo);
    };

    renderPhoto = () => {
        const {
            user,
            urls,
            alt_description,
            width,
            height,
            created_at,
            likes,
            liked_by_user,
        } = this.props.photo;

        return (
            <div
                className="photo-show__wrapper"
                onClick={e => e.stopPropagation()}
            >
                <div className="photo-show__top-wrapper">
                    <div className="photo-show__author author">
                        <a
                            className="author__link author__link--img"
                            href={user.links.html}
                            title={`Go to ${
                                user.first_name
                            }'s Unsplash profile`}
                        >
                            <img
                                className="author__avatar"
                                src={user.profile_image.small}
                                alt={`${user.first_name} avatar`}
                            />
                        </a>
                        <a
                            className="author__link author__link--black author__link--name"
                            href={user.links.html}
                            title={`Go to ${
                                user.first_name
                            }'s Unsplash profile`}
                        >
                            {user.first_name}
                        </a>
                    </div>
                    <button
                        className="photo-show__download button button--svg-icon"
                        title="Download photo"
                        onClick={() => this.downloadPhoto(urls.full)}
                    >
                        <svg
                            className="button__icon"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 511.999 511.999"
                        >
                            <path d="M356.3,326.92l-85.561-85.561c-3.88-3.879-9.141-6.058-14.626-6.058c-5.486,0-10.747,2.179-14.626,6.058l-85.561,85.561    c-8.078,8.078-8.078,21.175,0,29.253c8.077,8.078,21.175,8.078,29.253,0l70.935-70.935l70.935,70.935    c4.039,4.039,9.332,6.058,14.626,6.058c5.292,0,10.587-2.021,14.626-6.058C364.377,348.094,364.377,334.998,356.3,326.92z" />
                            <path d="M256.113,235.299c-11.423,0-20.685,9.261-20.685,20.685v192.512c0,11.424,9.261,20.685,20.685,20.685    c11.423,0,20.684-9.261,20.685-20.686V255.984C276.798,244.561,267.536,235.299,256.113,235.299z" />
                            <path d="M496.447,237.67c-22.359-41.013-65.268-66.51-111.994-66.541H372.82C340.25,78.109,240.93,23.837,143.817,48.946    C41.422,75.419-20.346,180.262,6.129,282.657c7.532,29.135,22.046,56.453,41.973,79.003c7.565,8.562,20.637,9.367,29.197,1.803    c8.56-7.565,9.367-20.637,1.802-29.198c-15.629-17.686-27.013-39.112-32.921-61.962c-10.058-38.904-4.364-79.397,16.033-114.018    c20.398-34.621,53.057-59.228,91.96-69.286c80.309-20.764,162.54,27.682,183.305,107.993c2.361,9.129,10.597,15.507,20.026,15.507    h26.938c31.572,0.021,60.574,17.255,75.686,44.974c22.768,41.765,7.314,94.267-34.451,117.036    c-10.031,5.468-13.728,18.031-8.26,28.061c3.754,6.887,10.852,10.787,18.179,10.787c3.344,0,6.74-0.814,9.882-2.527    C507.269,377.142,530.135,299.463,496.447,237.67z" />
                            <path d="M356.3,326.92l-85.561-85.561c-3.88-3.879-9.141-6.058-14.626-6.058c-5.486,0-10.747,2.179-14.626,6.058l-85.561,85.561    c-8.078,8.078-8.078,21.175,0,29.253c8.077,8.078,21.175,8.078,29.253,0l70.935-70.935l70.935,70.935    c4.039,4.039,9.332,6.058,14.626,6.058c5.292,0,10.587-2.021,14.626-6.058C364.377,348.094,364.377,334.998,356.3,326.92z" />
                        </svg>
                    </button>
                    <button
                        className="photo-show__close-btn close-btn"
                        type="button"
                        title="Close photo"
                        onClick={this.handleExit}
                    >
                        Back to main
                    </button>
                </div>
                <picture className="photo-show__img">
                    <source media="(max-width: 400px)" srcSet={urls.small} />
                    <source media="(min-width: 401px)" srcSet={urls.regular} />
                    <img
                        srcSet={urls.regular}
                        alt={alt_description || 'Unsplash photo'}
                        style={
                            this.state.fullSize
                                ? {
                                      width: '100%',
                                      height: 'auto',
                                      cursor: 'zoom-out',
                                  }
                                : this.setPhotoStyle(width, height)
                        }
                        title={this.state.fullSize ? 'Zoom-out' : 'Zoom-in'}
                        onClick={
                            this.state.fullSize
                                ? () => {
                                      this.setState({ fullSize: false });
                                  }
                                : () => {
                                      this.setState({ fullSize: true });
                                  }
                        }
                    />
                </picture>
                <div className="photo-show__bottom-wrapper">
                    <p className="photo-show__creation-date date">
                        {this.getFormattedDate(created_at)}
                    </p>
                    <div className="photo-show__likes likes">
                        <button
                            className={
                                liked_by_user
                                    ? 'likes__button likes__button--liked'
                                    : 'likes__button'
                            }
                            title={
                                liked_by_user ? 'Unlike photo' : 'Like photo'
                            }
                            onClick={this.handleLikeClick}
                        >
                            <svg
                                className="likes__icon likes__icon--large"
                                version="1.1"
                                viewBox="0 0 32 32"
                                width="15"
                                height="15"
                            >
                                <path d="M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z" />
                            </svg>
                        </button>
                        <p className="likes__counter">
                            {liked_by_user
                                ? `You and ${likes - 1} more`
                                : `${likes}`}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    renderAuthError = () => {
        return (
            <div
                className="photo-show__prompt prompt"
                ref={this.prompt}
                onClick={e => e.stopPropagation()}
            >
                <p className="prompt__msg">You need to log in to like photo</p>
                <button
                    className="prompt__button close-btn"
                    type="button"
                    onClick={this.handleAuthErrorClose}
                >
                    Close
                </button>
            </div>
        );
    };

    renderLoadingError = () => {
        return (
            <p className="error-msg error-msg--photo">
                {this.props.errorMsg}
                <button
                    className="error-msg__close"
                    type="button"
                    onClick={this.handleExit}
                >
                    <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                    >
                        <path d="M 16 3 C 8.8321429 3 3 8.8321429 3 16 C 3 23.167857 8.8321429 29 16 29 C 23.167857 29 29 23.167857 29 16 C 29 8.8321429 23.167857 3 16 3 z M 16 5 C 22.086977 5 27 9.9130231 27 16 C 27 22.086977 22.086977 27 16 27 C 9.9130231 27 5 22.086977 5 16 C 5 9.9130231 9.9130231 5 16 5 z M 12.21875 10.78125 L 10.78125 12.21875 L 14.5625 16 L 10.78125 19.78125 L 12.21875 21.21875 L 16 17.4375 L 19.78125 21.21875 L 21.21875 19.78125 L 17.4375 16 L 21.21875 12.21875 L 19.78125 10.78125 L 16 14.5625 L 12.21875 10.78125 z" />
                    </svg>
                </button>
            </p>
        );
    };

    render() {
        const { photo, isFetching, error } = this.props;
        const { fullSize } = this.state;
        const marginTop =
            document.documentElement.clientHeight < 550
                ? { marginTop: '10px' }
                : null;

        return ReactDOM.createPortal(
            <section className="photo-show" onClick={this.handleExit}>
                <h1 className="photo-show__title visually-hidden">
                    Single photo view
                </h1>
                <div
                    className={
                        fullSize
                            ? 'photo-show__card photo-show__card--full-size'
                            : 'photo-show__card'
                    }
                    style={marginTop}
                >
                    {!photo && error && this.renderLoadingError()}
                    {!photo && isFetching && (
                        <p className="photo-show__loading-text">
                            Fetching photo...
                        </p>
                    )}
                    {photo && this.renderPhoto()}
                    {this.state.authError && this.renderAuthError()}
                </div>
                {this.state.authError && (
                    <div
                        className="prompt__bg"
                        ref={this.darkenBackground}
                        onClick={e => e.stopPropagation()}
                    />
                )}
            </section>,
            document.querySelector('#modal')
        );
    }
}

PhotoShow.propTypes = {
    photo: PropTypes.object.isRequired,
    photos: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    getPhoto: PropTypes.func.isRequired,
    clearPhotos: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    likePhoto: PropTypes.func.isRequired,
    unlikePhoto: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return {
        photo: state.photos.photos.filter(
            item => item.id === ownProps.match.params.id
        )[0],
        photos: state.photos.photos,
        isFetching: state.photos.isFetching,
        error: state.photos.error,
        errorMsg: state.photos.errorMsg,
        isLoggedIn: state.auth.isLoggedIn,
    };
};

export default connect(
    mapStateToProps,
    { getPhoto, clearPhotos, clearError, likePhoto, unlikePhoto }
)(PhotoShow);
