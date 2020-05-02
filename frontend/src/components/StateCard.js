import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import  _ from 'lodash';
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

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
    let chart_params = '?field=New Cases&state=' + this.props.state_name + '@FF0000';
    return (
        <div className="state-card">
            <div className="card">
              <div className="card-body">
                  <Link
                    to={"/chart/" + chart_params}
                    className="float-right"
                  >
                    <FontAwesomeIcon
                      icon={faChartLine}
                      size="lg"
                      color={'blue'}
                    />
                  </Link>
                  <h5 className="card-title">{this.props.state_name}</h5>
                  <FieldTick field={'New Cases'} records={state_records}></FieldTick>
                  <FieldTick field={'New Deaths'} records={state_records}></FieldTick>
                  <FieldTick field={'Active Cases'} records={state_records}></FieldTick>
                  <FieldTick field={'Total Cases'} records={state_records}></FieldTick>
                  <FieldTick field={'Total Deaths'} records={state_records}></FieldTick>
                  <FieldTick field={'Total Tests'} records={state_records} positive_direction={-1}></FieldTick>
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
