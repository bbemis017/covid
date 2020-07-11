import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import  _ from 'lodash';
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

class DeclineCard extends React.Component {

  format_number (num) {
    if(_.isEqual(num, null)) return '';

    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  render() {
    let last_record = this.props.last_date[this.props.state];
    if (_.isEqual(last_record, undefined)) return ('');

    let positive_dir = 1;

    let meta = this.props.direction_map[this.props.state][this.props.field];

    let color = _.isEqual(meta.direction, positive_dir)? 'red': 'green';
    let chart_params = `/chart?field=${this.props.field}&state=${this.props.state}@FF0000`;
    return (
        <div>
            <div className="state-card">
                <div className="card card-decline">
                  <Link to={chart_params}>
                    <div className="card-body">
                        <div className="float-right">
                            {!_.isEqual(meta.direction, 0) ?
                              <FontAwesomeIcon
                                icon={_.isEqual(meta.direction, 1) ? faArrowUp : faArrowDown}
                                color={color}
                              />
                              : (<span style={{color: color}}> no change &nbsp;</span>)
                            }
                            <span style={{color: color}}>{meta.days} day{meta.days > 1? 's': ''}</span>
                        </div>
                        <div>
                            <span>
                            {this.props.state}
                            : {this.format_number(last_record[this.props.field])}
                            </span>
                        </div>
                    </div>
                  </Link>
                </div>
            </div>
        </div>
    );
  }
}

DeclineCard.propTypes = {
    state: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    last_date: state.all_reducers.covid_data.last_date,
    direction_map: state.all_reducers.covid_data.directions
  };
}


export default connect(mapStateToProps)(DeclineCard);
