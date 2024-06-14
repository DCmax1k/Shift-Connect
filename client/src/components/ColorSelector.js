import React, { Component } from 'react';

class ColorSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
        }

        this.colors = ['#545775', '#489C74', '#9C4894', '#9C4848'];
        this.changeColor = this.changeColor.bind(this);
        this.changeColore = this.changeColore.bind(this);
        this.activate = this.activate.bind(this);
    }


    changeColor(color) {
        // Choose color
        this.setState({
            active: false,
        });

        // Callback
        this.props.changeColor(this.props.data, color);
    }

    changeColore(e) {
        this.changeColor(e.target.value);
    }

    activate() {
        this.setState({
            active: true,
        });
    }

    render() {
        const currentColor = this.props.data.color;
        const { active } = this.state;
        const colors = this.colors;

        if (this.props.user.plus) {
            return (
                <div className={`ColorSelector plus`}>
                    <div style={{backgroundColor: currentColor}}  className='outter'>
                        <div className='middle'>
                            <div className='inner' style={{backgroundColor: currentColor}}></div>
                        </div>
                    </div>
                    <input className='colorInput' type='color' onInput={this.changeColore} style={{backgroundColor: currentColor}} value={currentColor} />
                    
                </div>
            );
        } else {
            return (
                <div className='ColorSelector'>
                    <div id='currentColor' className={active ? '' : 'active'}>
                        <div onClick={this.activate} className='outter'style={{backgroundColor: currentColor}}>  <div className='middle'> <div className='inner' style={{backgroundColor: currentColor}}></div> </div>  </div>
                    </div>
    
                    <div id='otherColors' className={active ? 'active' : ''}>
                        {colors.map(color => (
                            <div key={color} onClick={() => {this.changeColor(color)}} className='outter'style={{backgroundColor: color}}>
                                <div className='middle'>
                                    <div className='inner' style={{backgroundColor: color}}></div>
                                </div> 
                            </div>
                        ))}
                    </div>
                    
                </div>
            );
        }
    }
}

export default ColorSelector