import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueRewards from "vue-rewards";
import "@cyntler/react-doc-viewer/dist/index.css";
// import apiClient from "./api";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";
// axios.defaults.baseURL = "http://192.0.0.18/api/v1/";

// Axios request interceptor to add the Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = store.state.user.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await store.dispatch("refreshToken");
        const token = store.state.user.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (e) {
        store.dispatch("logout");
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

// Fetch site setup data and then initialize the app
store
  .dispatch("siteSetup/fetchSiteSetup")
  .then(() => {
    if (store.state.user.isAuthenticated) {
      return store.dispatch("userDetails/fetchUserDetails");
    }
  })
  .then(() => {
    createApp(App).use(store).use(router, axios).mount("#app");
  })
  .catch((error) => {
    console.error("Failed to fetch initial data before app mount:", error);
    createApp(App).use(store).use(router, axios).use(VueRewards).mount("#app");
  });
//createApp(App).use(store).use(router, axios).mount("#app");
