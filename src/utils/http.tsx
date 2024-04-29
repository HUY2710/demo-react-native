import axios, { AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://662db806a7dda1fa378b24db.mockapi.io/api/v1/',
      timeout: 10000
    })
  }
}

const http = new Http().instance

export default http
