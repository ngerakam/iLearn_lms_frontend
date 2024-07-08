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
      <div class="hero-body has-text-centered">
        <h1 class="title">{{ course.title }}</h1>

        <router-link
          :to="{ name: 'Author', params: { id: course.created_by.id } }"
          class="subtitle"
        >
          by:
          {{ course.created_by.first_name + " " + course.created_by.last_name }}
        </router-link>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns content">
          <div class="column is-2">
            <h2>Table of Contents</h2>
            <p>{{ module_title }}</p>
            <ul class="menu-list no-style">
              <li v-for="lesson in lessons" v-bind:key="lesson.id">
                <a @click="setActiveLesson(lesson)">
                  <i
                    v-if="lesson.lesson_type === 'file'"
                    class="fas fa-file icon-spaced"
                  ></i>
                  <i
                    v-if="lesson.lesson_type === 'video' && lesson.youtube_id !== null"
                    class="fab fa-youtube icon-spaced"
                  ></i>
                  <i
                    v-if="lesson.lesson_type === 'video' && lesson.get_video !== null"
                    class="fas fa-video icon-spaced"
                  ></i>
                  <i
                    v-if="lesson.lesson_type === 'quiz'"
                    class="fas fa-question icon-spaced"
                  ></i>
                  <i
                    v-if="lesson.lesson_type === 'article'"
                    class="fas fa-newspaper icon-spaced"
                  ></i>
                  {{ lesson.title }}</a
                >
              </li>
            </ul>
          </div>
          <div class="column is-10">
            <template v-if="$store.state.user.isAuthenticated">
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <button
                    class="button is-primary"
                    v-if="!isLessonCreateVisible"
                    @click="showLessonCreate"
                  >
                    <i class="fas fa-plus icon-spaced"></i>
                    Add Lesson
                  </button>
                </div>
              </div>
              <div class="container is-fullhd">
                <LessonCreate
                  v-if="isLessonCreateVisible"
                  :course="course"
                  @lesson-created="refreshLessons"
                />
              </div>
            </template>
            <template v-else>
              <h2>Access Restricted</h2>
              <p>You are required to login so as to access this course.</p>
              <p>
                If you do not have an account kindly reach out to site admin :
                (example@siteadmin.com) for an account!
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import LessonCreate from "../../../../components/Lesson/LessonCreate.vue";

export default {
  components: {
    LessonCreate,
  },
  data() {
    return {
      course: {
        created_by: {
          id: 0,
        },
      },
      module_title: "",
      lessons: [],
      isLessonCreateVisible: false,
    };
  },
  async mounted() {
    const slug = this.$router.currentRoute.value.params.slug;
    const moduleSlug = this.$router.currentRoute.value.params.moduleSlug;
    // console.log(slug);

    await axios.get(`courses/${slug}/`).then((response) => {
      if (response.status === 200) {
        this.course = response.data.data;
      }
    });

    await axios.get(`courses/${slug}/modules/${moduleSlug}/`).then((response) => {
      if (response.status === 200) {
        this.module_title = response.data.data.title;
      }
    });

    await axios.get(`courses/${slug}/modules/${moduleSlug}/lessons/`).then((response) => {
      // console.log(response.data);

      if (response.status === 200) {
        this.lessons = response.data.data;
      }
    });

    document.title = this.course.title + " | iLearn";
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    showLessonCreate() {
      this.isLessonCreateVisible = true;
    },
    async refreshLessons() {
      const slug = this.$router.currentRoute.value.params.slug;
      const moduleSlug = this.$router.currentRoute.value.params.moduleSlug;
      await axios
        .get(`courses/${slug}/modules/${moduleSlug}/lessons/`)
        .then((response) => {
          this.lessons = response.data.data;
          this.isLessonCreateVisible = false;
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
