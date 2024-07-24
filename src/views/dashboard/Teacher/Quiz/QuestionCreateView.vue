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
        <h1 class="title is-4">Questions for: {{ quiz?.title }}</h1>
      </div>
    </div>
    <section class="section">
      <div class="columns content">
        <div class="column is-2">
          <h2 class="title is-6">
            List of Questions under Quiz: {{ quiz?.title }}
          </h2>
          <ul class="menu-list no-style">
            <li v-for="question in questions" v-bind:key="question.id">
              <a> {{ question.text }}</a>
            </li>
          </ul>
        </div>
        <div class="column is-10">
          <div class="columns mt-3">
            <div class="column"></div>
            <div class="column"></div>

            <div class="column">
              <button
                class="button is-primary"
                v-if="!isQuizCreateVisible"
                @click="showQuestionCreate"
              >
                <i class="fas fa-plus icon-spaced"></i>
                Add Question
              </button>
            </div>
          </div>

          <div class="container columns">
            <div class="column">
              <CreateQuestion
                @submit-question="handleQuestionSubmission"
                v-if="isQuizCreateVisible"
              />
            </div>
            <div class="column" v-if="isQuizTypeCreateVisible">
              <EassyQuestionCreate
                @submit-essay-question="handleEssayQuestionSubmit"
                v-if="quiz_type === 'essay'"
              />
              <BooleanQuestionCreate
                @submit-boolean-question="handleBooleanQuestionSubmit"
                v-if="quiz_type === 'boolean'"
              />
              <ChoicesQuestionCreate
                @submit-choices-question="handleChoicesQuestionSubmission"
                v-if="quiz_type === 'multi-choice'"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import CreateQuestion from "@/components/Quiz/CreateQuestion.vue";
import BooleanQuestionCreate from "@/components/Quiz/BooleanQuestionCreate.vue";
import ChoicesQuestionCreate from "@/components/Quiz/ChoicesQuestionCreate.vue";
import EassyQuestionCreate from "@/components/Quiz/EassyQuestionCreate.vue";

export default {
  data() {
    return {
      quiz: null,
      questionObject: null,
      quiz_type: "",
      isQuizCreateVisible: false,
      isQuizTypeCreateVisible: false,
      questions: [],
    };
  },
  components: {
    CreateQuestion,
    BooleanQuestionCreate,
    ChoicesQuestionCreate,
    EassyQuestionCreate,
  },
  async mounted() {
    const slug = this.$router.currentRoute.value.params.slug;
    const quizSlug = this.$router.currentRoute.value.params.quizSlug;
    await axios
      .get(`quiz/courses/${slug}/quiz/${quizSlug}`)
      .then((response) => {
        if (response.status === 200) {
          this.quiz = response.data.data;
        }
      });

    await axios
      .get(`quiz/courses/${slug}/quiz/${quizSlug}/questions/`)
      .then((response) => {
        if (response.status === 200) {
          this.questions = response.data.data;
        }
      });
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async showQuestionCreate() {
      this.isQuizCreateVisible = !this.isQuizCreateVisible;
    },
    addQuestionToArray(question) {
      this.questions = [...this.questions, question];
    },
    async handleQuestionSubmission(quizData) {
      // console.log("Quiz Data:", quizData);
      this.isQuizTypeCreateVisible = true;
      this.quiz_type = quizData.question_type;

      const slug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;

      const response = await axios.post(
        `quiz/courses/${slug}/quiz/${quizSlug}/questions/`,
        quizData
      );

      if (response.status === 201) {
        this.questionObject = response.data.data;
        this.addQuestionToArray(response.data.data);
        // console.log(response.data);
      }
    },
    async handleEssayQuestionSubmit(quizData) {
      const slug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;

      try {
        const response = await axios.post(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${this.questionObject.id}/essay_types/`,
          quizData
        );

        if (response.status === 201) {
          this.isQuizTypeCreateVisible = false;
          this.isQuizCreateVisible = false;
          // console.log(response.data);
        }
      } catch (error) {
        console.error("Error submitting choices question:", error);
      }
    },
    async handleBooleanQuestionSubmit(quizData) {
      const slug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;

      try {
        const response = await axios.post(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${this.questionObject.id}/tf_types/`,
          quizData
        );

        if (response.status === 201) {
          this.isQuizTypeCreateVisible = false;
          this.isQuizCreateVisible = false;
          // console.log(response.data);
        }
      } catch (error) {
        console.error("Error submitting choices question:", error);
      }
    },
    handleChoicesQuestionSubmission(quizData) {
      const hasManyCorrectAnswers = this.checkMultipleCorrectAnswers(
        quizData.options
      );

      quizData.is_many_answers = hasManyCorrectAnswers;

      this.submitChoicesQuestion(quizData);
    },
    checkMultipleCorrectAnswers(options) {
      const correctAnswersCount = options.filter(
        (option) => option.correct_option
      ).length;
      return correctAnswersCount > 1;
    },
    async submitChoicesOptions(options, slug, quizSlug, mtpId) {
      const questionId = this.questionObject.id;

      for (const option of options) {
        try {
          const response = await axios.post(
            `quiz/courses/${slug}/quiz/${quizSlug}/questions/${questionId}/mtp_types/${mtpId}/options/`,
            option
          );

          if (response.status === 201) {
            console.log("Option submitted successfully:", response.data);
          }
        } catch (error) {
          console.error("Error submitting option:", error);
        }
      }
    },
    async submitChoicesQuestion(quizData) {
      const slug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;

      try {
        const response = await axios.post(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${this.questionObject.id}/mtp_types/`,
          quizData
        );

        if (response.status === 201) {
          this.isQuizTypeCreateVisible = false;
          this.isQuizCreateVisible = false;
          // console.log(response.data);

          const mtpId = response.data.data.id;

          await this.submitChoicesOptions(
            quizData.options,
            slug,
            quizSlug,
            mtpId
          );
        }
      } catch (error) {
        console.error("Error submitting choices question:", error);
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
