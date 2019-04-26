import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onAuthError, requestUserName, logOut } from '../actions';
import unsplash from '../api/unsplash';
import './Auth.css';

const Auth = props => {
    useEffect(() => {
        const token = location.search.split('code=')[1];
        const error = location.search.split('error_description=')[1];
        const errorMsg = error ? error.replace(/\+/g, ' ') : '';

        if (errorMsg) {
            props.onAuthError(errorMsg);
        }

        if (token) {
            props.requestUserName(token);
        }
    }, []);

    const { isLoggedIn, userName } = props.auth;

    const handleClick = () => {
        isLoggedIn ? props.logOut() : authRequest();
    };

    const authRequest = () => {
        const authenticationUrl = unsplash.auth.getAuthenticationUrl([
            'public',
            'read_user',
            'write_likes',
        ]);

        location.assign(authenticationUrl);
    };

    const renderGreeting = () => {
        return isLoggedIn ? (
            <p className="auth__greeting">Hello, {userName}!</p>
        ) : null;
    };

    const modifClass = isLoggedIn ? 'logged-in' : 'logged-out';
    const buttonText = isLoggedIn ? 'Log out' : 'Log in';

    return (
        <div className={`${props.elemClass} auth`}>
            {renderGreeting()}
            <button
                onClick={handleClick}
                className={`auth__button button button--${modifClass}`}
                title="Unsplash"
            >
                {buttonText}
            </button>
        </div>
    );
};

Auth.propTypes = {
    elemClass: PropTypes.string.isRequired,
    auth: PropTypes.shape({
        isLoggedIn: PropTypes.bool.isRequired,
    }),
    onAuthError: PropTypes.func.isRequired,
    requestUserName: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        auth: state.auth,
    };
};

export default connect(
    mapStateToProps,
    { onAuthError, requestUserName, logOut }
)(Auth);
