import React, { Component } from 'react';
import Dropdown from './widgets/Dropdown';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            date: this.props.date,
         };

         this.getWeekDates = this.getWeekDates.bind(this);
         this.formatGetWeekDates = this.formatGetWeekDates.bind(this);
         this.getUsers = this.getUsers.bind(this);
         this.getShifts = this.getShifts.bind(this);
         this.getShiftsToday = this.getShiftsToday.bind(this);
         this.setDate = this.setDate.bind(this);
         this.selectView = this.selectView.bind(this);
         this.prevWeek = this.prevWeek.bind(this);
         this.nextWeek = this.nextWeek.bind(this);
    }

    getWeekDates() {
        // Clone the input date to avoid modifying the original date
        let date = new Date(this.state.date);
    
        // Get the day of the week (0 is Sunday, 6 is Saturday)
        let dayOfWeek = date.getDay();
        
        // Calculate the number of days to subtract to get the previous Monday
        // If the day is Sunday (0), we need to go back 6 days to reach the last Monday
        let daysToMonday = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
        
        // Set the date to the last Monday
        date.setDate(date.getDate() - daysToMonday);
        
        // Array to hold the dates of the week
        let weekDates = [];
        
        // Loop to generate dates from Monday to Sunday
        for (let i = 0; i < 7; i++) {
            // Push a new Date object to the array to avoid mutating the `date` object
            weekDates.push(new Date(date));
            // Move to the next day
            date.setDate(date.getDate() + 1);
        }
    
        return weekDates;
    }

    formatGetWeekDates() {
        const dates = this.getWeekDates();
        const result = dates.map(date => {
            const dayOfWeek = days[date.getDay()].substring(0, 3);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${dayOfWeek} ${month}/${day}`;
        });
        return result;
    }

    getUsers() {
        return this.props.organization.users;
    }

    getShifts(user) {
        const result = user.shifts.map(shiftID => {
            return this.props.organization.shifts.find(shift => shift.id === shiftID);
        });
        return result;
    }

    getShiftsToday(u, date) {
        const shifts = this.getShifts(u);
        const filteredToToday = shifts.filter(shift => this.props.compareDates(shift.date, date));
        return filteredToToday;
    }

    strCutoff(str, length) {
        if (str.length > length) {
            return str.substring(str, length) + '...';
        } else {
            return str;
        }
    }

    setDate(date) {
        this.setState({
            date,
        });
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

    getAvailability(u, date) {
        const day = date.getDay();
        return u.availability[day];
    }

    selectView(item) {
        this.props.selectView(item.id);
    }

    formatFullDate() { // 05/20/2024
        const date = this.state.date;
        // Extract the month, day, and year from the date object
        const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
        const day = date.getDate(); // getDate() returns 1-31
        const year = date.getFullYear(); // getFullYear() returns the full year (e.g., 2024)
        
        // Pad the month and day with leading zeros if necessary
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        
        // Concatenate the formatted components into 'MM/DD/YYYY'
        return `${paddedMonth}/${paddedDay}/${year}`;
    }

    getSwitchWeekText() { // Month MM-MM
        const weekDates = this.getWeekDates();
        const firstMonth = months[weekDates[0].getMonth()];
        const lastMonth = months[weekDates[6].getMonth()];
        const firstDay = weekDates[0].getDate();
        const lastDay = weekDates[6].getDate();
        if (firstMonth === lastMonth) {
            return `${firstMonth} ${firstDay}-${lastDay}`;
        } else {
            return `${firstMonth} ${firstDay} - ${lastMonth} ${lastDay}`;
        }
        
    }
    adjustDateByDays(baseDate, days) {
        const baseDateMs = baseDate.getTime();
        const daysInMs = days * 24 * 60 * 60 * 1000;
        const adjustedDate = new Date(baseDateMs + daysInMs);
        return adjustedDate;
    }
    prevWeek() {
        const date = this.state.date;
        const newDate = this.adjustDateByDays(date, -7);
        this.setState({
            date: newDate,
        });
    }
    nextWeek() {
        const date = this.state.date;
        const newDate = this.adjustDateByDays(date, 7);
        this.setState({
            date: newDate,
        });
    }

    render() {
        return (
            <div className='Editor'>
                {/* View selector */}
                <div className='options'>
                    <Dropdown action={false} emptyPlaceholder={""} actionText={""} items={[{id: 'editor', title: 'Schedule Editor'}, {id: 'view', title: 'View Schedule'}]} current={this.props.lastView} width={'30vh'} selectItem={this.selectView} actionFunc={null} bgClr={'#424242'} z={1} c={'option'} />
                    <div className='option date'>
                        <img alt='date' src='/images/icons/calender.svg' />
                        <p>Date</p>
                        <span>{this.formatFullDate()}</span>
                    </div>
                    <div className='option switchWeek'>
                        <div className='arrow left' onClick={this.prevWeek} >
                            <img alt='previous week' src='/images/icons/rightArrow.svg' />
                        </div>
                        <div className='weekText'>{this.getSwitchWeekText()}</div>
                        <div  className='arrow right' onClick={this.nextWeek}>
                            <img alt='next week' src='/images/icons/rightArrow.svg' />
                        </div>
                    </div>
                    <div className='option addShift'>
                        Add Shifts
                    </div>
                
                
                
                </div>

                {/* TABLE EDITOR */}
                <div className='table'>
                    <table>
                        <thead>
                            <tr key={1}>
                                <th>
                                    Employees
                                </th>

                                {this.formatGetWeekDates().map((day, index) => (
                                <th key={`day-${index}-${day}`}>
                                    {day}
                                </th>
                                ))}

                            </tr>
                        </thead>
                        <tbody>
                        {this.getUsers().map((u, userIndex) => (
                        <tr key={`user-${userIndex}-${u._id}`}>
                            <td key={u.fullname}>
                                <div className='fillSpace userName'>
                                    <h1>{this.strCutoff(u.fullname, 25)}</h1>
                                    <p className='jobTitle'>{u.jobTitle}</p>
                                </div>
                                
                                
                            </td>

                            {this.getWeekDates().map((date, dateIndex) => {
                            // DAY USER CONTENT HERE / Shows user shift or button to add shift
                            const shiftsToday = this.getShiftsToday(u, date);
                            const dateKey = date.getTime();
                            const shiftToday = shiftsToday.length > 0;
                            const availability = this.getAvailability(u, date);
                            const available = availability.available;

                            const availStart = this.convertMilitaryToRegular(availability.startTime);
                            const availEnd = this.convertMilitaryToRegular(availability.endTime);
                            
                            let defaultShiftStart = '';
                            let defaultShiftEnd = '';
                            if (shiftToday) {
                                defaultShiftStart = this.convertMilitaryToRegular(shiftsToday[0].timeStart);
                                defaultShiftEnd = this.convertMilitaryToRegular(shiftsToday[0].timeEnd);
                            }
                            

                            return (
                            <td key={`date-${dateKey}-user-${dateIndex}`}>
                                <div className='fillSpace'>
                                    {shiftToday ? (
                                        <div className='shift bubbleFill'>
                                            <p className='timeCont'><span className='time'>{defaultShiftStart[0]}</span><span className='amOrPm'>{defaultShiftStart[1]}</span> - <span className='time'>{defaultShiftEnd[0]}</span><span className='amOrPm'>{defaultShiftEnd[1]}</span></p>
                                            <p className='location'>{shiftsToday[0].location}</p>
                                            <p className='notes'>{this.strCutoff(shiftsToday[0].notes, 65)} <span style={{color: 'white', fontWeight: 'bold'}}>{shiftsToday[0].title}</span></p>
                                        </div>
                                    ) : available ? (
                                        <div className='addShift bubbleFill'>
                                            <img alt='add shift' src='/images/icons/plus.svg' />
                                            <p>Available</p>
                                            <p className='timeCont'><span className='time'>{availStart[0]}</span><span className='amOrPm'>{availStart[1]}</span> - <span className='time'>{availEnd[0]}</span><span className='amOrPm'>{availEnd[1]}</span></p>
                                        </div>
                                    ) : (
                                        <div className='bubbleFill notAvail'>
                                            Not available
                                        </div>
                                    )}
                                </div>
                            </td>
                            )})}
                        </tr>
                        ))}
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default Editor;