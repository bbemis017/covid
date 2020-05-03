import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {Dropdown} from 'react-bootstrap';

import DeclineCard from '../components/DeclineCard';

class FieldDeclines extends React.Component {

    render() {
        let field = this.props.current_field;
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
                <p className="text-center">in</p>
                <Dropdown className="text-center">
                    <Dropdown.Toggle variant="outline-primary" size="sm">
                        {field}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.props.fields.map((field) =>
                            <Dropdown.Item
                                onClick={() => this.props.dispatch({type: 'DECLINES_SET_FIELD', field: field})}
                                key={field}
                            >
                                {field}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
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
        direction_map: state.all_reducers.covid_data.directions,
        current_field: state.declines.current_field,
        fields: state.all_reducers.covid_data.field_list
    };
  }

  export default connect(mapStateToProps)(FieldDeclines);

