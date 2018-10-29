import {
  SAVE_PRODUCTS,
  SAVE_BILLABLE_CONVOS,
  SAVE_PLANS,
} from '../action_types'

export const saveProductsToRedux = (products) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_PRODUCTS,
      payload: products,
    })
  }
}

export const savePlansToRedux = (plans) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_PLANS,
      payload: plans,
    })
  }
}

export const saveBillableConvosToRedux = (convos) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_BILLABLE_CONVOS,
      payload: convos,
    })
  }
}
