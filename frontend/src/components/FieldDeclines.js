import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DeclineCard from '../components/DeclineCard';

class FieldDeclines extends React.Component {

    render() {
        let field = 'New Cases';
        let directions = [];

        // filter direction meta for the current field and the state into the list
        _.forOwn(this.props.direction_map, (field_meta, state) => {
            directions.push({...field_meta[field], state: state});
        });

        directions = _.partition(directions, (state)=>{return _.isEqual(state.direction, -1);});
        directions[0] = _.orderBy(directions[0], ['days', 'state'], ['desc', 'desc']);
        directions[1] = _.orderBy(directions[1], ['days', 'state'], ['asc', 'desc']);

        if (_.isEqual(directions, undefined) || directions.length < 1) return ( <div>Loading</div>);

        return (
            <div className="field-declines">
                <h3 className="text-center">Longest Declines</h3>
                <p className="text-center">in {field}</p>
                {directions.map((partition) => 
                    partition.map((state) => 
                        <DeclineCard key={state.state} state={state.state} field={field}></DeclineCard>
                    )
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        direction_map: state.all_reducers.covid_data.directions
    };
  }

  export default connect(mapStateToProps)(FieldDeclines);

