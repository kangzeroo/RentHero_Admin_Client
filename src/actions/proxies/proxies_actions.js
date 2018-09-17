import {
  SAVE_PROXIES,
} from '../action_types'

export const saveProxiesToRedux = (proxies) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_PROXIES,
      payload: proxies,
    })
  }
}
