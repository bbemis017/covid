import { combineReducers } from 'redux';
import all_reducers from './all_reducers';
import graph_config from './graph_config';
import declines from './declines';

const rootReducer = combineReducers({
    all_reducers,
    graph_config,
    declines
});

export default rootReducer;