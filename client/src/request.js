import axios from "axios";
const API_URL = "https://agroapi.bongostores.shop/";
// const API_URL = "http://localhost:8003/";
export const request = axios.create({
  baseURL: API_URL,
});