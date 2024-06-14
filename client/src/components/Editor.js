import React, { Component } from 'react';
import Dropdown from './widgets/Dropdown';
import TimeInput from './widgets/TimeInput';
import Input from './Login/Input';
import ColorSelector from './ColorSelector';
import RecentShifts from './RecentShifts';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            date: this.props.date || new Date(),

            showRecentShiftsFor: ``, // date-${dateKey}-user-${u.userID}

            schedulesActive: [], // schedule's id admin clicke don

            toggleCalender: false,

            addShift: {
                title: '',
                location: '',
                repeat: '',
                color: '#545775',
                notes: '',
                isOpen: false,
            }
         };

         this.startTimeInput = React.createRef();
         this.endTimeInput = React.createRef();

         this.getWeekDates = this.getWeekDates.bind(this);
         this.formatGetWeekDates = this.formatGetWeekDates.bind(this);
         this.getUsers = this.getUsers.bind(this);
         this.getShifts = this.getShifts.bind(this);
         this.getShiftsToday = this.getShiftsToday.bind(this);
         this.setDate = this.setDate.bind(this);
         this.selectView = this.selectView.bind(this);
         this.prevWeek = this.prevWeek.bind(this);
         this.nextWeek = this.nextWeek.bind(this);
         this.changeAddShiftTitle = this.changeAddShiftTitle.bind(this);
         this.changeAddShiftLocation = this.changeAddShiftLocation.bind(this);
         this.changeAddShiftNotes = this.changeAddShiftNotes.bind(this);
         this.changeAddShiftColor = this.changeAddShiftColor.bind(this);
         this.toggleAddShiftMenu = this.toggleAddShiftMenu.bind(this);
         this.submitShift = this.submitShift.bind(this);
         this.showRecentShifts = this.showRecentShifts.bind(this);
         this.scheduleShift = this.scheduleShift.bind(this);
         this.unscheduleShift = this.unscheduleShift.bind(this);
         this.toggleActiveSchedule = this.toggleActiveSchedule.bind(this);
         this.toggleCalender = this.toggleCalender.bind(this);
         this.formatFullDate = this.formatFullDate.bind(this);
    }

    getWeekDates() {
        let date = new Date(this.state.date);
        let dayOfWeek = date.getDay();
        let daysToMonday = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
        date.setDate(date.getDate() - daysToMonday);
        let weekDates = [];
        for (let i = 0; i < 7; i++) {
            weekDates.push(new Date(date));
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

    getShifts(u, date) { // Gets schedule data for user and the date from schedule
        const result = this.props.organization.schedule.filter(data => {
            return data.userID === u.userID && this.props.compareDates(data.date, date);
        });
        return result;
    }

    getShiftsToday(u, date) {
        
        const schedule = this.getShifts(u, date);
        const result = schedule.map(data => {
            const shift = this.props.organization.shifts.find(shift => shift.id ===  data.shiftID);
            const mix = {
                ...shift,
                scheduleID: data.id,
            }
            return mix;
        });
        return result;
    }

    strCutoff(str, length, placeholder = '') {
        if (str.length > length) {
            return str.substring(str, length) + '...';
        } else if (str.length === 0) {
            return placeholder;
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
        if (!militaryTime) return ['undefined', 'undefined'];
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
        console.log('fine here ', item.id);
        this.props.selectView(item.id);
    }

    formatFullDate() { // 05/20/2024
        const date = new Date(this.state.date);
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
        const date = new Date(this.state.date);
        const newDate = this.adjustDateByDays(date, -7);
        this.setState({
            date: newDate,
        });
        this.props.setSelectedDate(newDate);
    }
    nextWeek() {
        const date = new Date(this.state.date);
        const newDate = this.adjustDateByDays(date, 7);
        this.setState({
            date: newDate,
        });
        this.props.setSelectedDate(newDate);
    }
    changeAddShiftTitle(v) {
        this.setState({
            addShift: {
                ...this.state.addShift,
                title: v,
            }
        });
    }
    changeAddShiftLocation(v) {
        this.setState({
            addShift: {
                ...this.state.addShift,
                location: v,
            }
        });
    }
    changeAddShiftNotes(v) {
        this.setState({
            addShift: {
                ...this.state.addShift,
                notes: v,
            }
        });
    }
    changeAddShiftColor(data, color) {
        this.setState({
            addShift: {
                ...this.state.addShift,
                color,
            }
        });
    }
    toggleAddShiftMenu() {
        this.setState({
            addShift: {
                ...this.state.addShift,
                isOpen: !this.state.addShift.isOpen,
            }
        });
    }

    timeToMilitary(value) {
        const {hour, minute, ampm} = value;
        let hourWeight = parseInt(hour) * 100;
        let minuteWeight = parseInt(minute);
        if (ampm === 'pm') {
            hourWeight+=1200;
        }
        return hourWeight+minuteWeight;

    }

    submitShift() {
        const timeStart = this.timeToMilitary(this.startTimeInput.current.getValue());
        const timeEnd = this.timeToMilitary(this.endTimeInput.current.getValue());
        const { organization, customAlert } = this.props;
        const {title, location, repeat, notes, color} = this.state.addShift;
        const shiftData = {
            orgID: organization._id,
            title,
            timeStart,
            timeEnd,
            location,
            repeat,
            notes,
            color,
        }
        if (!shiftData.title) return customAlert('A shift title is required.', false);
        // Close menu and reset some values
        this.setState({
            addShift: {
                ...this.state.shiftData,
                title: '',
                location: '',
                repeat: '',
                notes: '',
                isOpen: false,
            }
        });
        this.props.addShift(shiftData);
    }

    showRecentShifts(v = '') {
        this.setState({
            showRecentShiftsFor: v,
        });
    }

    scheduleShift(orguserID, date, shift) {
        this.props.scheduleShift(orguserID, date, shift);
    }
    unscheduleShift(id) {
        this.props.unscheduleShift(id);
    }

    toggleActiveSchedule(id, remove = false) {
        const current = this.state.schedulesActive;
        if (current.includes(id)) {
            const index = current.indexOf(id);
            current.splice(index, 1);
        } else if (remove) {
            if (current.includes(id)) {
                const index = current.indexOf(id);
                current.splice(index, 1);
            }
        } else {
            current.push(id);
            setTimeout(() => this.toggleActiveSchedule(id, true), 5000);
        }
        this.setState({
            schedulesActive: current,
        });

        // Have them automatically
        
    }
    toggleCalender() {
        this.props.toggleCalender();
        this.setState({
            toggleCalender: !this.state.toggleCalender,
        })
    }

    render() {
        return (
            <div className='Editor'>
                {/* View selector */}
                <div className='options'>
                    <Dropdown action={false} emptyPlaceholder={""} actionText={""} items={[{id: 'editor', title: 'Schedule Editor'}, {id: 'view', title: 'View Schedule'}]} current={this.props.lastView} width={'30vh'} selectItem={this.selectView} actionFunc={null} bgClr={'#424242'} z={1} c={'option'} />
                    <div onClick={this.toggleCalender} className={'option date ' + (this.state.toggleCalender ? 'active' : '')}>
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
                    <div onClick={this.toggleAddShiftMenu} className='option addShift'>
                        Add Shift
                    </div>
                    
                
                
                
                </div>

                {/* Add Shift Menu */}
                <div className={'addShiftForm ' + this.state.addShift.isOpen}>
                    <h1>Add a shift</h1>
                    <div className='startTime time'>
                        <p>Clock-in / Start time</p>
                        <TimeInput ref={this.startTimeInput} hour={7} minute={0} ampm={'am'} />
                    </div>
                    <div className='endTime time'>
                        <p>Clock-out / End time</p>
                        <TimeInput ref={this.endTimeInput} hour={5} minute={30} ampm={'pm'} />
                    </div>
                    <hr />
                    <div className='addShiftRow title'>
                        <p>Shift title</p>
                        <Input
                        onInput={this.changeAddShiftTitle}
                        className="addShiftTitle"
                        placeholder={"Morning Shift, Shift A..."}
                        type="text"
                        width={'100%'}
                        height={'4vh'}
                        bgClr={'#545454'}
                        marginBottom={0}
                        fontSize={'1.5vh'} />
                    </div>
                    <div className='addShiftRow color'>
                        <p>Color</p>
                        <ColorSelector data={{color: this.state.addShift.color}} changeColor={this.changeAddShiftColor} user={this.props.user}/>
                    </div>
                    <div className='addShiftRow location'>
                        <p>Location</p>
                        <Input
                        onInput={this.changeAddShiftLocation}
                        className="addShiftLocation"
                        placeholder={"Main office, Cafeteria..."}
                        type="text"
                        width={'100%'}
                        height={'4vh'}
                        bgClr={'#545454'}
                        marginBottom={0}
                        fontSize={'1.5vh'} />
                    </div>
                    <div className='addShiftRow notes'>
                        <p>Notes</p>
                        <Input
                        onInput={this.changeAddShiftNotes}
                        className="addShiftNotes"
                        placeholder={"Park in lot A. Take a 30min lunch..."}
                        type="text"
                        width={'100%'}
                        height={'4vh'}
                        bgClr={'#545454'}
                        marginBottom={0}
                        fontSize={'1.5vh'} />
                    </div>
                    <div className='buttons'>
                        <div onClick={this.submitShift} className='makeShift button'>
                            Save shift
                        </div>
                        <div onClick={this.toggleAddShiftMenu} className='cancelShift button'>
                            Cancel
                        </div>
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

                            let scheduleID = '';
                            
                            let defaultShiftStart = '';
                            let defaultShiftEnd = '';
                            if (shiftToday) {
                                defaultShiftStart = this.convertMilitaryToRegular(shiftsToday[0].timeStart);
                                defaultShiftEnd = this.convertMilitaryToRegular(shiftsToday[0].timeEnd);
                                scheduleID = shiftsToday[0].scheduleID
                            }
                            
                            let visible = false;
                            let uniqueKey = `date-${dateKey}-user-${u.userID}`;
                            if (this.state.showRecentShiftsFor === uniqueKey) {
                                visible = true;
                            }

                            let active = this.state.schedulesActive.includes(scheduleID);

                            return (
                            <td key={uniqueKey}>
                                <div className='fillSpace'>
                                    {shiftToday ? (
                                        <div onClick={() => this.toggleActiveSchedule(scheduleID)} className={'shift bubbleFill ' + (active ? 'active' : '')}>
                                            <div title='User marked this date not available!' className={'conflict ' + (available ? '' : 'notAvail')}> <img alt='warning conflict' src='/images/icons/conflict.svg' /> </div>
                                            <p className='timeCont'><span className='time'>{defaultShiftStart[0]}</span><span className='amOrPm'>{defaultShiftStart[1]}</span> - <span className='time'>{defaultShiftEnd[0]}</span><span className='amOrPm'>{defaultShiftEnd[1]}</span></p>
                                            <p className='location'>{shiftsToday[0].location ? shiftsToday[0].location : 'Notes'}</p>
                                            <p className='notes'>{this.strCutoff(shiftsToday[0].notes, 65, 'None.')} <span style={{color: 'white', fontWeight: 'bold'}}>{shiftsToday[0].title}</span></p>

                                            <div className='trash'>
                                                <div className='block'  onClick={() => this.unscheduleShift(scheduleID)}><img src='/images/icons/trash.svg' alt='delete shift'  /></div>
                                                
                                            </div>
                                        </div>
                                    ) : available ? (
                                        <div onClick={() => {if (!visible) {this.showRecentShifts(uniqueKey)}}} className='addShift bubbleFill'>
                                            <img alt='add shift' src='/images/icons/plus.svg' />
                                            <p>Available</p>
                                            <p className='timeCont'><span className='time'>{availStart[0]}</span><span className='amOrPm'>{availStart[1]}</span> - <span className='time'>{availEnd[0]}</span><span className='amOrPm'>{availEnd[1]}</span></p>
                                            <RecentShifts shifts={this.props.organization.shifts} visible={visible} toggleAddShiftMenu={this.toggleAddShiftMenu} showRecentShifts={this.showRecentShifts} date={date} u={u} scheduleShift={this.scheduleShift} />
                                        </div>
                                    ) : (
                                        <div onClick={() => {if (!visible) {this.showRecentShifts(uniqueKey)}}} className='bubbleFill notAvail'>
                                            Not available
                                            <RecentShifts shifts={this.props.organization.shifts} visible={visible} toggleAddShiftMenu={this.toggleAddShiftMenu} showRecentShifts={this.showRecentShifts} date={date} u={u} scheduleShift={this.scheduleShift} />
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