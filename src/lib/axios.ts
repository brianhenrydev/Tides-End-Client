import axios from "axios";
// This function fetches data from the API
//

const apiRequest = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiRequest;

