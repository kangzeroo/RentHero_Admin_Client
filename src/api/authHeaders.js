
const authHeaders = () => {
  return {
    headers: {
      jwt: localStorage.getItem('header_token'),
      user_id: localStorage.getItem('admin_id'),
    }
  }
}

export default authHeaders;
