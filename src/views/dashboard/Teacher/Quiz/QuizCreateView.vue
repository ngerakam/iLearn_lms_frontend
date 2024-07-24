<template>
  <div class="create-quiz">
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
        <h1 class="title is-4">Create Course Quiz</h1>
      </div>
    </div>
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10 px-3 py-3 mt-3 ml-3" v-if="isChooseCourse">
          <h2>Choose Course for Quiz</h2>
          <div class="field">
            <p class="control has-icons-left">
              <input
                class="input"
                type="text"
                placeholder="Search courses"
                v-model="searchQuery"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-search"></i>
              </span>
            </p>
          </div>
          <div v-for="c in filteredCourses" :key="c.id" class="mt-2">
            <button class="button is-fullwidth" @click="selectCourse(c)">
              {{ c.title }}
            </button>
          </div>
        </div>
        <div class="column is-10 px-3 py-3 mt-3 ml-3" v-if="isCreateQuiz">
          <QuizForm @submit-quiz="handleQuizSubmission" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QuizForm from "@/components/Quiz/QuizForm.vue";

export default {
  data() {
    return {
      own_courses: [],
      course: null,
      searchQuery: "",
      isCreateQuiz: false,
      isChooseCourse: true,
    };
  },
  computed: {
    filteredCourses() {
      return this.own_courses.filter((course) =>
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  components: {
    QuizForm,
  },
  mounted() {
    this.getOwnCourses();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    getOwnCourses() {
      axios.get("activities/courses/created/").then((response) => {
        this.own_courses = response.data.data;
      });
    },
    selectCourse(course) {
      this.course = course;
      console.log(this.course);
      this.isCreateQuiz = true;
      this.isChooseCourse = false;
    },
    async handleQuizSubmission(quizData) {
      console.log("Quiz Data:", quizData);
      this.isQuizCreateVisible = false;

      const slug = this.course.slug;

      const response = await axios.post(`quiz/courses/${slug}/`, quizData);

      if (response.status === 201) {
        this.$router.push({
          name: "QuestionCreateView",
          params: { slug: this.course.slug, quizSlug: response.data.data.slug },
        });
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
