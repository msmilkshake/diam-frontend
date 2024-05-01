import axios from "axios";

const API_URL = "http://localhost:8000/api";

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