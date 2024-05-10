import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL = "http://localhost:8000";
export const API_URL = `${BASE_URL}/api`;

export const imageHeaders = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
};

export const jsonHeaders = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
};

const ApiService = {
  get: async (endpoint, headers: any = undefined) => {
    try {
      const response = headers
        ? await axios.get(`${API_URL}${endpoint}`, headers)
        : await axios.get(`${API_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error in the GET request: ${error}`);
    }
  },

  post: async (endpoint, data, headers = {}) => {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data, headers);
      return response.data;
    } catch (error) {
      console.error(`Error in the POST request: ${error}`);
    }
  },

  put: async (endpoint, data, headers = {}) => {
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, data, headers);
      return response.data;
    } catch (error) {
      console.error(`Error in the PUT request: ${error}`);
    }
  },

  delete: async (endpoint, headers = {}) => {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}`, headers);
      return response.data;
    } catch (error) {
      console.error(`Error in the PUT request: ${error}`);
    }
  },
};

export default ApiService;
