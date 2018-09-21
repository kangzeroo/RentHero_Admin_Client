import axios from 'axios'
import { ADMIN_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'


export const getAllCorporations = () => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/get_all_corporations`, {}, authHeaders())
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

export const saveStaffToCorporation = (corporation_id, staff_email) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ADMIN_MICROSERVICE}/save_staff_to_corporation`, { corporation_id, staff_email, }, authHeaders())
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
