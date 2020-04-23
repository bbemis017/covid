
import _ from 'lodash';

const INITIAL_STATE ={
    current_field: 'New Cases',
    selected_states: {'USA Total': 'red'},
    state_filter: ''
};


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
            state_filter: action.input
        }
    default:
      return state;
  }
}