import axios from 'axios'
import { ADMIN_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const getAssistants = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/get_assistants`, {}, authHeaders())
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

export const insertAssistant = (email) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/insert_assistant`, { email, }, authHeaders())
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
