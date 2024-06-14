import React, { Component } from 'react';

class TimeInput extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hour: this.props.hour || '7',
            minute: this.props.minuts || '00',
            ampm: this.props.ampm || 'am',
         };
         this.minuteInputRef = React.createRef();

         this.changeHour = this.changeHour.bind(this);
         this.changeMinute = this.changeMinute.bind(this);
         this.setAmPm = this.setAmPm.bind(this);
         this.getValue = this.getValue.bind(this);
    }

    changeHour(v) {
        const hour = parseInt(v.target.value) || '';
        if (hour > 12) return;
        if (hour > 1) {
            this.focusMinute();
        }
        this.setState({
            hour,
        });
    }
    changeMinute(v) {
        const minute = parseInt(v.target.value) || '';
        if (minute > 59) return;
        this.setState({
            minute: this.pad(minute, 2, '0'),
        });
    }
    setAmPm(ampm) {
        this.setState({
            ampm,
        });
    }
    focusMinute() {
        this.minuteInputRef.current.focus();
    }
    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    getValue() {
        return {
            hour: this.state.hour,
            minute: this.state.minute,
            ampm: this.state.ampm,
        };
    }

    render() {
        return (
            <div className='TimeInput'>
                <div className='actualTime'>
                    <input className='timeInput hour' value={this.state.hour} onInput={this.changeHour} />
                    <div className='colon'>
                        :
                    </div>
                    <input className='timeInput minute' value={this.state.minute} onInput={this.changeMinute} ref={this.minuteInputRef} />
                </div>
                <div className='ampm'>
                    <div className={'am ' + (this.state.ampm === 'am')} onClick={() => {this.setAmPm('am')}}>
                        am
                    </div>
                    <div className={'pm ' + (this.state.ampm === 'pm')} onClick={() => {this.setAmPm('pm')}}>
                        pm
                    </div>
                </div>
            </div>
        );
    }
}

export default TimeInput;