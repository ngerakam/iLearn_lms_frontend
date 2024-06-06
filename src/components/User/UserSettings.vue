<template>
  <div class="section">
    <h3 class="title is-4">Account Settings</h3>
    <div class="columns">
      <div class="column is-4">
        <div class="card ml-3">
          <figure class="image is-128x128">
            <img
              src="https://bulma.io/assets/images/placeholders/128x128.png"
            />
          </figure>
          {{ user.firstName }} {{ user.lastName }}
        </div>
      </div>
      <div class="column">
        <div class="section">
          <form @submit.prevent="updateProfile">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="user.username"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">First Name</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="user.firstName"
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
                  v-model="user.lastName"
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
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label"
                >Current Password (required for changes)</label
              >
              <div class="control">
                <input
                  class="input"
                  type="password"
                  v-model="currentPassword"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">New Password</label>
              <div class="control">
                <input class="input" type="password" v-model="newPassword" />
              </div>
            </div>
            <div class="field">
              <label class="label">Re-type New Password</label>
              <div class="control">
                <input class="input" type="password" v-model="newPassword2" />
              </div>
            </div>

            <div class="field">
              <label class="label">Profile Image</label>
              <div class="control">
                <div class="file is-fullwidth">
                  <label class="file-label">
                    <input
                      class="file-input"
                      type="file"
                      @change="handleImageUpload"
                    />
                    <span class="file-cta">
                      <span class="file-label">Choose a file...</span>
                    </span>
                    <span class="file-name">{{ imageFilename }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          <div v-if="errorMessage">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      currentPassword: "",
      newPassword: "",
      newPassword2: "",
      image: null, // Store uploaded image data
      imageFilename: "",
      errorMessage: "",
    };
  },
  created() {
    // Fetch user data on component creation (replace with your API call)
    axios
      .get("users/me")
      .then((response) => {
        console.log(response.data);
        this.user = response.data;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        this.errorMessage = "An error occurred while fetching your data.";
      });
  },
  methods: {
    handleImageUpload(event) {
      this.image = event.target.files[0];
      this.imageFilename = this.image.name;
    },
    updateProfile() {
      const formData = new FormData(); // Use FormData for file uploads
      formData.append("username", this.user.username);
      formData.append("firstName", this.user.firstName);
      formData.append("lastName", this.user.lastName);
    },
  },
};
</script>
