
import queryString from 'query-string';
import _ from 'lodash';

const INITIAL_STATE ={
    current_field: 'New Cases',
    selected_states: {'USA Total': '#FF0000'},
    state_filter: '',
    filtered_states: []
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
        return {
            ...state,
            current_field: _.get(query_params, 'field', 'New Cases'),
            selected_states: get_selected_states(query_params)
        }
    default:
      return state;
  }
}