import covidData from '../worldometer';
import _ from 'lodash';

function get_state_map() {
  let states = {};
  for(let i = 0; i < covidData.length; i++) {
      let state_name = covidData[i]['State'];
      if(Object.values(states).indexOf(state_name) < 0){
          states[state_name] = {selected: false, color: '#0099ff'};
      }
  }
  states['Indiana'].selected = true;
  return states;
}

function get_state_list(covid_records) {
  /**
   * Gets a unique sorted array of all the states in the raw covid data
   */
  let state_map = {};
  _.forEach(covid_records, (record) => {
    let state = record['State'];
    if(!_.has(state_map, state)){
      state_map[state] = true;
    }
  });
  let states = _.keys(state_map);
  return _.sortBy(states, (state)=> {return state.toLowerCase();});
}

function get_column_list() {
  let columns = [];
  _.map(covidData[0], (value, column) => {
    if( column !== 'State' && column !== 'Date') {
      columns.push(column);
    }
  });
  return columns;
}

const INITIAL_STATE ={
    covid_data: {
      raw: [],
      field_list: get_column_list(),
      states: []
    },
    selected_states: get_state_map(),
    state_picker: {
      filter_input: ''
    },
    data_type_picker: {
      type: 'New Cases',
      columns: get_column_list()
    }
};


export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case 'TOGGLE_STATE':
      let selected = _.clone(state.selected_states, true);
      selected[action.name] = {
        selected: !selected[action.name].selected,
        color: action.color
      }
      return {
        ...state,
        selected_states: selected
      }
    case 'FILTER_INPUT':
      return {
        ...state,
        state_picker: {
          filter_input: action.input
        }
      }
    case 'SELECT_DATA_COLUMN':
      return {
        ...state,
        data_type_picker: {
          ...state.data_type_picker,
          type: action.column
        }
      }
    case 'RECEIVE_COVID_DATA':
      return {
        ...state,
        covid_data: {
          raw: action.data,
          states: get_state_list(action.data)
        }
      }
    default:
      return state;
  }
}