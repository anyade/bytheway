import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../history';
import { resetSearch, getPhotos } from '../actions';
import SearchForm from './SearchForm';
import Auth from './Auth';
import ErrorMsg from './ErrorMsg';
import './Header.css';

const Header = props => {
    const handleLogoClick = () => {
        props.resetSearch();

        history.push('/');

        const pageNum = 1;
        props.getPhotos(pageNum);
        window.localStorage.setItem('pageNumLatest', pageNum + 1);
    };

    return (
        <header className="header">
            <div className="header__main">
                <div className="central-container">
                    <div className="header__wrapper">
                        <a
                            className="header__logo logo"
                            title="Back to Latest photos"
                            onClick={handleLogoClick}
                        >
                            <p className="logo__text">
                                By the <span>W</span>ay
                            </p>
                            <p className="logo__moto">
                                inspiration in photography
                            </p>
                        </a>
                        <div className="header__user-nav">
                            <SearchForm elemClass="header__form" />
                            <Auth elemClass="header__auth" />
                        </div>
                    </div>
                </div>
            </div>
            <ErrorMsg />
        </header>
    );
};

Header.propTypes = {
    resetSearch: PropTypes.func.isRequired,
    getPhotos: PropTypes.func.isRequired,
};

export default connect(
    null,
    { getPhotos, resetSearch }
)(Header);
