import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import instance from "./config/axios";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";

// app.config.globalProperties.$axios = instance;

createApp(App).use(store).use(router, axios).mount("#app");
