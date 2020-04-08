import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import covidData from './worldometer';
import _ from 'lodash';

import 'bootstrap/dist/css/bootstrap.min.css';

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

function get_column_list() {
  let columns = [];
  _.map(covidData[0], (value, column) => {
    if( column !== 'State' && column !== 'Date') {
      columns.push(column);
    }
  });
  return columns;
}

const initialState = {
    covid_data: {
      raw: []
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

function reducer(state = initialState, action) {

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
          raw: action.data
        }
      }
    default:
      return state;
  }
}

const store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
