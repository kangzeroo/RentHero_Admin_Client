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

export const updateAgent = ({ agent_id, friendly_name, email, actual_email, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/update_agent`, { agent_id, friendly_name, email, actual_email, }, authHeaders())
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

export const selectOperatorForIntelligence = (agent_id, operators) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/select_operator_for_intelligence`, { agent_id, operators, }, authHeaders())
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

export const removeOperatorFromIntelligence = (agent_id, operator_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/remove_operator_from_intelligence`, { agent_id, operator_id, }, authHeaders())
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
