import React from 'react';
import './App.scss';

import LineGraph from './LineGraph';
import StatePicker from './StatePicker';
import TypePicker from './typePicker';

function App() {
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

export default App;
