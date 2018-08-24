import {
  CHANGE_LANGUAGE,
  CHANGE_TAB,
  STAGE_ONE_COMPLETE,
} from '../action_types'

// change the language of the app
export const changeAppLanguage = (languageCode) => {
  // dispatch lets you send actions to Redux
  localStorage.setItem('rentburrow_lang', languageCode)
  return (dispatch) => {
    dispatch({
      type: CHANGE_LANGUAGE,
      payload: languageCode,
    })
  }
}

export const changeSelectedTab = (tab) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_TAB,
      payload: tab,
    })
  }
}

export const stageOneComplete = () => {
  return (dispatch) => {
    dispatch({
      type: STAGE_ONE_COMPLETE,
      payload: true,
    })
  }
}
