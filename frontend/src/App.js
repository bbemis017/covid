import React from 'react';
import { connect } from 'react-redux';
import './App.scss';

import LineGraph from './LineGraph';
import StatePicker from './StatePicker';
import TypePicker from './typePicker';

class App extends React.Component {

    componentDidMount() {
      fetch('data').then((response) => {
        return response.json();
      }).then((data) => {
        this.props.dispatch({type: 'RECEIVE_COVID_DATA', data: data})
      });
    }
    render() {
      return (
        <div className="App">
          <div className="container">
            <div className="row">
              <StatePicker></StatePicker>
              <div>
                <TypePicker></TypePicker>
                <LineGraph></LineGraph>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    raw_data: state.covid_data.raw
  };
}

export default connect(mapStateToProps)(App);
