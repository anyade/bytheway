import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearPhotos, setSearchTerm, searchPhotos } from '../actions';
import './SearchForm.css';

const SearchForm = props => {
    const [inputValue, setInputValue] = useState('');
    const [errorClass, setErrorClass] = useState(false);
    const input = React.createRef();

    const checkInput = input => {
        let flag = false;
        if (input.trim()) flag = true;
        return flag;
    };

    const handleChange = e => {
        setErrorClass(false);
        setInputValue(e.currentTarget.value);
    };

    const handleBlur = () => {
        if (errorClass) setErrorClass(false);
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (checkInput(inputValue)) {
            const pageNum = 1;

            props.setSearchTerm(inputValue);
            props.clearPhotos();
            props.searchPhotos(pageNum);

            setInputValue('');
            window.localStorage.setItem('pageNumSearch', pageNum + 1);
        } else {
            setErrorClass(true);
            input.current.focus();
        }
    };

    return (
        <form className={`${props.elemClass} form`} onSubmit={handleSubmit}>
            <input
                type="text"
                className={`form__input search-input ${errorClass &&
                    'search-input--invalid'}`}
                placeholder={`${
                    errorClass ? 'Enter some text' : 'Search photos'
                }`}
                title="Unsplash"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={input}
            />
            <button
                className={`form__button search-input__button ${errorClass &&
                    'search-input__button--invalid'}`}
                type="submit"
            >
                <svg
                    className="search-input__img"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 1000 1000"
                >
                    <path d="M977.2,977c-16.9,17-44.6,17-61.5,0L657.1,718.4c-68.3,54.9-154.8,87.9-249.1,87.9C188.1,806.3,10,628.1,10,408.3c0-219.9,178.1-398,397.9-398c219.8,0,398,178.2,398,398c0,94.1-32.8,180.3-87.4,248.4l258.7,258.7C994.3,932.5,994.3,960,977.2,977z M744.7,408.3c0-186-150.8-336.8-336.8-336.8C222,71.5,71.2,222.2,71.2,408.3c0,185.9,150.8,336.8,336.8,336.8C593.9,745.1,744.7,594.3,744.7,408.3z M407.9,194L407.9,194c-118.3,0-214.3,96-214.3,214.3l0,0c-9.9,0-20.2,0-30.6,0l0,0c0-135.3,109.6-244.9,244.9-244.9l0,0C407.9,173.9,407.9,184.1,407.9,194z" />
                </svg>
            </button>
        </form>
    );
};

SearchForm.propTypes = {
    elemClass: PropTypes.string.isRequired,
    clearPhotos: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    searchPhotos: PropTypes.func.isRequired,
};

export default connect(
    null,
    { clearPhotos, setSearchTerm, searchPhotos }
)(SearchForm);
