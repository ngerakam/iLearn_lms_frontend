import axios from "axios";

const state = {
  userDetails: {},
};

const getters = {
  userDetails: (state) => state.userDetails,
};

const mutations = {
  setUserDetails(state, userDetails) {
    state.userDetails = userDetails;
  },
  clearUserDetails(state) {
    state.userDetails = {};
  },
};

const actions = {
  async fetchUserDetails({ commit }) {
    try {
      const response = await axios.get("authentication/profile/");
      commit("setUserDetails", response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  },
  clearUserDetails({ commit }) {
    commit("clearUserDetails");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
