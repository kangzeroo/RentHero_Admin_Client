import {
  SAVE_PRODUCTS,
  SAVE_BILLABLE_CONVOS,
  SAVE_PLANS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  all_products: [],
  all_plans: [],
  billable_convos: [],
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_PRODUCTS:
      return {
        ...state,
        all_products: state.all_products.concat([action.payload]),
      }
    case SAVE_PLANS:
      return {
        ...state,
        all_plans: action.payload,
      }
    case SAVE_BILLABLE_CONVOS:
      return {
        ...state,
        billable_convos: action.payload,
      }
		default:
			return {
				...state
			}
	}
}
