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
        return [currentItem, ...remainingItems, {id: 'actionFunc', title: 'Create an organization'}];
    }

    selectItem(itm) {
        if (itm.id === 'actionFunc') return this.actionFunc();
        if (!this.state.open || itm.id === this.props.current) return this.toggle();
        this.props.selectItem(itm);
        this.toggle();
    }

    toggle() {
        this.setState({
            open: !this.state.open,
        });
    }

    actionFunc() {
        this.setState({
            open: false,
        });
        this.props.actionFunc();
    }

    render() {
        const { items, current } = this.props;
        return (
            <div className='DropdownCont' style={{width: this.props.width}}>
                <div className={`Dropdown ${this.state.open ? 'visible' : 'hidden'}`}>
                    {this.filterCurrentFirst(items, current).map((itm, i) => (
                        <div key={itm.id} className='dropitem' onClick={() => this.selectItem(itm)} style={itm.id === 'actionFunc' ? {border: '0.5vh solid #424242', backgroundColor: '#282828'} : {backgroundColor: this.props.bgClr}}>
                            {itm.title}
                        </div>
                    ))}
                    {!items || items.length < 1 ? (
                        <div className='dropitem' style={{backgroundColor: this.props.bgClr}}>
                            No organizations yet
                        </div>
                    ) : null}
                    <img alt='arrow' className='arrow' src='/images/carrotArrow.svg' style={{transform: this.state.open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0)'}}  />
                </div>

            </div>
            
        );
    }
}

export default Dropdown;