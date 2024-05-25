import React, { Component } from 'react';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            open: false,
         };

         this.filterCurrentFirst = this.filterCurrentFirst.bind(this);
         this.selectItem = this.selectItem.bind(this);
         this.toggle = this.toggle.bind(this);
    }

    filterCurrentFirst(items, current) {
        if (!items || items.length < 1) return [];
        const currentItem = items.find(item => item.id === current);
        const remainingItems = items.filter(item => item.id !== current);
        return [currentItem, ...remainingItems, {id: 'createOrg', title: 'Create a organization'}];
    }

    selectItem(itm) {
        if (itm.id === 'createOrg') return this.createOrg();
        if (!this.state.open || itm.id === this.props.current) return this.toggle();
        this.props.selectItem(itm);
        this.toggle();
    }

    toggle() {
        this.setState({
            open: !this.state.open,
        });
    }

    createOrg() {

    }

    render() {
        const { items, current } = this.props;
        return (
            <div className='Dropdown' style={{...style.Dropdown, width: this.props.width, overflowY: this.state.open ? 'visible' : 'hidden'}}>
                {this.filterCurrentFirst(items, current).map((itm, i) => (
                    <div key={i} className='dropitem' onClick={() => this.selectItem(itm)} style={itm.id === 'createOrg' ? {...style.dropitem, border: '0.5vh solid #424242', backgroundColor: '#282828'} : {...style.dropitem, backgroundColor: this.props.bgClr}}>
                        {itm.title}
                    </div>
                ))}
                {!items || items.length < 1 ? (
                    <div className='dropitem' style={{...style.dropitem, backgroundColor: this.props.bgClr}}>
                        No organizations yet
                    </div>
                ) : null}
                <img alt='arrow' src='/images/carrotArrow.svg' style={{...style.arrow, transform: this.state.open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0)'}}  />
            </div>
        );
    }
}

const style = {
    Dropdown: {
        height: '6vh',
        color: 'white',
        position: 'relative',
        cursor: 'pointer',
    },
    dropitem: {
        height: '6vh',
        width: '30vh',
        marginBottom: '0.5vh',
        borderRadius: '1vh',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        fontWeight: 900,
        paddingLeft: '2vh',
        fontSize: '2vh',
    },
    arrow: {
        height: '1vh',
        transition: 'transform 0.3s ease',
        position: 'absolute',
        top: '50%',
        right: '1vh',
    },
}

export default Dropdown;