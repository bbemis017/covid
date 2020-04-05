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
          states[state_name] = false;
      }
  }
  return states;
}

const initialState = {
    selected_states: get_state_map()
};

function reducer(state = initialState, action) {
  console.log('reducer', state, action);

  switch(action.type) {
    case 'TOGGLE_STATE':
      let selected = _.clone(state.selected_states, true);
      selected[action.name] = !selected[action.name];
      return {
        ...state,
        selected_states: selected
      }
    default:
      return state;
  }
}

const store = createStore(reducer);
store.dispatch({ type: "INCREMENT" });

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
