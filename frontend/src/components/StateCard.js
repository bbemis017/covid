import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import  _ from 'lodash';

import FieldTick from './FieldTick';

class StateCard extends React.Component {

  get_state_records(state){
    let state_records = [];
    _.forEach(this.props.raw_data, (record) => {
      if( _.isEqual(record['State'], state) ) {
        state_records.push(record);
      }
    });
    return state_records;
  }

  render() {
    let state_records = this.get_state_records(this.props.state_name);
    return (
        <div className="state-card">
            <div className="card">
              <div className="card-body">
                  <h5 className="card-title">{this.props.state_name}</h5>
                  <FieldTick field={'New Cases'} records={state_records}></FieldTick>
                  <FieldTick field={'New Deaths'} records={state_records}></FieldTick>
                  <FieldTick field={'Total Cases'} records={state_records}></FieldTick>
                  <FieldTick field={'Total Deaths'} records={state_records}></FieldTick>
                  <FieldTick field={'Total Tests'} records={state_records}></FieldTick>
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
