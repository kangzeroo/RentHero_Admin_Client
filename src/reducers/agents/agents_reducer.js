import {
  SAVE_AGENTS
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_agents: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_AGENTS:
      return {
        ...state,
        all_agents: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
