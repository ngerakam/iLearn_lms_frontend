<template>
  <div class="login">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <h1 class="title">Login</h1>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="colums">
          <div class="column is-4 is-offset-4">
            <figure class="image is-128x128 ml-auto mr-auto">
              <img :src="siteSetup.get_site_image" alt="placeholder-image" />
            </figure>
          </div>
          <div class="column is-4 is-offset-4">
            <form v-on:submit.prevent="submitForm">
              <div class="field">
                <label for="">Email</label>
                <div class="control">
                  <input type="email" class="input" v-model="email" />
                </div>
              </div>
              <div class="field">
                <label for="">Password</label>
                <div class="control">
                  <input type="password" class="input" v-model="password" />
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button class="button is-dark">Login</button>
                </div>
              </div>
            </form>
            <div class="notification is-danger mt-3 mb-3" v-if="errors.length">
              <button class="delete" @click="removeNotif()"></button>
              <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
            </div>
            <hr />
            Or <router-link to="/sign-up">Click here</router-link> to sign up!
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      errors: [],
    };
  },
  mounted() {
    document.title = "Login | iLearn";
  },
  computed: {
    ...mapState({
      siteSetup: (state) => state.siteSetup.siteSetup,
    }),
  },
  methods: {
    removeNotif() {
      this.errors = [];
    },
    async submitForm() {
      console.log("submitted");

      axios.defaults.headers.common["Authorization"] = "";

      localStorage.removeItem("token");

      this.errors = [];

      if (this.email === "") {
        this.errors.push("The email is missing!");
      }
      if (this.password === "") {
        this.errors.push("The password is missing!");
      }

      if (!this.errors.length) {
        const formData = {
          email: this.email,
          password: this.password,
        };

        try {
          const response = await axios.post("authentication/login/", formData, {
            withCredentials: true,
          });
          const tokens = response.data;
          console.log(response.data);

          this.$store.commit("setToken", tokens);

          axios.defaults.headers.common["Authorization"] =
            "Bearer " + tokens.access;

          localStorage.setItem("access_token", tokens.access);
          localStorage.setItem("refresh_token", tokens.refresh);

          // Fetch user details
          await this.$store.dispatch("userDetails/fetchUserDetails");

          this.$router.push("/dashboard/home");
        } catch (error) {
          if (error.response) {
            for (const property in error.response.data) {
              this.errors.push(`${property}: ${error.response.data[property]}`);
            }
            console.log(JSON.stringify(error.response.data));
          } else if (error.message) {
            this.errors.push("Something went wrong, please try again");

            console.log(JSON.stringify(error));
          }
        }
      }
    },
  },
};
</script>
