import axios from "axios";
import constants from "../constants.js";

const judge0 = axios.create({
    baseURL: "https://judge0-ce.p.rapidapi.com",
    headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": constants.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
});

export default judge0;
