import axios from "axios";

export const BASE_URL = "http://localhost:8000";
export const API_URL = `${BASE_URL}/api`;

const ApiService = {

    get: async (endpoint) => {
        try {
            const response = await axios.get(`${API_URL}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error during service worker initialization: ${error}`);
        }
    },

};

export default ApiService;