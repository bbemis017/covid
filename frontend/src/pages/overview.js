import React from 'react';
import { connect } from 'react-redux';

class Overview extends React.Component {
    render() {
      return (
        <div className="Overview">
            <h1>Overview</h1>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(Overview);
