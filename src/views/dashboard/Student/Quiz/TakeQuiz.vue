<template>
  <div class="container columns mt-3">
    <div class="column" :class="isQuizStarted ? 'is-3' : ''">
      <h1 class="title is-5 px-3 py-3">Quiz: {{ quiz.title }}</h1>
      <hr />
      <h3 class="px-3 py-3">
        <strong>Quiz Type: {{ capitalizedCategory }}</strong>
      </h3>
      <hr />
      <h5 class="px-3 py-3 mb-2 mt-2"><strong>Description:</strong></h5>
      <p>{{ quiz.description }}</p>
      <div class="columns">
        <div class="column"></div>
        <div class="column"></div>
        <div class="column"></div>
        <div class="column">
          <button
            v-if="!isQuizStarted"
            class="button is-primary ms-auto mt-3"
            @click="startQuiz"
          >
            Start {{ capitalizedCategory }}
          </button>
        </div>
      </div>
    </div>
    <div class="column is-9 card" v-if="isQuizStarted">
      <SingleQuestion :question="activeQuestion" @update-answer="storeAnswer" />

      <div class="px-3 py-3 mt-3 mb-3">
        <nav class="pagination">
          <a
            class="pagination-previous"
            :style="{ display: isFirstQuestion ? 'none' : 'inline-block' }"
            @click="previous"
          >
            Previous
          </a>
          <a
            class="pagination-next"
            :style="{ display: isLastQuestion ? 'none' : 'inline-block' }"
            @click="next"
          >
            Next
          </a>
        </nav>
      </div>
      <div class="columns">
        <div class="column"></div>
        <div class="column"></div>
        <ConfettiComponent ref="confettiComponent" />
        <div class="column"></div>
        <div class="column">
          <button
            v-if="isLastQuestion"
            class="button is-primary ml-auto"
            @click="submitQuiz"
          >
            Submit {{ capitalizedCategory }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import fetchQuiz from "@/Utilities/getQuiz";
import SingleQuestion from "./SingleQuestion.vue";
import ConfettiComponent from "@/components/Utils/ConfettiComponent.vue";

export default {
  data() {
    return {
      quiz: {},
      questions: [],
      userAnswers: {},
      activeQuestion: null,
      isQuizStarted: false,
    };
  },
  components: { SingleQuestion, ConfettiComponent },
  async mounted() {
    const courseSlug = this.$router.currentRoute.value.params.slug;
    const quizSlug = this.$router.currentRoute.value.params.quizSlug;
    const quizData = await fetchQuiz(courseSlug, quizSlug);
    if (quizData) {
      this.quiz = quizData.quiz;
      this.questions = quizData.questions;
    }
  },
  computed: {
    isBoolean() {
      return this.question.question_type === "boolean";
    },
    isEssay() {
      return this.question.question_type === "essay";
    },
    isMCQ() {
      return this.question.question_type === "multi-choice";
    },
    isLastQuestion() {
      if (!this.questions.length || !this.activeQuestion) return false;
      return this.questions.indexOf(this.activeQuestion) === this.questions.length - 1;
    },
    isFirstQuestion() {
      if (!this.questions.length || !this.activeQuestion) return false;
      return this.questions.indexOf(this.activeQuestion) === 0;
    },
    capitalizedCategory() {
      return this.capitalizeFirstLetter(this.quiz.category);
    },
  },
  methods: {
    capitalizeFirstLetter(word) {
      if (!word) return ""; // Handle empty string or undefined input
      return word.charAt(0).toUpperCase() + word.slice(1);
    },
    startQuiz() {
      this.activeQuestion = this.questions[0];
      this.isQuizStarted = true;
    },
    next() {
      const currentIndex = this.questions.indexOf(this.activeQuestion);
      if (currentIndex !== -1 && currentIndex < this.questions.length - 1) {
        this.activeQuestion = this.questions[currentIndex + 1];
      }
    },
    previous() {
      const currentIndex = this.questions.indexOf(this.activeQuestion);
      if (currentIndex > 0) {
        this.activeQuestion = this.questions[currentIndex - 1];
      }
    },
    storeAnswer({ questionId, answer }) {
      this.userAnswers[questionId] = { questionId, answer };
    },
    async submitQuiz() {
      try {
        const sessionResponse = await axios.post(
          `quiz/courses/${this.courseSlug}/quiz/${this.quizSlug}/quiz-sessions/`,
          {
            quiz: this.quiz.id,
            user_answers: this.userAnswers,
          }
        );
        console.log("Quiz submitted successfully:", sessionResponse.data);
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
      console.log({ quiz: this.quiz.id, user_answers: this.userAnswers });
      // Trigger rewards
      this.$refs.confettiComponent.confettiReward();
      this.$refs.confettiComponent.balloonsReward();
      this.$refs.confettiComponent.emojiReward();
      this.$refs.confettiComponent.fullPageReward();
    },
  },
};
</script>

<style scoped>
.question {
  margin-bottom: 20px;
}
</style>
