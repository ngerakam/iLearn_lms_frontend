<template>
  <div class="section">
    <h3 class="title is-4">Account Settings</h3>
    <div class="columns">
      <div class="column is-4">
        <div class="card ml-3">
          <div class="card-image">
            <figure class="image is-square">
              <img :src="userDetails.get_profile_image" alt="Profile Image" />
            </figure>
          </div>
          <div class="card-content">
            <p class="title is-4">{{ user.firstName }} {{ user.lastName }}</p>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="section">
          <form @submit.prevent="updateProfile">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  class="input"
                  type="email"
                  v-model="user.email"
                  disabled
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="user.username"
                  readonly
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
              <label class="label">About Me</label>
              <div class="control">
                <textarea class="textarea" v-model="user.about_me"></textarea>
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
                  Update Changes
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
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      user: {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        about_me: "",
      },
      newPassword: "",
      newPassword2: "",
      image: null, // Store uploaded image data
      imageFilename: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapState({
      userDetails: (state) => state.userDetails.userDetails,
    }),
  },
  watch: {
    userDetails: {
      immediate: true,
      handler(newVal) {
        this.user = {
          username: newVal?.user?.email,
          firstName: newVal?.user?.first_name,
          lastName: newVal?.user?.last_name,
          email: newVal?.user?.email,
          about_me: newVal.about_me || "",
        };
      },
    },
    "user.email": function (newEmail) {
      this.user.username = newEmail;
    },
  },
  methods: {
    ...mapActions("userDetails", ["fetchUserDetails", "updateUserDetails"]),
    handleImageUpload(event) {
      this.image = event.target.files[0];
      this.imageFilename = this.image.name;
    },
    async updateProfile() {
      const formData = new FormData(); // Use FormData for file uploads
      formData.append("username", this.user.username);
      formData.append("first_name", this.user.firstName);
      formData.append("last_name", this.user.lastName);
      formData.append("email", this.user.email);
      formData.append("about_me", this.user.about_me);
      if (this.newPassword === this.newPassword2) {
        formData.append("new_password", this.newPassword);
      } else {
        this.errorMessage = "Passwords do not match";
      }

      if (this.image) {
        formData.append("profile_image", this.image);
      }

      try {
        const response = await axios.put(
          `authentication/profile/${this.userDetails.user.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.errorMessage = "";
        await this.fetchUserDetails();
      } catch (error) {
        this.errorMessage = "An error occurred while updating your profile.";
        console.error("Error updating profile:", error);
      }
    },
  },
  created() {
    this.fetchUserDetails();
  },
};
</script>
