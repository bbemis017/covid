import React from 'react';
import PropTypes from 'prop-types'
import  _ from 'lodash';
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class FieldTick extends React.Component {

  get_state_direction_meta(state_records, field) {
    /**
     * Gets dictionary of direction info for a state's fields.
     *      - direction: 1 - values are going up for the state's field
     *                  -1 - values are going down for the state's field
     *      - days: number of days since last direction change
     * @param state_records - list of records for state
     * @param field - name of field to get direction info for
     */
    if (state_records.length < 2) { return {} }

    let last_val = parseInt(state_records[state_records.length - 1][field]);
    let days = 0;
    let dir = 0;
    for(let index = state_records.length - 2; index >= 0; index--){
      let new_val = parseInt(state_records[index][field]);
      let new_dir = 0;
      if( last_val > new_val){
        // value has ticked up
        new_dir = 1;
      } else{
        new_dir = -1;
      }

      if(index < state_records.length - 2 && !_.isEqual(new_dir, dir)){
        // Change in direction, stop processing
        break;
      }

      dir = new_dir;
      last_val = new_val;
      days++;
    }
    return {
      direction: dir,
      days: days
    }
  }

  format_number (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  render() {
    if (_.isEqual(this.props.records, undefined) || this.props.records.length < 1) return ( <div>Loading</div>);

    let positive_dir = this.props.positive_direction;
    if (_.isEqual(this.props.positive_direction, undefined)) {
      positive_dir = 1;
    }

    let meta = this.get_state_direction_meta(this.props.records,this.props.field);
    let last_record = this.props.records[this.props.records.length - 1];
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
                <span>{this.props.field}: {this.format_number(last_record[this.props.field])}</span>
            </div>
        </div>
    );
  }
}

FieldTick.propTypes = {
    field: PropTypes.string.isRequired,
    records: PropTypes.array.isRequired,
    positive_direction: PropTypes.number
};

export default FieldTick;
