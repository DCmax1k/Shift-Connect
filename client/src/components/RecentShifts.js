import React, { Component } from 'react';

class RecentShifts extends Component {
    constructor(props) {
        super(props);
        this.state = { 

         };

         this.addShift = this.addShift.bind(this);
         this.closeMenu = this.closeMenu.bind(this);
    }
    addShift() {
        this.props.showRecentShifts();
        this.props.toggleAddShiftMenu();
    }
    closeMenu() {
        this.props.showRecentShifts();
    }
    capLength(arr, length) {
        if (arr.length > length) {
            const newArr = [];
            for (let i = 1; i <= length; i++) {
                newArr.unshift(arr[arr.length - i]);
            }
            return newArr;
        } else {
            return arr;
        }
    }
    convertMilitaryToRegular(militaryTime) {
        const timeStr = militaryTime.toString().padStart(4, '0');
        const hours = parseInt(timeStr.slice(0, -2), 10);
        const minutes = timeStr.slice(-2);
        const period = hours < 12 ? 'am' : 'pm';
        const regularHours = hours % 12 || 12;
        const formattedTime = `${regularHours}:${minutes}`;
        return [formattedTime, period];
    }

    scheduleShift(shift) {
        const orguserID = this.props.u.userID;
        const date = this.props.date;
        this.closeMenu();
        this.props.scheduleShift(orguserID, date, shift);
    }

    render() {
        const { shifts } = this.props;
        return (
            <div className={'RecentShifts ' + this.props.visible + ' ' + (this.props.row === 0 ? 'firstRow' : this.props.row === 1 ? 'secondRow' : '')}>
                <img onClick={this.closeMenu} className='closeRecentShifts' alt='close recent shifts' src='/images/icons/x.svg' />
                <p>{shifts.length > 0 ? 'Recent shifts' : 'No recent shifts'}</p>
                {this.capLength(shifts, 5).map((shift, i) => {
                    const start = this.convertMilitaryToRegular(shift.timeStart);
                    const end = this.convertMilitaryToRegular(shift.timeEnd);
                    return (
                    <div onClick={() => this.scheduleShift(shift)} key={shift.id} className='shiftSize'>
                        <h4>{shift.title}</h4>
                        <p>{start[0]}<span>{start[1]}</span> - {end[0]}<span>{end[1]}</span></p>
                    </div>
                    )
                })}
                <div onClick={this.addShift} className='shiftSize button'>
                    Add new shift
                </div>  
            </div>
        );
    }
}

export default RecentShifts;