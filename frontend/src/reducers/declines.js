const INITIAL_STATE ={
    current_field: 'New Cases'
};

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case 'DECLINES_SET_FIELD':
        return {
            ...state,
            current_field: action.field
        }
    default:
      return state;
  }
}