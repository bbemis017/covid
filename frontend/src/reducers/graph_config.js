
import queryString from 'query-string';
import _ from 'lodash';

const INITIAL_STATE ={
    current_field: 'New Cases',
    selected_states: {'USA Total': '#FF0000'},
    state_filter: '',
    filtered_states: [],
    end_date: new Date(), // Sets end_date to current date
    start_date: get_date_offset(new Date(), -90) // sets start_date to 90 days in the past
};

function get_selected_states(query_params, init_state) {
    let state_list = _.get(query_params, 'state', 'USA Total@0099ff');
    if (!Array.isArray(state_list)){
        state_list = [state_list];
    }

    let state_map = {};
    _.forEach(state_list, (item) => {
        let values = _.split(item, '@');
        state_map[values[0]] = '#' + values[1];
    });

    if(_.size(state_map) < 1) {
        return _.clone(init_state.selected_states);
    }
    return state_map;
}

function get_js_date(date_str) {
    /**Converts date string YYYYMMDD to javascript date */
    let year = date_str.substring(0,4);
    let month = date_str.substring(4,6);
    let day = date_str.substring(6,8);
    return new Date(year, month - 1, day);
}

function convert_date_to_str(date) {
    /**Converts Javascript Date to str format YYYMMDD */
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, 0);
    let day = date.getDate().toString().padStart(2, 0);
    return `${year}${month}${day}`
}

function get_date_offset(date, num_days) {
    /**Calculates new Javascript Date +/- days provided */
    date.setDate(date.getDate() + num_days);
    return date;
}

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case 'SELECT_GRAPH_FIELD':
        /**
         * changes the current field displayed on the graph
         * @param field - name of new field to use
         */
        return {
        ...state,
        current_field: action.field
        }
    case 'SELECT_STATE':
        /**
         * Selects the state
         * @param state - name of state to select
         * @param color - Hex color code to use when displaying state
         */
        return {
            ...state,
            selected_states:{
                ...state.selected_states,
                [action.state]: action.color
            }
        }
    case 'DESELECT_STATE':
        /**
         * Deselects the state
         * @param state - name of state
         */
        let new_selected = _.clone(state.selected_states);
        delete new_selected[action.state];
        return {
            ...state,
            selected_states:new_selected
        }
    case 'FILTER_STATES':
        /**
         * Updates State filter
         */
        return {
            ...state,
            state_filter: action.input,
            filtered_states: action.states
        }
    case 'SET_CONFIG':
        let query_params = queryString.parse(action.query_str);
        let start = _.get(query_params, 'start', convert_date_to_str(state.start_date));
        let end =  _.get(query_params, 'end', convert_date_to_str(state.end_date));
        return {
            ...state,
            current_field: _.get(query_params, 'field', 'New Cases'),
            selected_states: get_selected_states(query_params),
            start_date: get_js_date(start),
            end_date: get_js_date(end)
        }
    case 'SET_START':
        return {
            ...state,
            start_date: action.start
        }
    case 'SET_END':
        return {
            ...state,
            end_date: action.end
        }
    default:
      return state;
  }
}