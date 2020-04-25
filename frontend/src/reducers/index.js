import { combineReducers } from 'redux';
import all_reducers from './all_reducers';
import graph_config from './graph_config';

const rootReducer = combineReducers({
    all_reducers,
    graph_config
});

export default rootReducer;