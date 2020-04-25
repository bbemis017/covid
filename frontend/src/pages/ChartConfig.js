import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";

import FieldPicker from '../components/FieldPicker';
import StatePicker from '../components/StatePicker';

class ChartConfig extends React.Component {

  get_query_str() {
      let query_str = '?field=' + this.props.selected_field;
      _.forOwn(this.props.selected_states, (color, state) =>{
          query_str += '&state=' + state + _.replace(color, /#/g, '@')
      });
      return query_str;
  }

  componentDidMount() {
    this.props.dispatch({type: 'SET_CONFIG', query_str: this.props.location.search});
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
          <StatePicker></StatePicker>
          <hr/>
          <Link
            to={"/chart/" + this.get_query_str()}
            className="float-right"
          >
            <button
                type="button"
                className="btn btn-outline-primary"
                >Apply
            </button>
          </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.graph_config;
  return {
    selected_field: state.current_field,
    selected_states: state.selected_states
  };
}

export default connect(mapStateToProps)(ChartConfig);
