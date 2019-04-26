import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import PhotoList from './PhotoList';
import PhotoShow from './PhotoShow';
import './App.css';

class App extends React.Component {
    previousLocation = this.props.location;

    componentDidMount() {
        const scrollWidth = this.getScrollWidth();

        this.adjustDocumentForScroll(scrollWidth);
        window.localStorage.setItem('scrollWidth', scrollWidth);
    }

    componentDidUpdate(prevProps) {
        let { location } = prevProps;

        if (
            this.props.history.action !== 'POP' &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = location;
        } else this.previousLocation = this.props.location;
    }

    getScrollWidth = () => {
        const div = document.createElement('div');
        div.style.width = '30px';
        div.style.height = '30px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        const scrollWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);

        return scrollWidth;
    };

    adjustDocumentForScroll = scrollWidth => {
        const documentWidth = document.body.clientWidth + scrollWidth;

        if (documentWidth < 1269) {
            const containers = document.querySelectorAll('.central-container');
            for (let container of containers) {
                container.style.marginRight = `calc(3% + ${scrollWidth}px)`;
            }
        }

        document.body.style.marginRight = `-${scrollWidth}px`;
    };

    render() {
        let { location } = this.props;

        let isModal = !!(
            location.state &&
            location.state.modal &&
            this.previousLocation !== location
        );

        return (
            <>
                <Header />
                <Switch location={isModal ? this.previousLocation : location}>
                    <Route path="/" exact component={PhotoList} />
                    <Route path="/photos/:id" exact component={PhotoShow} />
                </Switch>
                {isModal && <Route path="/photos/:id" component={PhotoShow} />}
            </>
        );
    }
}

App.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default App;
