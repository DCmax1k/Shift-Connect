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
        const currentItem = items.find(item => JSON.stringify(item.id) === JSON.stringify(current));
        const remainingItems = items.filter(item => JSON.stringify(item.id) !== JSON.stringify(current));
        if (this.props.action) {
            const result = [currentItem, ...remainingItems, {id: 'actionFunc', title: this.props.actionText}];
            return result.filter(itm => itm !== undefined)
        } else {
            const result = [currentItem, ...remainingItems];
            return result.filter(itm => itm !== undefined)
        }
        
    }

    selectItem(itm) {
        if (itm.id === 'actionFunc') return this.actionFunc();

        if (!this.state.open || JSON.stringify(itm.id) === JSON.stringify(this.props.current)) return this.toggle();
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
        const filteredItems = this.filterCurrentFirst(items, current);
        
        return (
            <div className={`DropdownCont ${this.props.c}`} style={{width: this.props.width}}>
                <div className={`Dropdown ${this.state.open ? 'visible' : 'hidden'}`} style={{zIndex: this.props.z ? this.props.z : 1}}>
                    {filteredItems.map((itm, i) => {
                        return (
                        <div key={itm.id} className='dropitem' onClick={() => this.selectItem(itm)} style={itm.id === 'actionFunc' ? {border: '0.5vh solid #424242', backgroundColor: '#282828'} : {backgroundColor: this.props.bgClr}}>
                            {itm.title}
                        </div>
                    )})}
                    {!items || items.length < 1 ? (
                        <div className='dropitem' style={{backgroundColor: this.props.bgClr}}>
                            {this.props.emptyPlaceholder}
                        </div>
                    ) : null}
                    <img alt='arrow' className='arrow' src='/images/carrotArrow.svg' style={{transform: this.state.open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0)'}}  />
                </div>

            </div>
            
        );
    }
}

export default Dropdown;