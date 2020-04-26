import React from 'react';
import { connect } from 'react-redux';
import  _ from 'lodash';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import {faFilter, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';


class ChartPage extends React.Component {

  componentDidMount() {
    this.props.dispatch({
        type: 'SET_CONFIG',
        query_str: this.props.location.search
    });
  }

  componentDidUpdate() {
    ReactGA.event({
        category: 'Chart',
        action: 'Field',
        label: this.props.field
    });
    _.forOwn(this.props.selected_states, (color, state) => {
        ReactGA.event({
            category: 'Chart',
            action: 'State',
            label: state
        });
    });
  }

  get_data_points(data_type, state_map, raw_data) { 
    /* Each point should contain:
     * 	Date - x value
     *  state 1 - y value
     *  state 2 - y value
     **/
    let date_map = {};

    _.forEach(raw_data, (record) => {
        if( _.has(state_map, record['State']) ){
            if( !_.has(date_map, record['Date']) ){
                date_map[record['Date']] = {}
            }
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

  render() {
      let data_points = this.get_data_points(this.props.field, this.props.selected_states, this.props.raw_data);
      return (
        <div className="chart-page">
            <Link
                to={"/config/" + this.props.location.search}
                className="corner-icon float-right"
            >
                <FontAwesomeIcon
                    icon={faFilter}
                    size="lg"
                    color={'#464a47'}
                />
            </Link>
            <Link
                to="/"
                className="corner-icon"
            >
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="lg"
                    color={'#464a47'}
                />
            </Link>
            <h4 className="text-center">{this.props.field}</h4>
            <ResponsiveContainer width="100%" height="100%" minWidth="300px" minHeight="300px">
                <LineChart data={data_points}
                    margin={{ top: 5, right: 5, left: 0, bottom: 100 }}>
                    <XAxis dataKey="Date" tick={{angle: 90, dy: 40}}/>
                    <YAxis />
                    <Tooltip />
                    {Object.keys(this.props.selected_states).map((state, index) => 
                        <Line
                            key={state}
                            type="monotone"
                            dataKey={state}
                            stroke={this.props.selected_states[state]}
                            strokeWidth="3"
                        />
                    )}
                    <Legend verticalAlign="top" height={36}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        raw_data: state.all_reducers.covid_data.raw,
        field: state.graph_config.current_field,
        selected_states: state.graph_config.selected_states
    };
}

export default connect(mapStateToProps)(ChartPage);
