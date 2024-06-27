<template>
  <div class="container mt-5">
    <div class="columns">
      <div class="column">
        <button class="button is-small is-responsive" @click="goBack">
          <i class="fas fa-arrow-left icon-spaced"></i>Back
        </button>
      </div>
      <div class="column"></div>
      <div class="column"></div>
    </div>
    <h2 class="title is-4">Edit User</h2>
    <form @submit.prevent="saveUser">
      <div class="field">
        <label class="label">First Name</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="user.first_name"
            placeholder="First Name"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Last Name</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="user.last_name"
            placeholder="Last Name"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            class="input"
            type="email"
            v-model="user.email"
            placeholder="Email"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Roles</label>
        <div class="control">
          <label class="checkbox">
            <input class="mr-2" type="checkbox" v-model="userRoles.admin" />
            Admin
          </label>
          <label class="checkbox">
            <input
              class="mr-2 ml-2"
              type="checkbox"
              v-model="userRoles.teacher"
            />
            Teacher
          </label>
          <label class="checkbox">
            <input
              class="mr-2 ml-2"
              type="checkbox"
              v-model="userRoles.student"
            />
            Student
          </label>
        </div>
      </div>
      <div class="field">
        <div class="control buttons">
          <button class="button is-primary">
            <i class="fas fa-user-edit icon-spaced"></i>
            Save
          </button>
          <button class="button is-danger" @click="handleDelete">
            <i class="fas fa-minus icon-spaced"></i>
            Delete
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      user: {},
      userRoles: {
        admin: false,
        teacher: false,
        student: false,
      },
    };
  },
  mounted() {
    this.getUserDetails();
  },
  methods: {
    async getUserDetails() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`authentication/user/${id}/`);
        this.user = response.data;
        this.userRoles.admin = this.user.is_superuser;
        this.userRoles.teacher = this.user.is_teacher;
        this.userRoles.student = this.user.is_student;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    async saveUser() {
      const id = this.$route.params.id;
      try {
        // Update user roles based on checkboxes
        this.user.is_superuser = this.userRoles.admin;
        this.user.is_teacher = this.userRoles.teacher;
        this.user.is_student = this.userRoles.student;

        // Make API call to update user details
        await axios.put(`authentication/user/${id}/`, this.user);
        // console.log(this.user);

        this.$router.back(); // Redirect to user list page
      } catch (error) {
        console.error("Error saving user:", error);
      }
    },
    goBack() {
      this.$router.back();
    },
    async handleDelete() {
      const id = this.$route.params.id;
      await axios
        .delete(`authentication/user/${id}/delete/`)
        .then((response) => {
          if (response.data.message) {
            // console.log(response.data);
          }
        });
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
