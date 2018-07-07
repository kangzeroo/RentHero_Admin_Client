import {
  SAVE_AGENTS,
} from '../action_types'

// authenticate the staff member's account
export const saveAgentsToRedux = (agents) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_AGENTS,
      payload: agents,
    })
  }
}
