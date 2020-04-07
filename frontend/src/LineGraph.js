import { LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class LineGraph extends React.Component {

	get_data_points(data_type, state_list, raw_data) { 
		/* Each point should contain:
		 * 	Date - x value
		 *  state 1 - y value
		 *  state 2 - y value
		 **/
		let date_map = {};

		_.forEach(raw_data, (record) => {
			if( _.includes(state_list, record['State']) ){
				if( !_.has(date_map, record['Date']) ){
					date_map[record['Date']] = {}
				}
				console.log(record['Date'], record['State'], record[data_type]);
				date_map[record['Date']][record['State']] = record[data_type];
			}
		});

		let points = [];
		_.forEach(date_map, (data, date) => {
			let point = {...data, 'Date': date};
			points.push(point);
		});

		return points;
	}

	get_state_list() {
		let selected = [];
		_.forEach(this.props.selected, (meta, name) => {
			if(meta.selected) {
				selected.push(name);
			}
		});
		return selected;
	}

	get_state_meta(state_list) {
		let states = [];
		_.forEach(state_list, (name) => {
			states.push({...this.props.selected[name], name: name});
		});
		return states;
	}

	render() {
		let data_type = this.props.data_column;
		let state_list = this.get_state_list();
		let stateData = this.get_data_points(data_type, state_list, this.props.covid_data);

		let state_meta = this.get_state_meta(state_list);

		return (
			<div className="line-chart col-9">
				<LineChart width={730} height={600} data={stateData}
					margin={{ top: 5, right: 30, left: 50, bottom: 100 }}>
					<XAxis dataKey="Date" tick={{angle: 90, dy: 40}}/>
					<YAxis />
					<Tooltip />
					{state_meta.map((state) => 
						<Line
							key={state.name}
							type="monotone" dataKey={state.name} stroke={state.color} strokeWidth="3"
						/>
					)}
				</LineChart>
			</div>
		);
	}
}

function mapStateToProps(state) {
    return {
	  selected: state.selected_states,
	  data_column: state.data_type_picker.type,
	  covid_data: state.covid_data.raw
    };
  }

export default connect(mapStateToProps)(LineGraph);

