import axios from 'axios'
import { BILLINGS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const insertProduct = ({ name, type, description, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/insert_product`, { name, type, description, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getAllProducts = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_all_products`, {}, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getSpecificProduct = (product_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_specific_product`, { product_id, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}


export const getAllPlans = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_all_plans`, {}, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getSpecificPlan = (plan_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_specific_plan`, { plan_id, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getAllBillableConvos = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_all_billable_convos`, {}, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getAllMessagesForConvo = (proxy_id, lead_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_all_messages_for_convo`, { proxy_id, lead_id, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}


export const getSpecificSubscription = (customer_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BILLINGS_MICROSERVICE}/get_specific_subscription`, { customer_id, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
