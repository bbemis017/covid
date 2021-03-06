import React from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

class TypePicker extends React.Component {

    selectType(type){
        this.props.dispatch({type: 'SELECT_DATA_COLUMN', column: type});
        ReactGA.event({
            category: 'Chart',
            action: 'Field',
            label: type
        });
    }

	render() {
		return (
			<div className="type-picker">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    {this.props.columns.map((type) => 
                        <button
                            key={type}
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
    state = state.all_reducers;
    return {
      type: state.data_type_picker.type,
      columns: state.data_type_picker.columns
    };
  }

  export default connect(mapStateToProps)(TypePicker);

