import axios from "axios";

export default axios.create({
    baseURL: "https://jsonplaceholder.typicode.com", // Cambiar a URL de la API del backend
    headers: {
        "Content-type": "application/json"
    }
});
