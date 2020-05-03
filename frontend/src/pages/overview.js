import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import StateCard from '../components/StateCard';
import LastUpdated from '../components/LastUpdated';
import FieldDeclines from '../components/FieldDeclines';

class Overview extends React.Component {

  render() {
    return (
      <div className="overview container">
          <h3 className="text-center">COVID19 Overview</h3>
          <div className="graph-links">
            <Link
              to="/old_chart"
              className=""
            >
              <button type="button" className="btn btn-outline-primary">Old Look</button>
            </Link>
            <Link
              to="/chart"
              className="float-right"
            >
              <button type="button" className="btn btn-outline-primary">New Graph</button>
            </Link>
          </div>
          <LastUpdated></LastUpdated>
          <div className="row state-stats">
            <div className="col-lg-4">
              <StateCard state_name={'USA Total'}></StateCard>
            </div>
            <div className="col-lg-4">
              <StateCard state_name={'Indiana'}></StateCard>
            </div>
            <div className="col-lg-4">
              <StateCard state_name={'Illinois'}></StateCard>
            </div>
          </div>
          <hr/>
          <FieldDeclines></FieldDeclines>
          <hr/>
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
