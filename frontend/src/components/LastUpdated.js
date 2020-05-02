import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class LastUpdated extends React.Component {

    get_lastest_date() {
        /**
         * Get the latest date as javascript Date object
         */
        let latest_date_int = 20200101;
        _.forEach(this.props.raw_data, (record) => {
            let date = parseInt(record['Date']);
            if( date > latest_date_int) {
                latest_date_int = date;
            }
        });
        return this.get_date_obj(latest_date_int);
    }

    get_date_obj(date_int) {
        let date_str = date_int.toString();
        let year = date_str.slice(0,4);
        let month = date_str.slice(4,6);
        let day = date_str.slice(6,8);

        // javascript month range is 0-11
        month = parseInt(month) - 1;

        return new Date(year, month, day);
    }

    format(date_obj) {
        let months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date_obj.getMonth()]} ${date_obj.getDate()}, ${date_obj.getFullYear()}`
    }

    render() {
        let latest_date = this.get_lastest_date();
        return (
            <div className="last-updated text-center">
                <span>Updated: {this.format(latest_date)}</span>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        raw_data: state.all_reducers.covid_data.raw
    };
  }

  export default connect(mapStateToProps)(LastUpdated);

