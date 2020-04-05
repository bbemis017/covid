import React from 'react';
import { connect } from 'react-redux';

class StatePicker extends React.Component {

	render() {
		return (
			<div className="state-picker col-3 list-group">
                <h1>States</h1>
                <div className="items">
                    {Object.keys(this.props.selected_states).map((name) =>
                        <li
                            className={`list-group-item ${this.props.selected_states[name] ? 'selected': ''}`}
                            onClick={ () => this.props.dispatch({type: "TOGGLE_STATE", name: name})}
                            >
                                {name}
                        </li>
                    )}
                </div>
			</div>
		);
	}
}

function mapStateToProps(state) {
    return {
      selected_states: state.selected_states
    };
  }

  export default connect(mapStateToProps)(StatePicker);

