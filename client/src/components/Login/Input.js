import React, { Component } from 'react';

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            showPassword: false,
        }
        this.keySubmit = this.keySubmit.bind(this);
        this.onInput = this.onInput.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
        this.addChip = this.addChip.bind(this);
        this.setValue = this.setValue.bind(this);

    }

    focus() {
        window.addEventListener('keyup', this.keySubmit)
    }
    blur() {
        window.removeEventListener('keyup', this.keySubmit);
    }
    keySubmit(e) {
        if (e.key === 'Enter') {
            if (this.props.enter) {
                this.props.enter();
            }
        }
        if (e.target.value.includes(' ') || e.target.value.includes(',') || e.key === 'Enter') {
            if (this.props.type === 'chip') {
                this.addChip(this.state.value);
            }
        }
    }
    addChip(value) {
        const result = value.trim();
        let values;
        if (result.includes(' ')) {
            values = result.split(' ');
        } else {
            values = result.split(',');
        }
        const results = values.map(val => {
            if (val.length < 1) return null;
            return val.replace(/[,]/g, '');
        }).filter(val => val != null);
        this.setState({
            value: '',
        });
        if (results.length < 1) return;
        results.forEach(res => {
            this.props.addChip(res);
        })
    }

    onInput(e) {
        this.props.onInput(e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    showPassword() {
        this.setState({
            showPassword: !this.state.showPassword,
        });
    }

    setValue(value) {
        this.setState({
            value,
        });
    }

    render() {
        const type = this.props.type === 'chip' ? 'text' : this.state.showPassword ? "text" : this.props.type;
        return (
            <div className={'Input ' + this.props.className} style={{width: this.props.width, height: this.props.height ? this.props.height : '9vh', backgroundColor: this.props.bgClr || '#2b2b2b', marginBottom: this.props.marginBottom !== null ? this.props.marginBottom : '2vh'}}>
                <div className='placeholder' style={{color: this.state.value.length > 0 ? "transparent" : "#868686", fontSize: this.props.fontSize || '2.5vh'}}>{this.props.placeholder}</div>
                <input type={type} onInput={this.onInput} value={this.state.value} onFocus={this.focus} onBlur={this.blur} style={{fontSize: this.props.fontSize || '2.5vh'}} />
                <img onClick={this.showPassword} className='eye' style={{display: this.props.type === "password" ? "block" : "none"}} src='/images/icons/eye.svg' alt='eye'/>
            </div>
        );
    }
}

export default Input;

// For Chips
// <div className='chips'>
//     {this.state.chips.map((chip) => {
//         return (
//             <div key={chip} className='chip'>
//                 <img alt='remove chip' src='/images/icons/x.svg' />
//                 <h3>{chip}</h3>
//             </div>
//         )
//     })}
// </div> 