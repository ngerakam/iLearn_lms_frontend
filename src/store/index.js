import { createStore } from "vuex";

export default createStore({
  state: {
    user: {
      access_token: "",
      refresh_token: "",
      isAuthenticated: false,
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
      state.user.refresh_token = tokens.refresh_token;
      state.user.access_token = tokens.access_token;
      state.user.isAuthenticated = true;
    },
    removeToken(state) {
      state.user.access_token = "";
      state.user.refresh_token = "";
      state.user.isAuthenticated = false;
    },
  },
  actions: {},
  modules: {},
});
