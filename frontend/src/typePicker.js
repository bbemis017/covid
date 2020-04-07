import React from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';

class TypePicker extends React.Component {

    selectType(type){
        this.props.dispatch({type: 'SELECT_DATA_COLUMN', column: type});
    }

	render() {
        let available_types = ['New Cases', 'Total Cases', 'Total Deaths'];
		return (
			<div className="type-picker">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    {available_types.map((type) => 
                        <button 
                            type="Button"
                            className={`btn btn-outline-primary ${type === this.props.type ? 'active': ''}`}
                            onClick={() => this.selectType(type)}
                        >
                            {type}
                        </button>
                    )}
                </div>
                
			</div>
		);
	}
}

function mapStateToProps(state) {
    return {
      type: state.data_type_picker.type
    };
  }

  export default connect(mapStateToProps)(TypePicker);

