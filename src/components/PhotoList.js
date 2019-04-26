import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPhotos, searchPhotos } from '../actions';
import PhotoCard from './PhotoCard';
import ScrollToTopBtn from './ScrollToTopBtn';
import './PhotoList.css';

class PhotoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientWidth: undefined,
        };
        this.container = React.createRef();
    }

    componentDidMount() {
        const scrollWidth = +window.localStorage.getItem('scrollWidth');
        this.setClientWidth(scrollWidth);

        if (!this.props.photos.length) {
            const pageNum = 1;
            this.props.getPhotos(pageNum);
            window.localStorage.setItem('pageNumLatest', pageNum + 1);
        }

        window.addEventListener('scroll', this.infiniteScroll);
        window.addEventListener('resize', this.resizeEnqueue);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.infiniteScroll);
        window.removeEventListener('resize', this.resizeEnqueue);
    }

    resizeTimeout = null;
    resizeEnqueue = () => {
        if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(() => {
                this.resizeTimeout = null;
                this.setClientWidth(0);
            }, 100);
        }
    };

    setClientWidth = scrollWidth => {
        const clientWidth = this.container.current.clientWidth - scrollWidth;
        this.setState({ clientWidth });
    };

    infiniteScroll = () => {
        const scroll = Math.ceil(
            (document.documentElement.scrollTop || document.body.scrollTop) +
                document.documentElement.clientHeight
        );

        if (
            scroll >= document.documentElement.scrollHeight * 0.8 &&
            !this.props.isFetching
        ) {
            if (this.props.searchTerm) {
                if (
                    this.props.errorMsg === 'No more photos available so far :('
                ) {
                    return;
                } else {
                    const pageNum = +window.localStorage.getItem(
                        'pageNumSearch'
                    );
                    this.props.searchPhotos(pageNum);

                    window.localStorage.setItem('pageNumSearch', pageNum + 1);
                }
            } else {
                const pageNum = +window.localStorage.getItem('pageNumLatest');
                this.props.getPhotos(pageNum);

                window.localStorage.setItem('pageNumLatest', pageNum + 1);
            }
        }
    };

    renderColumn = (colNum, arr, startIndex) => {
        let i = startIndex;
        let step = colNum;
        const column = [];

        for (i; i < arr.length; i += step) {
            column.push(arr[i]);
        }

        return column;
    };

    renderPhotos = () => {
        const { photos } = this.props;
        const colNumber =
            this.state.clientWidth === 'undefined'
                ? 0
                : this.state.clientWidth <= 450
                ? 1
                : this.state.clientWidth <= 800
                ? 2
                : 3;

        const column1 = this.renderColumn(colNumber, photos, 0);
        const column2 =
            colNumber > 1 ? this.renderColumn(colNumber, photos, 1) : null;
        const column3 =
            colNumber > 2 ? this.renderColumn(colNumber, photos, 2) : null;

        const colWidth =
            colNumber === 1
                ? '100%'
                : colNumber === 2
                ? 'calc(50% - 6px)'
                : 'calc(33.33% - 8px)';

        return (
            <div className="photos__wrapper" ref={this.container}>
                {column1 && (
                    <div
                        className="photos__column"
                        style={{ width: `${colWidth}` }}
                    >
                        {column1.map(photo => (
                            <PhotoCard
                                elemClass="photos__card"
                                key={photo.id}
                                photo={photo}
                            />
                        ))}
                    </div>
                )}
                {column2 && (
                    <div
                        className="photos__column"
                        style={{ width: `${colWidth}` }}
                    >
                        {column2.map(photo => (
                            <PhotoCard
                                elemClass="photos__card"
                                key={photo.id}
                                photo={photo}
                            />
                        ))}
                    </div>
                )}
                {column3 && (
                    <div
                        className="photos__column"
                        style={{ width: `${colWidth}` }}
                    >
                        {column3.map(photo => (
                            <PhotoCard
                                elemClass="photos__card"
                                key={photo.id}
                                photo={photo}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { isFetching, searchTerm, error, errorMsg } = this.props;
        const title = searchTerm
            ? `${searchTerm[0].toUpperCase()}${searchTerm.slice(1)}`
            : 'Latest photos';

        return (
            <section className="photos">
                <div className="central-container">
                    <h1 className="photos__title">{title}</h1>
                    {this.renderPhotos()}
                    {isFetching && (
                        <div className="photos__loading-text">
                            Fetching photos...
                        </div>
                    )}
                    {error && (
                        <div className="photos__error-text">{errorMsg}</div>
                    )}
                    <ScrollToTopBtn />
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        photos: state.photos.photos,
        isFetching: state.photos.isFetching,
        searchTerm: state.photos.searchTerm,
        error: state.photos.error,
        errorMsg: state.photos.errorMsg,
    };
};

PhotoList.propTypes = {
    photos: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
    error: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
    getPhotos: PropTypes.func.isRequired,
    searchPhotos: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    { getPhotos, searchPhotos }
)(PhotoList);
