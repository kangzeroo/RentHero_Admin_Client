import {
  SAVE_AGENTS,
  SAVE_OPERATORS,
} from '../action_types'

export const saveAgentsToRedux = (agents) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_AGENTS,
      payload: agents,
    })
  }
}

export const saveOperatorsToRedux = (operators) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_OPERATORS,
      payload: operators,
    })
  }
}
