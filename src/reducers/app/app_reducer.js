import {
  CHANGE_LANGUAGE,
  CHANGE_TAB,
  STAGE_ONE_COMPLETE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_language: 'en',
  selected_tab: 'home',
  stage_one_complete: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        selected_language: action.payload,
      }
    case CHANGE_TAB:
      return {
        ...state,
        selected_tab: action.payload,
      }
    case STAGE_ONE_COMPLETE:
      return {
        ...state,
        stage_one_complete: true,
      }
		default:
			return {
				...state
			}
	}
}
