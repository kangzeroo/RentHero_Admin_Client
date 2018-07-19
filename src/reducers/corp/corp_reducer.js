import {
  SAVE_CORPS
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_corps: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_CORPS:
      return {
        ...state,
        all_corps: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
