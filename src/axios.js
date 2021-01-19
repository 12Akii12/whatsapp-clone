import axios from "axios";

const instance = axios.create({
    baseURL: "https://whatsapp-backenddb.herokuapp.com/",
});

export default instance;