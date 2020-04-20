import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import  _ from 'lodash';

class StateCard extends React.Component {

  get_state_totals(state) {
    let latest_date = 0;
    let latest_record = null;
    _.forEach(this.props.raw_data, (record, index) => {
        let date = parseInt(record['Date']);
        if (date >= latest_date && _.isEqual(record['State'], state) ){
          latest_date = date;
          latest_record = record;
        }
    });
    return latest_record;
  }
  render() {
    let record = this.get_state_totals(this.props.state_name);
    let name = record ? record['State']: 'Loading';
    let active_cases = record ? record['Active Cases']: 'Loading';
    let new_cases = record ? record['New Cases']: 'Loading';
    let new_deaths = record ? record['New Deaths']: 'Loading';
    let total_cases = record ? record['Total Cases']: 'Loading';
    let total_deaths = record ? record['Total Deaths']: 'Loading';
    let total_tests = record ? record['Total Tests']: 'Loading';
    return (
        <div className="state-card">
            <div className="card">
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">Active Cases: {active_cases}</p>
                <p className="card-text">New Cases: {new_cases}</p>
                <p className="card-text">New Deaths: {new_deaths}</p>
                <p className="card-text">Total Cases: {total_cases}</p>
                <p className="card-text">Total Deaths: {total_deaths}</p>
                <p className="card-text">Total Tests: {total_tests}</p>
            </div>
            </div>
        </div>
    );
  }
}

StateCard.propTypes = {
    state_name: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  state = state.all_reducers;
  return {
    raw_data: state.covid_data.raw
  };
}

export default connect(mapStateToProps)(StateCard);
