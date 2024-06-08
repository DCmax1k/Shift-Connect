import React, { Component } from 'react';
import sendData from './util/sendData';
import Loading from './Loading';
import Dropdown from './widgets/Dropdown';
import Input from './Login/Input';
import Editor from './Editor';
import Viewer from './Viewer';


const user = {
	_id: 3409233,
	fullname: 'Dylan Caldwell',
	username: 'DCmax1k',
	password: 'password1234',
	organizations: [ {id: 23234, title: 'Walmart', }, {id: 234234, title: 'Pulp', }, {id: 234534, title: 'Pine Tree Corner LLC', }, ],
	//organizations: [  ],
	lastOrganization: 23234,
};
const org = {
	title: 'Pine Tree Corner',
	_id: 982374,
	invited: [  {email: 'dylan@gmail.com', jobTitle: 'Manager', availability: {monday: {startTime: 700, endTime: 1700, available: true }, }, shifts: [234234, 234234]}  ],
	users: [  {userID: 3409233,fullname: 'Dylan Caldwell Junior Cousins', notifications: [],  jobTitle: 'Manager', availability: [{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: false },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },], shifts: [908234]}, {userID: 3409233,fullname: 'Joe mama', notifications: [],  jobTitle: 'Field Worker', availability: [{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: false },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: false },{startTime: 700, endTime: 1700, available: true },{startTime: 700, endTime: 1700, available: true },], shifts: [908234]}  ],
	admins: [ {
        userID: 3409233,
        lastView: 'editor',
    } ],
	joinCode: '9fg8x',
	schedule: {},
	shifts:  // pre made shifts
	[
		{
			title: 'Morning Shift',
			id: 908234,
			date: new Date(),
			timeStart: 700,
			timeEnd: 1700,
			location: 'Main Office',
			repeat: 'weekly',
			saved: true, // is saved. If not saved, its just in db for suggestions to admin
            notes: 'Park on the right side of the driveway facing street of the brown house, on the right side of the driveway facing street of the brown house',
		},
	]
}


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loggedIn: false,
            loadingText: 'Logging in...',
            fadeIn: false,
            alerts: [],

            createOrgName: '',
            createOrgOpen: false,
            joinOrgOpen: false,
            chips: [],

            organization: {},
            date: null,
            view: null, // editor, view

            orgSideBar: false,
            userSideBar: false,
        };
        this.loadingRef = React.createRef();

        this.customAlert = this.customAlert.bind(this);
        this.applyDecay = this.applyDecay.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.selectOrganization = this.selectOrganization.bind(this);
        this.joinOrg = this.joinOrg.bind(this);
        this.createOrg = this.createOrg.bind(this);
        this.changeCreateOrgName = this.changeCreateOrgName.bind(this);
        this.addChip = this.addChip.bind(this);
        this.submitCreateOrg = this.submitCreateOrg.bind(this);
        this.toggleUserSidebar = this.toggleUserSidebar.bind(this);
        this.toggleOrgSidebar = this.toggleOrgSidebar.bind(this);
        this.compareDates = this.compareDates.bind(this);
        this.selectView = this.selectView.bind(this);
        

    }

    async componentDidMount() {
        try {
            //const checkLogin = await sendData('/auth', {});
            const checkLogin = {user, status: 'success', organization: org, date: new Date()};
            if (checkLogin.status === 'success') {
                const { user, organization, date } = checkLogin;
                this.setState({
                    user,
                    organization,
                    date,
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
                // Load images
                const images = ['/images/icons/whiteX.svg'];
                images.forEach(image => {
                    const img = new Image();
                    img.src = image;
                });
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

    async selectOrganization(org) {
        this.setState({
            user: {
                ...this.state.user,
                lastOrganization: org.id,
            }
        });
        const response = await sendData('/dashboard/selectorg', {orgID: org.id});
        if (response && response.status === 'success') {
            this.setState({
                organization: response.organization,
            });
        } else {
            this.customAlert('Error connecting to server. Please try again later.', false);
        }
    }

    getCurrentDate() {
        return this.getDate(new Date());
    }
    formatDate(date) {
        const d = new Date(date);
        const DAY = d.getDate();
        const MONTH = d.getMonth() + 1;
        const YEAR = d.getFullYear();

        return `${YEAR}_${MONTH}_${DAY}`;
    }
    compareDates(date1, date2) {
        const test1 = this.formatDate(date1);
        const test2 = this.formatDate(date2);
        return test1 === test2;
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
        this.setState({
            joinOrgOpen: true,
        });
    }
    createOrg() {
        this.setState({
            createOrgOpen: !this.state.createOrgOpen,
        });
    }
    changeCreateOrgName(value) {
        this.setState({
            createOrgName: value,
        });
    }
    addChip(value) {
        const chips = this.state.chips;
        chips.push(value);
        const result = [...new Set(chips)];
        this.setState({
            chips: result,
        });
    }
    removeChip(chip) {
        const chips = this.state.chips;
        const i = chips.indexOf(chip);
        chips.splice(i, 1);
        this.setState({
            chips,
        });
    }
    changeEmailList() {}
    
    async submitCreateOrg() {
        const { createOrgName, chips } = this.state;
        if (createOrgName.length < 1) return this.customAlert('Please enter a name for you organization!', false);
        const response = await sendData('/dashboard/createorg', {orgName: createOrgName, invite: chips});
        if (response && response.status === 'success') {
            const org = {id: response.orgID, title: createOrgName}
            this.setState({
                createOrgOpen: false,
                user: {
                    ...user,
                    organizations: [...this.state.user.organizations, org],
                    lastOrganization: org.id,
                }
            });
        } else {
            this.customAlert('An error occurred, please try again later.', false);
        }
    }

    toggleUserSidebar() {
        this.setState({
            userSideBar: !this.state.userSideBar,
        });
    }

    toggleOrgSidebar() {
        this.setState({
            orgSideBar: !this.state.orgSideBar,
        });
    }

    selectView(view) {
        this.setState({
            view,
        });
    }

    //EDIT ORGANIZATION
    addShift(shift) {

    }

    render() {
        let isAdmin = false;
        let adminUser = null;
        let orgUser = {};
        let lastView = this.state.view; // view, editor

        if (this.state.organization && this.state.organization._id) {
            // Check if admin
            this.state.organization.admins.forEach(admin => {
                if (admin.userID === this.state.user._id) {
                    isAdmin = true;
                    adminUser = admin;
                }
                return;
            });

            // Get org user info
            this.state.organization.users.forEach(u => {
                if (u.userID === this.state.user._id) orgUser = u;
                return;
            });
            if (!orgUser || !orgUser.userID) {
                this.customAlert('An error occured getting user info from organization!', false);
            } else {
                // Correct lastView
                if (lastView === null) {
                    if (isAdmin) {
                        lastView = adminUser.lastView;
                    }
                }
            }
            
        }

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

                {/* Org Side bar */}
                {this.state.user.organizations.length > 0 ? (<div className={'sideBar ' + this.state.orgSideBar}>
                    <img alt='close sidebar' src='/images/icons/x.svg' onClick={this.toggleOrgSidebar} style={{position: 'absolute', top: '2vh', right: '2vh', zIndex: 1, cursor: 'pointer'}} />
                    {this.state.organization.title}
                </div>) : null}
                
                {/* User Side bar */}
                <div className='hamIcon' onClick={this.toggleUserSidebar}>
                    <img alt='open user settings' src='/images/icons/ham.svg' style={{height: '100%', width: '100%'}} />
                </div>
                <div className={'user right sideBar ' + this.state.userSideBar}>
                    <img alt='close sidebar' src='/images/icons/x.svg' onClick={this.toggleUserSidebar} style={{position: 'absolute', top: '2vh', right: '2vh', zIndex: 1, cursor: 'pointer'}} />

                    <div className='userName'>
                        <img alt='Crew logo' src='/images/logoNoBg.svg' />
                        <h2>{this.state.user.fullname}</h2>
                    </div>
                    <div onClick={this.logout} className='btn logout'>Logout</div>
                </div>

                {/* Create/Join org menus */}
                <div className={'createOrg ' + this.state.createOrgOpen}>
                    <h1>Create an Organization</h1>
                    <img className='closeCreateOrg' alt='close menu for create org' src='/images/icons/whiteX.svg' onClick={this.createOrg} />

                    <div className='field'>
                        <h3>Organization name</h3>
                        <Input onInput={this.changeCreateOrgName} className="createOrgName" placeholder={"Type here..."} type="text" width={'100%'} height={'6vh'} />
                    </div>

                    <div className='field'>
                        <h3>Invite users/employees<span> - List emails here. More users can always be invited later</span></h3>
                        <Input onInput={this.changeEmailList} className="createOrgName"  width={'100%'}  height={'6vh'} placeholder={"name@example.com, ..."} type="chip" addChip={this.addChip} />
                        <div className='chips'>
                            {this.state.chips.map((chip) => {
                                return (
                                    <div key={chip} className='chip' onClick={() => this.removeChip(chip)}>
                                        <img alt='remove chip' src='/images/icons/whiteX.svg' />
                                        <h3>{chip}</h3>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className='submitCreateOrg'>
                        <div onClick={this.submitCreateOrg} className='btn'>Create Organization</div>
                    </div>
                </div>

                <Dropdown action={true} emptyPlaceholder={"No organizations yet"} actionText={"Create an organization"} items={this.state.user.organizations} current={this.state.user.lastOrganization} width={'30vh'} selectItem={this.selectOrganization} actionFunc={this.createOrg} bgClr={'#424242'} z={2} c={''} />

                {/* Body */}
                {this.state.user.organizations.length < 1 ? (
                <div className='body'>
                    <div className='middle'>
                        <div className='btn' onClick={this.joinOrg}>
                            Join Organization
                        </div>
                        or
                        <div className='btn' onClick={this.createOrg}>
                            Create Organization
                        </div>
                    </div>
                </div>

                ) : (

                <div className='body'>
                    
                    {/* Two different screens here. Schedule editor and Display view */}
                    {lastView === 'editor' ? (
                        <Editor selectView={this.selectView} user={this.state.user} organization={this.state.organization} date={this.state.date} compareDates={this.compareDates} lastView={lastView} />
                    )
                    :   <Viewer selectView={this.selectView} user={this.state.user} organization={this.state.organization} date={this.state.date} compareDates={this.compareDates} lastView={lastView} />
                    }

                </div>

                )}
            </div>
        ) : (
            <Loading loadingText={this.state.loadingText} ref={this.loadingRef} />
        );
    }
}

export default Dashboard;