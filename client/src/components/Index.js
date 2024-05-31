import React, { Component } from 'react';
import sendData from './util/sendData';

import Switch from './Login/Switch';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alerts: [],
            sideBar: false,
        }

        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.customAlert = this.customAlert.bind(this);
        this.applyDecay = this.applyDecay.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    async componentDidMount() {
        // Check login
        try {
            const checkLogin = await sendData('/auth', {});
            if (checkLogin.status === 'success') {
                window.location.href = '/dashboard';
            }

        } catch(err) {
            console.error(err);
        }
    }

    customAlert(message, good) {
        const id = Math.random() + '' + Date.now();
        const alerts = this.state.alerts;
        const alert = {
            id,
            txt: message,
            status: good,
            animate: false,
        };
        alerts.push(alert);
        this.setState({
            alerts,
        });

        if (alerts.length === 1) {
            this.applyDecay(alert);
        }
    }

    closeAlert(alert) {
        const alerts = this.state.alerts;
        let ind = alerts.findIndex((alrt) => alrt.id === alert.id);
        if (ind < 0) return;
        alerts[ind].animate = true;
        this.setState({
            alerts,
        });
        setTimeout(() => {
            const updatedAlerts = this.state.alerts;
            updatedAlerts.splice(ind, 1);
            this.setState({
                alerts: updatedAlerts,
            });

            if (updatedAlerts.length > 0) {
                this.applyDecay(updatedAlerts[0]);
            }
        }, 300);
    }

    applyDecay(alert) {
        setTimeout(() => {
            this.closeAlert(alert);
        }, 3000);
    }

    toggleSidebar() {
        this.setState({
            sideBar: !this.state.sideBar,
        });
    }

    render() {
        return (
            <div className='Index'>
                {/* Alert messages */}
                <div className='alerts'>
                    {this.state.alerts.filter((al, i) => i===0).map((alert, i) => {
                        // Auto close alert after 10 seconds
                        return (
                        <div className={`alert ${alert.status} ${alert.animate ? 'animate' : ''}`} key={alert.id}>
                            <img onClick={() => this.closeAlert(alert)} src={alert.status ? '/images/icons/greenHollowCheck.svg' : '/images/icons/redHollowX.svg'} alt='Close notification' />
                            {alert.txt}
                        </div>
                        )
                    })}
                </div>

                {/* Title Logo */}
                <div className='title'>
                    <img alt='logo' src='/images/logoNoBg.svg' />
                    <h1>Crew</h1>
                    <h3>Boost Team Productivity</h3>
                </div>

                {/* Side bar */}
                <div className={'sideBar ' + this.state.sideBar}>
                    <img alt='close sidebar' src='/images/icons/x.svg' onClick={this.toggleSidebar} style={{position: 'absolute', top: '2vh', right: '2vh', zIndex: 1, cursor: 'pointer'}} />
                    <Switch customAlert={this.customAlert} />
                </div>

                {/* Display */}
                <img className='display' alt='app display' src='/images/displayApp.svg' />

                {/* Links */}
                <div className='links'>
                    <a href='/' className='link'>Guide</a>
                    <a href='/' className='link'>See Pricing</a>
                    <div onClick={this.toggleSidebar} className='link login'>Log in</div>
                </div>
            </div>
        )
    }
}

export default Index;