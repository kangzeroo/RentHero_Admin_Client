import axios from 'axios'
import { ADMIN_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const getProxies = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/get_all_proxies`, {}, authHeaders())
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

export const saveProxyToIntGroup = ({ proxy_id, agent_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/save_proxy_to_int_group`, { proxy_id, agent_id, }, authHeaders())
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

export const removeProxyFromIntGroup = ({ proxy_id, agent_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/remove_proxy_from_int_group`, { proxy_id, agent_id, }, authHeaders())
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
