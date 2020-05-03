import covidData from '../worldometer';
import _ from 'lodash';

import CovidTransform from '../tools/Covid19Data';

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

const INITIAL_STATE ={
    covid_data: {
      raw: [],
      state_records: {},
      field_list: [],
      states: [],
      directions: {},
      last_date: {}
    },
    selected_states: get_state_map(),
    state_picker: {
      filter_input: ''
    },
    data_type_picker: {
      type: 'New Cases',
      columns: []
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
      let dataTransform = new CovidTransform(action.data);
      return {
        ...state,
        covid_data: {
          raw: action.data,
          state_records: dataTransform.state_records,
          field_list: dataTransform.field_list,
          states: dataTransform.states,
          directions: dataTransform.state_directions,
          last_date: dataTransform.last_date_records
        },
        data_type_picker: {
          columns: dataTransform.field_list
        }
      }
    default:
      return state;
  }
}