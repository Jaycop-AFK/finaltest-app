import axios from "axios"
import { URL_SERVER } from "../globals/url"

const instance = axios.create({
    baseURL: URL_SERVER || '',
  })
  instance.interceptors.request.use(async (config) => {
    const token: string | null = await localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  })

  export const axiosInstance = instance