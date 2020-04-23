import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import FieldPicker from '../components/FieldPicker';
import StatePicker from '../components/StatePicker';

class ChartConfig extends React.Component {

  get_param_str(state_meta, field) {
    let query_str = '?field=' + field;
    _.forEach(state_meta, (meta) => {
        query_str += '&state=' + meta.state + _.replace(meta.color, /#/g, '@')
    });
    return query_str;
  }

  render() {
    let state_meta = [{state: 'Illinois', color: '#001133'}];
    return (
      <div className="chart-config container">
          <h1>Graph Options</h1>
          <FieldPicker></FieldPicker>
          <StatePicker></StatePicker>
          <Link to={"/chart" + this.get_param_str(state_meta, 'New Cases')}>
            <button
                type="button"
                className="btn btn-outline-primary"
                >Apply</button>
          </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.all_reducers;
  return {
    // raw_data: state.covid_data.raw
  };
}

export default connect(mapStateToProps)(ChartConfig);
