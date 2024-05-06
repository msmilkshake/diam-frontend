import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export const BASE_URL = "http://localhost:8000";
export const API_URL = `${BASE_URL}/api`;

const ApiService = {

    get: async (endpoint) => {
        try {
            const response = await axios.get(`${API_URL}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error in the GET request: ${error}`);
        }
    },

    post: async (endpoint, data) => {
        try {
            const response = await axios.post(`${API_URL}${endpoint}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error in the POST request: ${error}`);
        }
    }

};

export default ApiService;