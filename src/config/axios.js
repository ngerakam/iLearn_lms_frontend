import axios from "axios";
import store from "./store";

axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = store.state.user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      try {
        await axios.post("token/refresh/");
        return axios(error.config);
      } catch (e) {
        store.commit("removeToken");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
