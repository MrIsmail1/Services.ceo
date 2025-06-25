import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const nestAPIOptions: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_NEST_API_URL, // Nest API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const nestAPI: AxiosInstance = axios.create(nestAPIOptions);

const TokenRefreshClient: AxiosInstance = axios.create(nestAPIOptions);

TokenRefreshClient.interceptors.response.use(
  (response: AxiosResponse) => response.data
);

nestAPI.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError): Promise<never> => {
    if (error.response) {
      const { config, response } = error;
      const { status, data } = response || {};
      const dataObj = typeof data === "object" && data !== null ? data : {};
      return Promise.reject({ status, ...dataObj });
    }
    return Promise.reject(error);
  }
);

export { nestAPI };
