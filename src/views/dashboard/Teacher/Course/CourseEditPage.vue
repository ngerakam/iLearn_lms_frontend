<template>
  <div class="edit-course">
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
      <div class="has-text-centered mb-2">
        <h1 class="title is-4">Edit Course: {{ course.title }}</h1>
      </div>
    </div>
    <div class="columns mt-3">
      <div class="column is-3">
        <div class="container px-3 py-3 mr-1 ml-3">
          <h2 class="title is-5">Table of Contents</h2>
          <p>Modules</p>
          <ul class="menu-list no-style">
            <li v-for="module in modules" v-bind:key="module.id">
              <a class="hover px-3 mt-2" type="button" @click="editModule(module)">
                <i v-if="module.is_open" class="fas fa-lock-open"></i>
                <i v-else class="fas fa-lock"></i>
                {{ module.title }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="column">
        <CourseEdit />
      </div>
    </div>

    <!-- end button -->
    <div class="columns">
      <div class="column"></div>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column field is-grouped">
        <div class="control">
          <button class="button is-primary" type="button" @click="createModule">
            <i class="fas fa-plus icon-spaced"></i>
            Add Module
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CourseEdit from "@/components/Course/CourseEdit";
import LessonCreate from "@/components/Lesson/LessonCreate.vue";

export default {
  components: {
    CourseEdit,
    LessonCreate,
  },
  data() {
    return {
      course: {
        created_by: {
          id: 0,
        },
      },
      modules: [],
      isModalActive: false,
    };
  },
  async mounted() {
    console.log("mounted");

    const slug = this.$router.currentRoute.value.params.slug;
    // console.log(slug);

    await axios.get(`courses/${slug}/status/`).then((response) => {
      console.log(response.data);

      this.course = response.data.data;
    });

    await axios.get(`courses/${slug}/modules/`).then((response) => {
      console.log(response.data);
      this.modules = response.data.data;
    });

    document.title = this.course.title + " | iLearn";
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    createModule() {
      console.log("Create Module PageEdit");
    },
    closeModal() {
      this.isModalActive = false;
    },
    async refreshLessons() {
      const slug = this.$router.currentRoute.value.params.slug;
      const moduleSlug = this.$router.currentRoute.value.params.moduleSlug;
      await axios
        .get(`courses/${slug}/modules/${moduleSlug}/lessons/`)
        .then((response) => {
          this.lessons = response.data.data;
          this.closeModal();
        });
    },

    editModule(module) {
      const slug = this.$router.currentRoute.value.params.slug;
      this.$router.push({
        name: "ModuleEditPage",
        params: { slug: slug, moduleSlug: module.slug },
      });
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
.custom-modal-width {
  max-width: 960px;
  width: 100%;
}
a.hover {
  transition: background-color 0.3s, color 0.3s;
}
a.hover:hover {
  background-color: #24d0ee;
  color: #3273dc;
  text-decoration: none;
}
</style>
