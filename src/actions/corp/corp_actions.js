import {
  SAVE_CORPS,
} from '../action_types'

export const saveCorpsToRedux = (corps) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_CORPS,
      payload: corps,
    })
  }
}
