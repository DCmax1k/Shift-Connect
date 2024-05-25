import React, { Component } from 'react';
import sendData from './util/sendData';
import Loading from './Loading';
import Dropdown from './widgets/Dropdown';


const user = {
	_id: 3409233,
	firstname: 'Dylan',
	lastname: 'Caldwell',
	username: 'DCmax1k',
	password: 'password1234',
	//organizations: [ {id: 23234, title: 'Walmart', }, {id: 234234, title: 'Pulp', }, {id: 234534, title: 'Pine Tree Corner LLC', }, ],
	organizations: [  ],
	lastOrganization: 234534,
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loggedIn: false,
            loadingText: 'Logging in...',
            fadeIn: false,
            alerts: [],
        };
        this.loadingRef = React.createRef();

        this.customAlert = this.customAlert.bind(this);
        this.applyDecay = this.applyDecay.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.selectOrganization = this.selectOrganization.bind(this);
        this.joinOrg = this.joinOrg.bind(this);
        this.createOrg = this.createOrg.bind(this);

    }

    async componentDidMount() {
        try {
            const checkLogin = await sendData('/auth', {});
            //const checkLogin = {user, status: 'success'};
            if (checkLogin.status === 'success') {
                const user = checkLogin.user;
                this.setState({
                    user,
                    loadingText: 'Welcome back, ' + user.fullname + '!',
                });
                setTimeout(() => {
                    this.loadingRef.current.fadeOut();
                    setTimeout(() => {
                        this.setState({
                            loggedIn: true,
                        });
                        setTimeout(() => {
                            this.setState({
                                fadeIn: true,
                            });
                        }, 1);
                    }, 300);
                }, 600);
            } else {
                this.setState({
                    loadingText: checkLogin.message,
                });
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }

        } catch(err) {
            console.error(err);
        }
    }

    selectOrganization(org) {
        this.setState({
            user: {
                ...user,
                lastOrganization: org.id,
            },
        });
    }


    async logout() {
        try {
            const response = await sendData('/login/logout', {});
            if (response.status === 'success') {
                window.location.href = '/';
            } else {
                this.customAlert('Error connecting to server. Redirecting...', false);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } catch(err) {
            console.error(err);
            this.customAlert('Error connecting to server. Redirecting...', false);
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
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

    joinOrg() {
        this.customAlert('Cannot join organizations yet. Please try again later.', false);
    }
    createOrg() {
        this.customAlert('Cannot create organizations yet. Please try again later.', false);
    }

    async logout() {
        try {
            const response = await sendData('/login/logout', {});
            if (response.status === 'success') {
                window.location.href = '/';
            } else {
                this.customAlert('Error connecting to server. Redirecting...', false);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } catch(err) {
            console.error(err);
            this.customAlert('Error connecting to server. Redirecting...', false);
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        }
    }

    render() {

        return this.state.loggedIn ? (
            <div className={`Dashboard ${this.state.fadeIn}`}>
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

                <Dropdown items={this.state.user.organizations} current={this.state.user.lastOrganization} width={'30vh'} selectItem={this.selectOrganization} bgClr={'#424242'} />

                <div onClick={this.logout} style={{position: 'absolute', top: '2vh', right: '2vh', padding: '1vh 3vh', backgroundColor: 'grey', borderRadius: '1vh', cursor: 'pointer'}}>Logout</div>

                {/* Body */}
                <div className='body'>
                    {this.state.user.organizations.length < 1 ? (
                    <div className='middle'>
                        <div className='btn' onClick={this.joinOrg}>
                            Join Organization
                        </div>
                        or
                        <div className='btn' onClick={this.createOrg}>
                            Create Organization
                        </div>
                    </div>) : (
                    <div>

                    </div>)}
                    
                    
                </div>
            </div>
        ) : (
            <Loading loadingText={this.state.loadingText} ref={this.loadingRef} />
        );
    }
}

export default Dashboard;