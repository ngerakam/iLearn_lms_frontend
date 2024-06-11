import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import apiClient from "./api";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";
// axios.defaults.baseURL = "http://192.0.0.18/api/v1/";

// // Create the Vue app instance
// const app = createApp(App);

// // Set the Axios instance as a global property
// app.config.globalProperties.$axios = apiClient;

// // Use the store and router
// app.use(store);
// app.use(router);

// // Mount the app
// app.mount("#app");

createApp(App).use(store).use(router, axios).mount("#app");
