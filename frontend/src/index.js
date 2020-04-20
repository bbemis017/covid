import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import overview from './pages/overview'
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import root_reducer from './reducers/index';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import covidData from './worldometer';
import { connect } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';


class Root extends React.Component {
  constructor() {
    super();
    this.store = createStore(root_reducer);
  }

  componentDidMount() {
    this.store.dispatch({type: 'RECEIVE_COVID_DATA', data: covidData});
  }

  render() {
        return (
            <React.StrictMode>
            <Provider store={this.store}>
              <Router>
                <Switch>
                  <Route path="/test" component={overview} />
                  <Route path="/" component={App} />
                </Switch>
              </Router>
            </Provider>
          </React.StrictMode>
        );
    }
}

function mapStateToProps(state) {
  return {
    raw_data: state.all_reducers.covid_data.raw
  };
}

connect(mapStateToProps)(Root);

ReactDOM.render(
  <Root></Root>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
