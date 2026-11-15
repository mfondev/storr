import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const base_url = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: base_url,
  timeout: 5000,
   headers: {
    'Content-Type': 'application/json',
  },
});

const authInstance = axios.create({
    baseURL: base_url,
})

export {axiosInstance,authInstance}