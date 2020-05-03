import React from 'react';
import PropTypes from 'prop-types'
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

import FieldTick from './FieldTick';

class StateCard extends React.Component {

  render() {
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
                  <FieldTick state={this.props.state_name} field={'New Cases'} display_fieldname={true}></FieldTick>
                  <FieldTick state={this.props.state_name} field={'New Deaths'} display_fieldname={true}></FieldTick>
                  <FieldTick state={this.props.state_name} field={'Active Cases'} display_fieldname={true}></FieldTick>
                  <FieldTick state={this.props.state_name} field={'Total Cases'} display_fieldname={true}></FieldTick>
                  <FieldTick state={this.props.state_name} field={'Total Deaths'} display_fieldname={true}></FieldTick>
                  <FieldTick state={this.props.state_name} field={'Total Tests'} display_fieldname={true} positive_direction={-1}></FieldTick>
              </div>
            </div>
        </div>
    );
  }
}

StateCard.propTypes = {
    state_name: PropTypes.string.isRequired
};

export default StateCard;
