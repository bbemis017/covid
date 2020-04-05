import React from 'react';
import { connect } from 'react-redux';

class StatePicker extends React.Component {

    get_random_color() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

	render() {
		return (
			<div className="state-picker col-3 list-group">
                <h1>States</h1>
                <div className="items">
                    {Object.keys(this.props.selected_states).map((name) =>
                        <li
                            key={name}
                            className={`list-group-item`}
                            onClick={ () => this.props.dispatch({type: "TOGGLE_STATE", name: name, color: this.get_random_color()})}
                            style={this.props.selected_states[name].selected ? {backgroundColor: this.props.selected_states[name].color}: {}}
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

