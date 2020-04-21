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
    ResponsiveContainer
} from 'recharts';


class ChartPage extends React.Component {

  //hex colors https://htmlcolorcodes.com/

// TODO
//   get_state_meta(query_params){
//     let list = _.get(query_params, 'state', ['Indiana,#0099ff']);
//     let meta_list = [];
//     _.forEach(list, (item) => {
//         meta_list.append()
//     });
//   }

  get_state_list(query_params){
    let list = _.get(query_params, 'state', ['Indiana']);
    if( !Array.isArray(list) ){
        list = [list];
    }
    return list;
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
      let state_list = this.get_state_list(query_params);


      let data_points = this.get_data_points(field, state_list, this.props.raw_data);
      return (
        <div className="chart-page">
            <h1>Chart</h1>
            <ResponsiveContainer width="100%" minWidth="300px" minHeight="500px">
                <LineChart data={data_points}
                    margin={{ top: 5, right: 5, left: 0, bottom: 100 }}>
                    <XAxis dataKey="Date" tick={{angle: 90, dy: 40}}/>
                    <YAxis />
                    <Tooltip />
                    {state_list.map((state) => 
                        <Line
                            key={state}
                            type="monotone"
                            dataKey={state}
                            // stroke={'red'}
                            strokeWidth="3"
                        />
                    )}
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
