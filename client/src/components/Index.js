import React, { Component } from 'react';
import sendData from './util/sendData';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {


        }
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

    render() {
        return (
            <div className='Index'>
                {/* Title Logo */}
                <div className='title'>
                    <img alt='logo' src='/images/logoNoBg.svg' />
                    <h1>Shift</h1>
                    <h3>connect</h3>
                </div>

                {/* Display */}
                <img className='display' alt='app display' src='/images/displayApp.svg' />

                {/* Links */}
                <div className='links'>
                    <a href='/' className='link'>Guide</a>
                    <a href='/' className='link'>See Pricing</a>
                    <a href='/' className='link login'>Login</a>
                </div>
            </div>
        )
    }
}

export default Index;