import { createStore } from "vuex";
import axios from "axios";
import siteSetup from "./modules/siteSetup";
import userDetails from "./modules/userDetails";

export default createStore({
  state: {
    user: {
      access_token: localStorage.getItem("access_token") || "",
      refresh_token: localStorage.getItem("refresh_token") || "",
      isAuthenticated: !!localStorage.getItem("access_token"),
    },
  },
  getters: {},
  mutations: {
    initializeStore(state) {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("refresh_token")
      ) {
        state.user.access_token = localStorage.getItem("access_token");
        state.user.refresh_token = localStorage.getItem("refresh_token");
        state.user.isAuthenticated = true;
      } else {
        state.user.access_token = "";
        state.user.refresh_token = "";
        state.user.isAuthenticated = false;
      }
    },
    setToken(state, tokens) {
      state.user.access_token = tokens.access_token;
      state.user.refresh_token = tokens.refresh_token;
      state.user.isAuthenticated = true;
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
    },
    removeToken(state) {
      state.user.access_token = "";
      state.user.refresh_token = "";
      state.user.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
  actions: {
    async refreshToken({ commit, state }) {
      try {
        const response = await axios.post("authentication/refresh/", {
          refresh: state.user.refresh_token,
        });
        const tokens = {
          access_token: response.data.access,
          refresh_token: state.user.refresh_token,
        };
        commit("setToken", tokens);
        return response.data.access;
      } catch (error) {
        commit("removeToken");
        throw error;
      }
    },
    logout({ commit }) {
      commit("removeToken");
    },
  },
  modules: { siteSetup, userDetails },
});
