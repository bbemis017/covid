import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
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


class ChartPage extends React.Component {

  //hex colors https://htmlcolorcodes.com/
  get_state_meta(query_params){
    let states = _.get(query_params, 'state', 'USA Total@0099ff');
    if (!Array.isArray(states)){
        states = [states];
    }

    let meta_list = [];
    _.forEach(states, (item) => {
        let values = _.split(item, '@');
        meta_list.push({'state': values[0], 'color': '#' + values[1]});
    });
    return meta_list;
  }

  get_state_list(state_meta){
    let states = [];
    _.forEach(state_meta, (meta) =>{
        states.push(meta.state);
    });
    return states;
  }

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
      let query_params = queryString.parse(this.props.location.search);
      let field = _.get(query_params, 'field', 'New Cases')
      let state_meta = this.get_state_meta(query_params);
      let state_list = this.get_state_list(state_meta);

      let data_points = this.get_data_points(field, state_list, this.props.raw_data);
      return (
        <div className="chart-page">
            <Link to={"/config/" + this.props.location.search}>
                <FontAwesomeIcon
                    icon={faFilter}
                    size="lg"
                    className="float-right"
                    color={'#464a47'}
                />
            </Link>
            <Link to="/">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="lg"
                    color={'#464a47'}
                />
            </Link>
            <h3>{field}</h3>
            <ResponsiveContainer width="100%" height="100%" minWidth="300px" minHeight="300px">
                <LineChart data={data_points}
                    margin={{ top: 5, right: 5, left: 0, bottom: 100 }}>
                    <XAxis dataKey="Date" tick={{angle: 90, dy: 40}}/>
                    <YAxis />
                    <Tooltip />
                    {state_meta.map((meta) => 
                        <Line
                            key={meta.state}
                            type="monotone"
                            dataKey={meta.state}
                            stroke={meta.color}
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
    state = state.all_reducers;
    return {
        raw_data: state.covid_data.raw
    };
}

export default connect(mapStateToProps)(ChartPage);
