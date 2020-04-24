import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


class StatePicker extends React.Component {

    get_random_rgb_color(){
        /**
         * Generates random rgb color
         * @returns - array [r,g,b]
         */
        let rgb = [];
        for(let i = 0; i < 3; i++) {

            // random number between 0 inclusive to 10 inclusive
            let color_index = Math.floor(Math.random()*11)
            
            // color values can range from 0-250 (not going up to 256 for simplicity)
            // multiply index by 25 to get color values that are significantly different
            let color_val = color_index*25;
            rgb.push(color_val);
        }
        return rgb;
    }

    get_random_hex_color(){
        /**
         * Gets random Hex color
         */
        let rand_rgb = this.get_random_rgb_color();
        let hex = '#';
        _.forEach(rand_rgb, (color) => {
            hex += _.pad(color.toString(16), 2, '0');
        });
        return hex;
    }

    on_filter_change(event) {
        /**
         * This function gets called whenever the text in the search box changes
         * and updates the state filter
         */
        this.props.dispatch({
            type: "FILTER_STATES",
            input: event.target.value
        });
    }

    toggle_state(name){
        /**
         * Toggles whether or not the state is selected
         * @param name - state name
         */
        if (_.has(this.props.selected, name)){
            this.props.dispatch({
                type: "DESELECT_STATE",
                state: name
            });
        } else{
            this.props.dispatch({
                type: "SELECT_STATE",
                state: name,
                color: this.get_random_hex_color()
            });
        }
    }

    render() {

        // filter the states based on the filter_input
        let states = _.filter(this.props.all_states, (name) => {
            return _.includes(name.toLowerCase(), this.props.filter_input.toLowerCase())
                && this.props.filter_input.length > 0 // don't display anything if search is empty
                && !_.has(this.props.selected, name); // don't display selected states
        });
        return (
            <div className="state-picker container list-group">
                <h4>Selected States:</h4>
                <div className="row">
                    {Object.keys(this.props.selected).map((name)=>
                        <li
                            key={name}
                            className={`list-group-item`}
                            onClick={ () => this.toggle_state(name)}
                            style={_.get(this.props.selected, name, false) ?
                                    {backgroundColor: this.props.selected[name]}
                                    : {}}
                            >
                                {name}
                        </li>
                    )}
                </div>
                <input
                    placeholder="Add State"
                    onChange={(e) => this.on_filter_change(e)} 
                    value={this.props.filter_input}
                    className="form-control"
                />
                <div>
                    {states.map((name) =>
                        <li
                            key={name}
                            className={`list-group-item`}
                            onClick={ () => {
                                this.toggle_state(name);
                                this.props.dispatch({type:"FILTER_STATES", input: ""});
                            }}
                            style={_.get(this.props.selected, name, false) ?
                                    {backgroundColor: this.props.selected[name]}
                                    : {}}
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
      selected: state.graph_config.selected_states,
      all_states: state.all_reducers.covid_data.states,
      filter_input: state.graph_config.state_filter
    };
  }

  export default connect(mapStateToProps)(StatePicker);

