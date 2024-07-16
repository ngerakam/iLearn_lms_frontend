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

    <div class="columns container is-centered">
      <div class="column">
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
              <input class="mr-2 ml-2" type="checkbox" v-model="userRoles.teacher" />
              Teacher
            </label>
            <label class="checkbox">
              <input class="mr-2 ml-2" type="checkbox" v-model="userRoles.student" />
              Student
            </label>
          </div>
        </div>
      </div>
      <div class="column" v-if="userRoles.student">
        <div class="field">
          <label class="label">Search Learning Paths</label>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="searchQuery"
              placeholder="Search learning paths"
              @keydown.enter.prevent="performSearch"
            />
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Select Learning Paths</label>
              <div class="control">
                <div class="select is-multiple">
                  <select multiple v-model="selectedLearningPaths">
                    <option
                      v-for="path in filteredLearningPaths"
                      :key="path.id"
                      :value="path.id"
                    >
                      {{ path.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field mt-3">
              <label class="label">Add Learning Path</label>
              <button class="button is-secondary" @click="openCategoryModal">
                <span class="icon">
                  <i class="fas fa-plus"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field ml-3">
      <div class="control buttons">
        <button class="button is-primary" @click="saveUser">
          <i class="fas fa-user-edit icon-spaced"></i>
          Save
        </button>
        <button class="button is-danger" @click="handleDelete">
          <i class="fas fa-trash icon-spaced"></i>
          Delete
        </button>
      </div>
    </div>
    <LearningPathModal
      ref="LearningPathModal"
      @learning-path-added="updateLearningPaths"
    />
  </div>
</template>

<script>
import axios from "axios";
import LearningPathModal from "@/components/LearningPath/LearningPathModal.vue";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: { LearningPathModal },
  data() {
    return {
      user: {},
      userRoles: {
        admin: false,
        teacher: false,
        student: false,
      },
      learning_paths: [],
      userLearningPaths: [],
      searchQuery: "",
      selectedLearningPaths: [],
    };
  },
  async mounted() {
    await this.getUserDetails();
    await this.getLearningPaths();
  },
  watch: {
    learning_paths: {
      immediate: true,
      handler() {
        // Ensure selectedLearningPaths only contains valid IDs
        this.selectedLearningPaths = this.selectedLearningPaths.filter((id) =>
          this.learning_paths.some((path) => path.id === id)
        );
      },
    },
  },
  computed: {
    filteredLearningPaths() {
      return this.learning_paths.filter(
        (path) =>
          !this.searchQuery ||
          path.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async getUserDetails() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`authentication/user/${id}/`);
        this.user = response.data;
        this.userRoles.admin = this.user.is_admin;
        this.userRoles.teacher = this.user.is_teacher;
        this.userRoles.student = this.user.is_student;

        if (this.user.is_student) {
          const learningPathsResponse = await axios.get(
            `authentication/user/${id}/learning-paths/`
          );
          this.selectedLearningPaths = learningPathsResponse.data.data.map(
            (ulp) => ulp.learning_path
          );
          // console.log("Selected learning paths:", this.selectedLearningPaths);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    async getLearningPaths() {
      try {
        const response = await axios.get("courses/learning-paths/");
        if (response.status === 200) {
          this.learning_paths = response.data.data;
          // console.log("All learning paths:", this.learning_paths);
        }
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
    },
    async saveUser() {
      const id = this.$route.params.id;
      try {
        this.user.is_superuser = this.userRoles.admin;
        this.user.is_teacher = this.userRoles.teacher;
        this.user.is_student = this.userRoles.student;

        await axios.put(`authentication/user/${id}/`, this.user);

        if (this.userRoles.student) {
          await this.updateUserLearningPaths();
        }

        this.$router.back();
      } catch (error) {
        console.error("Error saving user:", error);
      }
    },
    goBack() {
      this.$router.back();
    },
    async handleDelete() {
      const id = this.$route.params.id;
      try {
        const response = await axios.delete(`authentication/user/${id}/delete/`);
        if (response.data.message) {
          // console.log(response.data);
          this.$router.back();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
    openCategoryModal() {
      this.$refs.LearningPathModal.openModal();
    },
    async updateLearningPaths(newLearningPath) {
      this.learning_paths.push(newLearningPath);
      this.selectedLearningPaths.push(newLearningPath.id);
      this.$nextTick(() => {
        this.updateUserLearningPaths();
      });
    },
    async updateUserLearningPaths() {
      const id = this.$route.params.id;
      try {
        await axios.put(`authentication/user/${id}/learning-paths/`, {
          learning_paths: this.selectedLearningPaths,
        });
        console.log("User learning paths updated");
      } catch (error) {
        console.error("Error updating user learning paths:", error);
      }
    },
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
