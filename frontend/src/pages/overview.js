import React from 'react';
import { connect } from 'react-redux';

import StateCard from '../components/StateCard';

class Overview extends React.Component {

  render() {
    return (
      <div className="Overview container">
          <h3>COVID19 Overview</h3>
          <div className="row">
            <div className="col-lg-3">
              <StateCard state_name={'USA Total'}></StateCard>
            </div>
          </div>
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

export default connect(mapStateToProps)(Overview);
