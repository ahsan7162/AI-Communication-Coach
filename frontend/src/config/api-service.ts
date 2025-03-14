import axios, { AxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001/", // Change this to your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic API Service Methods
const apiService = {
  get: async <T>(
    url: string,
    useAuth: boolean = false, // Default to true
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const authConfig: AxiosRequestConfig = useAuth
      ? {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your token storage
          },
        }
      : {};

    const mergedConfig: AxiosRequestConfig = { ...authConfig, ...config };

    const response = await API.get<T>(url, mergedConfig);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: any,
    useAuth: boolean = false, // Default to true
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const authConfig: AxiosRequestConfig = useAuth
      ? {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust as needed
          },
        }
      : {};

    const mergedConfig: AxiosRequestConfig = { ...authConfig, ...config };

    const response = await API.post<T>(url, data, mergedConfig);
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await API.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await API.delete<T>(url, config);
    return response.data;
  },
};

export default apiService;
