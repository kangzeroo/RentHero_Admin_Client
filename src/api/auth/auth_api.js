import axios from 'axios'
import { ASSISTANTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const saveGoogleCredentialsInServer = (code, identityId, googleId) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ASSISTANTS_MICROSERVICE}/initial_google_auth`, { code, identityId, googleId }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getAssistantProfile = (assistant_id, profile) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ASSISTANTS_MICROSERVICE}/retrieve_assistant_profile`, { assistant_id, profile }, authHeaders())
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

// export const getCorporationProfile = (corporation_id) => {
//   const p = new Promise((res, rej) => {
//     axios.post(`${ASSISTANTS_MICROSERVICE}/get_corporation_profile`, { corporation_id, }, authHeaders())
//       .then((data) => {
//         // once we have the response, only then do we dispatch an action to Redux
//         res(data.data)
//       })
//       .catch((err) => {
//         rej(err)
//       })
//   })
//   return p
// }
