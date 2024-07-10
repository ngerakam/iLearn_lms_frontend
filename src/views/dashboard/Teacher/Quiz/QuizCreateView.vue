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

    <div class="columns">
      <div class="column"></div>
      <div class="column is-10">
        <CreateQuiz @submit-quiz="handleQuizSubmission" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CreateQuiz from "@/components/Quiz/CreateQuiz.vue";

export default {
  data() {
    return {
      form: {
        quizList: [],
      },
    };
  },
  components: {
    CreateQuiz,
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.back();
    },
    async handleQuizSubmission(quizData) {
      console.log("Quiz Data:", quizData);
      this.isQuizCreateVisible = false;

      const slug = this.$router.currentRoute.value.params.slug;

      const response = await axios.post(`quiz/courses/${slug}/`, quizData);

      if (response.status === 201) {
        this.$router.push({
          name: "QuestionCreateView",
          params: { slug: slug, quizSlug: response.data.data.slug },
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
