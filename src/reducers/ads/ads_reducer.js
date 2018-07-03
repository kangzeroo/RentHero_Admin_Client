import {
  SAVE_ADS
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_ads: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_ADS:
      return {
        ...state,
        all_ads: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}
