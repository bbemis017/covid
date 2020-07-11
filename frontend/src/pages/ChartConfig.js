import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import ReactGA from 'react-ga';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import FieldPicker from '../components/FieldPicker';
import StatePicker from '../components/StatePicker';

class ChartConfig extends React.Component {

  get_query_str() {

      // Add field to query string
      let query_str = '?field=' + this.props.selected_field;

      // Add states and colors to query string
      _.forOwn(this.props.selected_states, (color, state) =>{
          query_str += '&state=' + state + _.replace(color, /#/g, '@')
      });

      // Add Date Range to query string
      query_str += '&start=' + this.convert_date_to_str(this.props.start_date)
      query_str += '&end=' + this.convert_date_to_str(this.props.end_date);

      query_str += '&average=' + this.props.average;

      return query_str;
  }

  applyConfig() {
    let url = '/chart/' + this.get_query_str();
    this.props.history.push(url);
    ReactGA.event({
      category: 'ChartConfig',
      action: 'Apply',
      label: url
    });
  }

  convert_date_to_str(date) {
    /**Converts Javascript Date to str format YYYMMDD */
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, 0);
    let day = date.getDate().toString().padStart(2, 0);
    return `${year}${month}${day}`
  }

  componentDidMount() {
    this.props.dispatch({type: 'SET_CONFIG', query_str: this.props.location.search});

    if( this.is_mobile()) {
      // if mobile set the input boxes for all DatePickers as readOnly
      // this prvents the DatePicker from looking bad on mobile
      const datePickers = document.getElementsByClassName("react-datepicker__input-container");
      Array.from(datePickers).forEach((el => el.childNodes[0].setAttribute("readOnly", true)))
    }
  }

  is_mobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  }

  render() {
    return (
      <div className="chart-config container">
          <Link
            to={"/chart/" + this.props.location.search}
            className="corner-icon float-right"
          >
                <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    color={'#464a47'}
                />
          </Link>
          <h2>Options</h2>
          <hr/>
          <FieldPicker></FieldPicker>
          <hr/>
          <h4>Date Range</h4>
          <div className="container row date-range">
            <div className="col-md-6">
              <span>Start: </span>
              <DatePicker
                selected={this.props.start_date}
                onChange={date => {this.props.dispatch({type: 'SET_START', start: date});}}
              />
            </div>
            <div className="col-md-6">
              <span>  &nbsp;End: </span>
              <DatePicker
                selected={this.props.end_date}
                onChange={date => {this.props.dispatch({type: 'SET_END', end: date});}}
              />
            </div>
          </div>
          <hr />
          <span>Days to Average over</span>
          <input
            className="form-control"
            value={this.props.average}
            onChange={e => {this.props.dispatch({type: 'SET_AVERAGE', average: e.target.value});}}
          ></input>
          <hr />
          <StatePicker></StatePicker>
          <hr/>
          <button
              type="button"
              className="btn btn-outline-primary"
              onClick={()=> this.applyConfig()}
              >Apply
          </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.graph_config;
  return {
    selected_field: state.current_field,
    selected_states: state.selected_states,
    start_date: state.start_date,
    end_date: state.end_date,
    average: state.average
  };
}

export default connect(mapStateToProps)(ChartConfig);
