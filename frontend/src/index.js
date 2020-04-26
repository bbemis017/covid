import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import overview from './pages/overview'
import ChartPage from './pages/chart';
import ChartConfig from './pages/ChartConfig';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import root_reducer from './reducers/index';
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import covidData from './worldometer';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import 'bootstrap/dist/css/bootstrap.min.css';


class Root extends React.Component {
  constructor() {
    super();
    this.store = createStore(root_reducer);
    this.history = createBrowserHistory();
    this.history.listen(this.onRouteChange);
  }

  componentDidMount() {
    this.store.dispatch({type: 'RECEIVE_COVID_DATA', data: covidData});
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
    ReactGA.set({page: this.history.location.pathname}); // Update the user's current page
    ReactGA.pageview(this.history.location.pathname);
  }

  onRouteChange(location) {
    let data = {
      page: location.pathname
    };
    ReactGA.set(data); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  }

  render() {
        return (
          <React.StrictMode>
            <Provider store={this.store}>
              <Router history={this.history}>
                <Switch>
                  <Route path="/old_chart" component={App} />
                  <Route path="/chart" component={ChartPage} />
                  <Route path="/config" component={ChartConfig} />
                  <Route path="/" component={overview} />
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
