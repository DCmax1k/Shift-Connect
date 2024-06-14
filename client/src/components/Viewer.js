import React, { Component } from 'react';
import Dropdown from './widgets/Dropdown';

class Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            
         };

         this.selectView = this.selectView.bind(this);
    }

    selectView(item) {
        this.props.selectView(item.id);
    }

    render() {
        return (
            <div className='Viewer'>
                
                <Dropdown action={false} emptyPlaceholder={""} actionText={""} items={[{id: 'editor', title: 'Schedule Editor'}, {id: 'view', title: 'View Schedule'}]} current={this.props.lastView} width={'30vh'} selectItem={this.selectView} actionFunc={null} bgClr={'#424242'} z={1} c={''} />
            </div>
        );
    }
}

export default Viewer;