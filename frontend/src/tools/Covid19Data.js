import _ from 'lodash';

class Covid19Data {

    constructor(raw_data) {
        this.raw_data = raw_data;

        this.processed_records = [];

        this.state_records = this.get_records_by_state(this.raw_data);
        this.states = _.keys(this.state_records);
        this.field_list = this.get_field_list(this.raw_data);

        this.state_directions = this.get_direction_map(this.state_records, this.field_list);
        this.last_date_records = this.get_last_date_records(this.raw_data);
    }

    get_records_by_state(covid_records) {
        /**
         * Separates records by state into map, state -> array of records
         */
        let map = {};
        _.forEach(covid_records, (record) => {
            let state = record['State'];
            if(!_.has(map, state)) {
                map[state] = [];
            }
            map[state].push(record);
        });

        if (_.has(map, null)){
            delete map[null];
        }

        return map;
    }

    get_field_list(covid_records) {
        /**
         * Gets list of the available fields in the data
         */
        let fields = [];
        _.forOwn(covid_records[0], (value, property) => {
            if (!_.isEqual(property, 'Date') && !_.isEqual(property, 'State')){
                fields.push(property);
            }
        });
        return fields;
    }

    get_direction_map(state_record_map, field_list) {
        /**
         * For each state and field calculate the direction meta and store in map
         * state -> field -> direction, days
         */

        let dir_map = {};
        _.forOwn(state_record_map, (records, state) => {
            let field_meta = {};
            _.forEach(field_list, (field) => {
                field_meta[field] = this.get_state_direction_meta(records, field);
            });
            dir_map[state] = field_meta;
        });

        return dir_map;
    }

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
          if ( _.isEqual(last_val, new_val) ) {
              new_dir = 0;
          } else if( last_val > new_val){
            // value has ticked up
            new_dir = 1;
          } else{
            new_dir = -1;
          }
    
          if(index < state_records.length - 2 && (!_.isEqual(new_dir, dir) && !_.isEqual(new_dir, 0)) ){
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

    get_last_date_records(covid_records) {
        let last_record =  covid_records[covid_records.length - 1];
        let last_date = last_record['Date'];

        // map of records from last date state->record
        let records = {};
        _.forEachRight(covid_records, (record) =>{
            if (_.isEqual(record['Date'], last_date)){
                records[record['State']] = record;
            } else {
                return; //TODO: figure out how to break
            }
        });

        return records;
    }

}

export default Covid19Data;