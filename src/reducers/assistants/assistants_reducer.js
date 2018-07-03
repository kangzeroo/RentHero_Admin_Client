import {
  SAVE_ASSISTANTS
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_assistants: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_ASSISTANTS:
      return {
        ...state,
        all_assistants: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
