import React from 'react';
import './App.scss';

import LineGraph from './LineGraph';
import StatePicker from './StatePicker';

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <StatePicker></StatePicker>
          <LineGraph></LineGraph>
        </div>
      </div>
    </div>
  );
}

export default App;
