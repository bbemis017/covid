import React from 'react';
import covidData from './worldometer'

class StatePicker extends React.Component {
    constructor() {
        super();
        this.state = this.get_state_map();
    }

    get_state_map() {
        let states = {};
        for(let i = 0; i < covidData.length; i++) {
            let state_name = covidData[i]['State'];
            if(Object.values(states).indexOf(state_name) < 0){
                states[state_name] = false;
            }
        }
        console.log(states);
        return states;
    }

    handleClick(name) {
        this.setState({
            [name]: !this.state[name]
        });
    }

	render() {
		return (
			<div className="state-picker col-3 list-group">
                <h1>States</h1>
                <div className="items">
                    {Object.keys(this.state).map((name) =>
                        <li
                            className={`list-group-item ${this.state[name] ? 'selected': ''}`}
                            onClick={ () => this.handleClick(name)}
                            >
                                {name}
                        </li>
                    )}
                </div>
			</div>
		);
	}
}


export default StatePicker

