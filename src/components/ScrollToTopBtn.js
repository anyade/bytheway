import React from 'react';
import './ScrollToTopBtn.css';

class ScrollToTopBtn extends React.Component {
    state = {
        clientHeight: 0,
        isShown: false,
    };

    componentDidMount() {
        this.setState({
            clientHeight: document.documentElement.clientHeight,
        });

        window.addEventListener('scroll', this.setVisibility);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.setVisibility);
    }

    setVisibility = () => {
        if (window.pageYOffset > this.state.clientHeight) {
            this.setState({
                isShown: true,
            });
        } else {
            this.setState({
                isShown: false,
            });
        }
    };

    handleScrollToTop = () => {
        if (window.pageYOffset > 0) {
            window.scrollBy(0, -50);
            setTimeout(this.handleScrollToTop, 0);
        }
    };

    render() {
        const modifier = this.state.isShown ? 'shown' : 'hidden';

        return (
            <button
                className={`scroll-btn scroll-btn--${modifier}`}
                type="button"
                title="Back to top"
                ref={this.button}
                onClick={this.handleScrollToTop}
            >
                <svg
                    className="scroll-btn__icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 284.929 284.929"
                >
                    <path
                        d="M282.082,195.285L149.028,62.24c-1.901-1.903-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,195.285
		C0.95,197.191,0,199.378,0,201.853c0,2.474,0.953,4.664,2.856,6.566l14.272,14.271c1.903,1.903,4.093,2.854,6.567,2.854
		c2.474,0,4.664-0.951,6.567-2.854l112.204-112.202l112.208,112.209c1.902,1.903,4.093,2.848,6.563,2.848
		c2.478,0,4.668-0.951,6.57-2.848l14.274-14.277c1.902-1.902,2.847-4.093,2.847-6.566
		C284.929,199.378,283.984,197.188,282.082,195.285z"
                    />
                </svg>
            </button>
        );
    }
}

export default ScrollToTopBtn;
