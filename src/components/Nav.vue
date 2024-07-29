<template>
  <nav
    class="navbar is-text"
    role="navigation"
    aria-label="main navigation"
    style="min-height: 5rem"
  >
    <div class="navbar-brand">
      <template v-if="$store.state.user.isAuthenticated">
        <a
          v-if="siteSetup?.title === ''"
          href="/dashboard/"
          class="navbar-item is-size-4"
        >
          iLearn LMS
        </a>

        <a v-else href="/dashboard/" class="navbar-item is-size-4">{{
          siteSetup?.title
        }}</a>
      </template>
      <template v-else>
        <a v-if="siteSetup?.title === ''" href="/" class="navbar-item is-size-4"
          >iLearn LMS</a
        >

        <a v-else href="/" class="navbar-item is-size-4">{{ siteSetup?.title }}</a>
      </template>
      <div class="navbar-burger" data-target="navbar-item">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="navbar-menu" id="navbar-item">
      <div class="navbar-start">
        <template v-if="$store.state.user.isAuthenticated">
          <router-link to="/dashboard/" class="navbar-item">Home</router-link>
          <router-link to="/About" class="navbar-item">About</router-link>
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
              <a class="navbar-item"
                ><span class="tag is-link" v-if="userDetails?.user?.is_admin">
                  Admin
                </span>
                <span class="tag is-link" v-if="userDetails?.user?.is_teacher">
                  Teacher
                </span>
                <span class="tag is-success" v-if="userDetails?.user?.is_student">
                  Student
                </span>
              </a>
              <div class="navbar-item has-dropdown is-hoverable mr-5">
                <a class="navbar-link">
                  <i class="fa fa-user icon-spaced"></i>
                  <p></p>
                  {{ userDetails?.user?.first_name }}
                  {{ userDetails?.user?.last_name }}</a
                >

                <div class="navbar-dropdown">
                  <router-link
                    v-if="userDetails?.user?.is_teacher || userDetails?.user?.is_admin"
                    to="/dashboard/create-course"
                    class="navbar-item"
                    >Create Course</router-link
                  >
                  <router-link to="/dashboard/account" class="navbar-item"
                    >My account</router-link
                  >
                  <a @click="logout()" class="navbar-item">Log out</a>
                </div>
              </div>
            </template>
            <template v-else>
              <a href="/log-in" class="button is-light">
                <i class="fas fa-sign-in-alt icon-spaced"></i>
                Log in</a
              >
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Nav",
  computed: {
    ...mapState({
      siteSetup: (state) => state.siteSetup.siteSetup,
      userDetails: (state) => state.userDetails.userDetails,
    }),
  },
  mounted() {
    const navbarBurger = document.querySelector(".navbar-burger");
    const navbarMenu = document.querySelector("#navbar-item");

    if (navbarBurger) {
      navbarBurger.addEventListener("click", () => {
        navbarBurger.classList.toggle("is-active");
        navbarMenu.classList.toggle("is-active");
      });
    }
  },
  methods: {
    async logout() {
      console.log("logout");

      const refresh_token = localStorage.getItem("refresh_token");

      await axios
        .post("authentication/logout/", { refresh_token: refresh_token })
        .then((response) => {
          console.log(response.data);
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
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
.navbar-burger {
  cursor: pointer;
  display: block;
  height: 3.25rem;
  position: relative;
  width: 3.25rem;
}

.navbar-burger span {
  background-color: #333;
  display: block;
  height: 0.25rem;
  left: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background-color 0.2s ease-in-out;
  width: 100%;
}

.navbar-burger span:nth-child(1) {
  top: 30%;
}

.navbar-burger span:nth-child(3) {
  top: 70%;
}

.navbar-burger:hover span {
  background-color: #e6eaeb;
}

.navbar-menu {
  display: none;
}

.navbar-menu.is-active {
  background-color: hsla(221deg, 14%, 29%, 1); /* or any other color you want */
  padding: 1rem;
  position: absolute;
  top: 100%;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .navbar-menu {
    background-color: hsla(221deg, 14%, 29%, 1);
    position: absolute;
    top: 100%;
    width: 100%;
  }
}
</style>
