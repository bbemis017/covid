import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import  _ from 'lodash';
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class FieldTick extends React.Component {

  format_number (num) {
    if(_.isEqual(num, null)) return '';

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  render() {
    let state_records = this.props.state_record_map[this.props.state];
    if (_.isEqual(state_records, undefined) || state_records < 1) return ( <div>Loading</div>);

    let positive_dir = this.props.positive_direction;
    if (_.isEqual(this.props.positive_direction, undefined)) {
      positive_dir = 1;
    }

    let display_fieldname = this.props.display_fieldname;
    if (_.isEqual(display_fieldname, undefined)) {
      display_fieldname = false;
    }

    let last_record = state_records[state_records.length - 1];
    let meta = this.props.direction_map[this.props.state][this.props.field];

    let color = _.isEqual(meta.direction, positive_dir)? 'red': 'green';
    return (
        <div className="field-tick">
            <div className="float-right">
                <FontAwesomeIcon
                    icon={_.isEqual(meta.direction, 1)? faArrowUp: faArrowDown}
                    color={color}
                />
                <span style={{color: color}}>{meta.days} day{meta.days > 1? 's': ''}</span>
            </div>
            <div>
                <span>
                  {display_fieldname? this.props.field: this.props.state}
                  : {this.format_number(last_record[this.props.field])}
                </span>
            </div>
        </div>
    );
  }
}

FieldTick.propTypes = {
    state: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    positive_direction: PropTypes.number,
    display_fieldname: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    state_record_map: state.all_reducers.covid_data.state_records,
    direction_map: state.all_reducers.covid_data.directions
  };
}


export default connect(mapStateToProps)(FieldTick);
