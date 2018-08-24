import {
  SAVE_AGENTS,
  SAVE_OPERATORS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_agents: [],
  all_operators: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_AGENTS:
      return {
        ...state,
        all_agents: action.payload,
      }
    case SAVE_OPERATORS:
      return {
        ...state,
        all_operators: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
