<template>
  <nav
    class="navbar is-text"
    role="navigation"
    aria-label="main navigation"
    style="min-height: 5rem"
  >
    <div class="navbar-brand">
      <template v-if="$store.state.user.isAuthenticated">
        <a href="/dashboard/home" class="navbar-item is-size-4">iLearn LMS</a>
      </template>
      <template v-else>
        <a href="/" class="navbar-item is-size-4">iLearn LMS</a>
      </template>
    </div>
    <div class="navbar-menu" id="navbar-item">
      <div class="navbar-start">
        <template v-if="$store.state.user.isAuthenticated">
          <router-link to="/dashboard/home" class="navbar-item"
            >Home</router-link
          >
          <router-link to="/About" class="navbar-item">About</router-link>
          <router-link to="/courses" class="navbar-item">Courses</router-link>
        </template>
        <template v-else>
          <router-link to="/" class="navbar-item">Home</router-link>
          <router-link to="/About" class="navbar-item">About</router-link>
          <router-link to="/courses" class="navbar-item">Courses</router-link>
        </template>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="$store.state.user.isAuthenticated">
              <div class="navbar-item has-dropdown is-hoverable mr-5">
                <a class="navbar-link"> Settings</a>

                <div class="navbar-dropdown">
                  <router-link to="/dashboard/create-course" class="navbar-item"
                    >Create Course</router-link
                  >
                  <router-link to="/dashboard/my-account" class="navbar-item"
                    >My account</router-link
                  >
                  <a @click="logout()" class="navbar-item">Log out</a>
                </div>
              </div>
            </template>
            <template v-else>
              <a href="/log-in" class="button is-light">Log in</a>
              <a href="/sign-up" class="button is-primary">SignUp</a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import axios from "axios";

export default {
  name: "Nav",
  methods: {
    async logout() {
      console.log("logout");

      await axios.post("token/logout/").then((response) => {
        console.log("Logged out");
      });

      axios.defaults.headers.common["Authorization"] = "";

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      this.$store.commit("removeToken");

      this.$router.push("/");
    },
  },
};
</script>
