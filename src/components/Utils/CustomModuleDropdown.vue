<template>
  <div
    class="dropdown"
    :class="{ 'is-active': isActive, 'active-module': isActiveModule }"
  >
    <div class="dropdown-trigger" @click="toggleDropdown">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
        <span>{{ module.title }}</span>
        <span v-if="isActive" class="active-indicator"></span>
        <span class="icon is-small">
          <i
            class="fas"
            :class="isActive ? 'fa-angle-up' : 'fa-angle-down'"
            aria-hidden="true"
          ></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu" v-if="isActive">
      <div class="dropdown-content">
        <div v-for="lesson in lessons" :key="lesson.id" class="dropdown-item">
          <a @click="selectLesson(lesson)">
            {{ lesson.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    module: {
      type: Object,
      required: true,
    },
    isActiveModule: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isActive: false,
      lessons: [],
    };
  },
  methods: {
    async toggleDropdown() {
      this.isActive = !this.isActive;
      if (this.isActive) {
        await this.fetchLessons();
      }
    },
    async fetchLessons() {
      const slug = this.$router.currentRoute.value.params.slug;
      const response = await axios.get(
        `courses/${slug}/modules/${this.module.slug}/lessons/`
      );
      if (response.status === 200) {
        this.lessons = response.data.data;
      }
    },
    selectLesson(lesson) {
      this.$emit("clicked-lesson", { lesson, module: this.module });
    },
  },
};
</script>

<style scoped>
.dropdown {
  width: 100%;
  margin-bottom: 10px;
  display: block;
}
.dropdown-trigger {
  width: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
}
.button {
  width: 100%;
  border: none;
}
.active-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: green;
  border-radius: 50%;
  margin-left: 8px;
}
.dropdown-menu {
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  margin-top: 5px;
  border-radius: 0;
  position: relative;
}
.dropdown-content {
  padding: 10px;
}
.dropdown-item {
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  border-left: none;
  border-right: none;
}
.dropdown-content a {
  color: rgb(53, 46, 46);
  text-decoration: none; /* Remove underline */
  display: block; /* Ensure the whole item is clickable */
  padding: 10px 5px; /* Add some padding */
  transition: background-color 0.3s ease; /* Smooth transition */
}
.dropdown-content a:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Change background color on hover */
  color: rgb(0, 0, 0); /* Change text color on hover */
}
</style>
