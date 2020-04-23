import React from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';

class FieldPicker extends React.Component {

    selectType(type){
        this.props.dispatch({type: 'SELECT_GRAPH_FIELD', field: type});
    }

    render() {
        return (
            <div className="type-picker">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    {this.props.columns.map((type) => 
                        <button
                            key={type}
                            type="Button"
                            className={`btn btn-outline-primary ${type === this.props.type ? 'active': ''}`}
                            onClick={() => this.selectType(type)}
                        >
                            {type}
                        </button>
                    )}
                </div>
                
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
      type: state.graph_config.current_field,
      columns: state.all_reducers.data_type_picker.columns
    };
  }

  export default connect(mapStateToProps)(FieldPicker);

