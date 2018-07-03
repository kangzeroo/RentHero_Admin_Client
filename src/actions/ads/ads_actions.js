import {
  SAVE_ADS,
} from '../action_types'

// authenticate the staff member's account
export const saveAdsToRedux = (ads) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_ADS,
      payload: ads,
    })
  }
}
