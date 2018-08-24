import axios from 'axios'
import { ADMIN_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const getAgents = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/get_agents`, {}, authHeaders())
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

export const insertAgent = (friendly_name, email) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/insert_agent`, { friendly_name, email, }, authHeaders())
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

export const getOperators = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/get_operators`, {}, authHeaders())
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

export const insertOperator = (email, agent_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/insert_operator`, { email, agent_id, }, authHeaders())
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
