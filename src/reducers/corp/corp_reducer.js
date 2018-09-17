import {
  SAVE_CORPS,
  SAVE_PROXIES,
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_corps: [],
  all_proxies: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_CORPS:
      return {
        ...state,
        all_corps: action.payload,
      }
      case SAVE_PROXIES:
        return {
          ...state,
          all_proxies: action.payload,
        }
    default:
      return {
        ...state,
      }
  }
}
