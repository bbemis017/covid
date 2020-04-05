import React from 'react';
import './App.scss';

import LineGraph from './LineGraph';
import StatePicker from './StatePicker';

function App() {
  return (
    <div className="App">
      <body className="container">
        <div className="row">
          <StatePicker></StatePicker>
          <LineGraph></LineGraph>
        </div>
      </body>
    </div>
  );
}

export default App;
