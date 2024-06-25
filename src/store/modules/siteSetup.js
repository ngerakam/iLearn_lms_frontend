import axios from "axios";

const state = {
  siteSetup: {},
};

const getters = {
  siteSetup: (state) => state.siteSetup,
};

const mutations = {
  setSiteSetup(state, setup) {
    state.siteSetup = setup;
  },
};

const actions = {
  async fetchSiteSetup({ commit }) {
    try {
      const response = await axios.get("authentication/site-setup/");
      commit("setSiteSetup", response.data);
      return response.data; // Ensure a promise is returned
    } catch (error) {
      console.error("Error fetching site setup data:", error);
      throw error; // Ensure the error is propagated
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
