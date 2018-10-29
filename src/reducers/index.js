import { combineReducers } from 'redux'
import appReducer from './app/app_reducer'
import authReducer from './auth/auth_reducer'
import adsReducer from './ads/ads_reducer'
import agentsReducer from './agents/agents_reducer'
import corpsReducer from './corp/corp_reducer'
import billingsReducer from './billings/billings_reducer'

// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	ads: adsReducer,
	agents: agentsReducer,
	corps: corpsReducer,
	billings: billingsReducer,
})

export default rootReducer
