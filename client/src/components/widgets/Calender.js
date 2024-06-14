import React, { Component } from 'react';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class Calender extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            date: this.props.date || new Date(),
            selectedDate: this.props.date || new Date(),

         };

         this.setDate = this.setDate.bind(this);
         this.getCalenderDates = this.getCalenderDates.bind(this);
         this.setSelectedDate = this.setSelectedDate.bind(this);
         this.nextMonth = this.nextMonth.bind(this);
         this.prevMonth = this.prevMonth.bind(this);
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

    setDate(date) {
        this.setState({
            date,
        });
    }
    setSelectedDate(date) {
        this.setState({
            selectedDate: date,
            date,
        });
        this.props.setDate(date);
    }
    nextMonth() {
        const date = this.state.date;
        const year = date.getFullYear();
        const month = date.getMonth();
        this.setDate(new Date(year, month + 1), 1);
    }
    prevMonth() {
        const date = this.state.date;
        const year = date.getFullYear();
        const month = date.getMonth();
        this.setDate(new Date(year, month - 1), 1);
    }


    getCalenderDates() {
        const date = this.state.date;
        const year = date.getFullYear();
        const month = date.getMonth();

        // Actual month dates
        const lastDate = new Date(year, month + 1, 0);
        const monthDates = [];
        for (let i = 1; i < lastDate.getDate(); i++) {
            monthDates.push(new Date(year, month, i))
        }
        monthDates.push(lastDate);

        // Previous month last few days
        const lastDateLastMonth = new Date(year, month, 0);
        const lengthPrevDates = monthDates[0].getDay();
        const prevDates = [];
        for (let j = lastDateLastMonth.getDate(); prevDates.length < lengthPrevDates; j--) {
            prevDates.unshift(new Date(year, month - 1, j));
        }

        // Next month first few days
        const lengthNextDates = 6 - lastDate.getDay();
        const nextDates = [];
        for (let k = 1; k <= lengthNextDates; k++) {
            nextDates.push(new Date(year, month + 1, k));
        }

        const allDates = [...prevDates, ...monthDates, ...nextDates];
        return allDates;


    }

    render() {
        const active = this.props.active;

        const date = this.state.date;
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const allDates = this.getCalenderDates();
        return (
            <div className={'Calender ' + (active ? 'active' : '')}>
                <div className='header'>
                    <h2>{month} {year}</h2>
                    <div className='backAndNext'>
                        <div onClick={this.prevMonth} className='back'>
                            <img alt='previous month' src='/images/carrotArrow.svg' />
                        </div>
                        <div onClick={this.nextMonth} className='next'>
                            <img alt='next month' src='/images/carrotArrow.svg' />
                        </div>
                        
                    </div>
                </div>

                <div className='datesCont'>
                    <div className='dayCont weekDay'>Sun</div><div className='dayCont weekDay'>Mon</div><div className='dayCont weekDay'>Tue</div><div className='dayCont weekDay'>Wed</div><div className='dayCont weekDay'>Thu</div><div className='dayCont weekDay'>Fri</div><div className='dayCont weekDay'>Sat</div>
                    {allDates.map((d, i) => {
                        const dateKey = d.getTime();
                        const selected = this.compareDates(d, this.state.selectedDate);
                        const partOfThisMonth = d.getMonth() === this.state.date.getMonth();
                        let uniqueKey = `date-${dateKey}-user-${i}`;

                        return (
                            <div key={uniqueKey} className={'dayCont ' + (selected ? 'selected ' : '') + (partOfThisMonth ? '' : 'grey') }>
                                <div onClick={() => this.setSelectedDate(d)} className='day'>
                                    {d.getDate()}
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Calender;