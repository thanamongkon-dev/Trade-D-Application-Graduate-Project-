import axios from 'axios';

export const url = axios.create({
  baseURL: "127.0.0.1:3000" // Change this to your local IP address or
  // baseURL: "https://4k8qfdn5-3000.asse.devtunnels.ms/" // Change this to your local IP address or
  // baseURL: "https://trade-d-api.onrender.com" // Change this to your local IP address or
});

export const getPosts = () => url.get("/posts");
export const getChats = () => url.get("/getChat/1");