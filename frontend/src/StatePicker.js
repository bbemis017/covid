import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class StatePicker extends React.Component {

    get_random_color() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    on_text_change(event) {
      this.props.dispatch({type: "FILTER_INPUT", input: event.target.value})
    }

    select(name){
      this.props.dispatch({type: "TOGGLE_STATE", name: name, color: this.get_random_color()})
    }

	render() {
    let state_names = [];
    _.forEach(this.props.selected_states, (meta, name) => {
      state_names.push(name);
    });
    state_names = _.filter(state_names, (name) => {
      name = name.toLowerCase();
      return name === '' || _.includes(name, this.props.filter_input.toLowerCase());
    });
		return (
			<div className="state-picker col-sm-3 list-group">
          <h1>States</h1>
          <input placeholder="Search" onChange={(e) => this.on_text_change(e)} />
          <div className="items">
              {state_names.map((name) =>
                  <li
                      key={name}
                      className={`list-group-item`}
                      onClick={ () => this.select(name)}
                      onDoubleClick={() => this.select(name)}
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
    state = state.all_reducers;
    return {
      selected_states: state.selected_states,
      filter_input: state.state_picker.filter_input
    };
  }

  export default connect(mapStateToProps)(StatePicker);

