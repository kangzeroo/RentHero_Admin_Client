import {
  SAVE_ASSISTANTS,
} from '../action_types'

// authenticate the staff member's account
export const saveAssistantsToRedux = (assistants) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_ASSISTANTS,
      payload: assistants,
    })
  }
}
