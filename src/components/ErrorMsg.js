import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideError } from '../actions';
import './ErrorMsg.css';

const ErrorMsg = ({ error, errIsShown, hideError }) => {
    const scrollWidth = +window.localStorage.getItem('scrollWidth');
    const documentWidth = document.body.clientWidth + scrollWidth;
    const containerStyle =
        documentWidth < 1269
            ? { marginRight: `calc(3% + ${scrollWidth}px)` }
            : null;

    const renderError =
        error.length > 0 && errIsShown ? (
            <div className="central-container" style={containerStyle}>
                <p className="error-msg">
                    Authorization error. {error}
                    <button className="error-msg__close" onClick={hideError}>
                        <svg
                            className="icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                        >
                            <path d="M 16 3 C 8.8321429 3 3 8.8321429 3 16 C 3 23.167857 8.8321429 29 16 29 C 23.167857 29 29 23.167857 29 16 C 29 8.8321429 23.167857 3 16 3 z M 16 5 C 22.086977 5 27 9.9130231 27 16 C 27 22.086977 22.086977 27 16 27 C 9.9130231 27 5 22.086977 5 16 C 5 9.9130231 9.9130231 5 16 5 z M 12.21875 10.78125 L 10.78125 12.21875 L 14.5625 16 L 10.78125 19.78125 L 12.21875 21.21875 L 16 17.4375 L 19.78125 21.21875 L 21.21875 19.78125 L 17.4375 16 L 21.21875 12.21875 L 19.78125 10.78125 L 16 14.5625 L 12.21875 10.78125 z" />
                        </svg>
                    </button>
                </p>
            </div>
        ) : null;

    return <>{renderError}</>;
};

ErrorMsg.propTypes = {
    error: PropTypes.string.isRequired,
    errIsShown: PropTypes.bool.isRequired,
    hideError: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        errIsShown: state.auth.errIsShown,
    };
};

export default connect(
    mapStateToProps,
    { hideError }
)(ErrorMsg);
