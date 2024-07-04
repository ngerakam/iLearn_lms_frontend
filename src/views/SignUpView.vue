<template>
  <div class="signup">
    <div class="hero is-info">
      <div class="columns py-3 px-3">
        <div class="column">
          <button class="button is-small is-responsive" @click="goBack">
            <i class="fas fa-arrow-left icon-spaced"></i>Back
          </button>
        </div>
        <div class="column"></div>
        <div class="column"></div>
      </div>
      <div class="mb-2 has-text-centered">
        <h1 class="title is-4">Create User</h1>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <form v-on:submit.prevent="submitForm">
              <div class="field">
                <label>First Name</label>
                <div class="control">
                  <input type="text" class="input" v-model="first_name" />
                </div>
              </div>
              <div class="field">
                <label>Last Name</label>
                <div class="control">
                  <input type="text" class="input" v-model="last_name" />
                </div>
              </div>
              <div class="field">
                <label>Email</label>
                <div class="control">
                  <input type="email" class="input" v-model="email" />
                </div>
              </div>

              <div class="field">
                <label>Role</label>
                <div class="control columns">
                  <div v-for="role in roles" :key="role" class="control column">
                    <label class="radio">
                      <input type="radio" v-model="selectedRole" :value="role" />
                      {{ role }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="field">
                <label>Gender</label>
                <div class="control columns">
                  <div v-for="sex in genders" :key="sex" class="control column">
                    <label class="radio">
                      <input type="radio" v-model="gender" :value="sex" />
                      {{ sex }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button class="button is-dark">Register User</button>
                </div>
              </div>
            </form>
            <div class="notification is-danger mt-3 mb-3" v-if="errors.length">
              <button class="delete" @click="removeNotif()"></button>
              <p v-for="error in errors" :key="error">{{ error }}</p>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      selectedRole: "",
      errors: [],
      roles: ["teacher", "student", "admin"],
      gender: "",
      genders: ["Male", "Female"],
    };
  },
  mounted() {
    document.title = "Sign Up | iLearn";
  },
  methods: {
    removeNotif() {
      this.errors = [];
    },
    submitForm() {
      console.log("submitted");

      this.errors = [];

      if (this.email === "") {
        this.errors.push("The email is missing!");
      }

      if (!this.errors.length) {
        const formData = {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          selectedRole: this.selectedRole,
          gender: this.gender,
        };

        axios
          .post("authentication/register/", formData)
          .then((response) => {
            console.log(response.data);
            this.$router.back();
          })
          .catch((error) => {
            if (error.response) {
              for (const property in error.response.data) {
                this.errors.push(`${property}: ${error.response.data[property]}`);
              }
              console.log(JSON.stringify(error.response.data));
            } else if (error.message) {
              this.errors.push("Something went wrong, please try again");

              console.log(JSON.stringify(error));
            }
          });
      }
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
