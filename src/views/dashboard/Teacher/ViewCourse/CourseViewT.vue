<template>
  <div class="courses">
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
      <div class="has-text-centered">
        <h1 class="title">{{ course?.title }}</h1>
        <router-link
          :to="{ name: 'Author', params: { id: course?.created_by?.id } }"
          class="subtitle mb-3"
        >
          By:
          {{ course?.created_by?.first_name + " " + course?.created_by?.last_name }}
        </router-link>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns content">
          <div class="column is-2">
            <h2 class="title is-4">Table of Contents</h2>
            <p>Modules</p>
            <ul class="menu-list no-style">
              <li v-for="module in modules" :key="module.id">
                <a :disabled="enrollmentValue === null">
                  <div v-if="!$store.state.user.isAuthenticated">
                    <i class="fas fa-lock"></i>
                    {{ module.title }}
                  </div>
                  <div v-else>
                    <i v-if="module.is_open" class="fas fa-lock-open"></i>
                    <i v-else class="fas fa-lock"></i>
                    {{ module.title }}
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div class="column is-10">
            <template v-if="$store.state.user.isAuthenticated">
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <div>
                    <button class="button is-primary" @click="viewCourseContent">
                      View Course
                    </button>
                  </div>
                </div>
              </div>
              {{ course.long_description }}
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "CourseView",
  data() {
    return {
      course: {
        created_by: {
          id: 0,
        },
      },
      modules: [],
    };
  },
  computed: {
    ...mapState({
      siteSetup: (state) => state.siteSetup.siteSetup,
    }),
  },
  async mounted() {
    try {
      await this.fetchCourseData();
    } catch (error) {
      console.error("Error initializing course view:", error);
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchCourseData() {
      const slug = this.$router.currentRoute.value.params.slug;
      try {
        const [courseResponse, modulesResponse] = await Promise.all([
          axios.get(`courses/${slug}/no-auth`),
          axios.get(`courses/${slug}/modules`),
        ]);
        this.course = courseResponse.data.data;
        this.modules = modulesResponse.data.data;
        document.title = this.course.title + " | iLearn";
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    },
    viewCourseContent() {
      this.$router.push({
        name: "ModuleViewT",
        params: { slug: this.course.slug },
      });
    },
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
.no-style {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.no-style li {
  margin: 0;
  padding: 0;
}

.no-style a {
  text-decoration: none;
}
</style>
