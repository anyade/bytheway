import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './PhotoCard.css';

const PhotoCard = ({ photo, elemClass }) => {
    const { id, alt_description, created_at, likes, urls, user } = photo;

    const getFormattedDate = dateString => {
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

    const disableScroll = () => {
        document.body.classList.add('disable-scroll');
        document.body.style.marginRight = '0';
    };

    return (
        <div className={`${elemClass} card`}>
            <div className="card__author author author--gradient-bg">
                <a
                    className="author__link author__link--img"
                    href={user.links.html}
                    title={`Go to ${user.first_name}'s Unsplash profile`}
                >
                    <img
                        className="author__avatar"
                        src={user.profile_image.small}
                        alt={`${user.first_name} avatar`}
                    />
                </a>
                <a
                    className="author__link author__link--name"
                    href={user.links.html}
                    title={`Go to ${user.first_name}'s Unsplash profile`}
                >
                    {user.first_name}
                </a>
            </div>
            <Link
                className="card__link"
                to={{
                    pathname: `/photos/${id}`,
                    state: { modal: true },
                }}
                title={`View the photo by ${user.first_name}`}
                onClick={disableScroll}
            >
                <picture className="card__img">
                    <source media="(max-width: 400px)" srcSet={urls.small} />
                    <source media="(max-width: 499px)" srcSet={urls.regular} />
                    <source media="(min-width: 500px)" srcSet={urls.small} />
                    <img
                        srcSet={urls.small}
                        alt={alt_description || 'Unsplash photo'}
                    />
                </picture>
            </Link>
            <div className="card__bottom-wrapper">
                <p className="card__creation-date date">
                    {getFormattedDate(created_at)}
                </p>
                <div className="card__likes likes">
                    <svg
                        className="likes__icon"
                        version="1.1"
                        viewBox="0 0 32 32"
                        width="15"
                        height="15"
                    >
                        <path d="M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z" />
                    </svg>
                    <p className="likes__counter">{likes}</p>
                </div>
            </div>
        </div>
    );
};

PhotoCard.propTypes = {
    photo: PropTypes.object.isRequired,
    elemClass: PropTypes.string.isRequired,
};

export default PhotoCard;
