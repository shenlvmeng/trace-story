import React, { Component } from 'react';
import Header from './header';
import Steps from './steps';
import './index.less';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0
        };
    }

    handleStepChange = (delta) => {
        this.setState(prevState => ({
            step: prevState.step + delta
        }));
    }

    render() {
        const { step } = this.state;
        return (
            <div className="main">
                <Header step={step} />
                <Steps
                    step={step}
                    onStepChange={this.handleStepChange}
                    {...this.props}
                />
                <div className="footer">&copy; shenlvmeng 2018</div>
            </div>
        );
    }
}

export default Index;
