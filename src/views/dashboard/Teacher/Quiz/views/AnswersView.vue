<template>
  <div class="container">
    <div class="columns mt-3">
      <div class="column">
        <button class="button is-small is-responsive" @click="goBack">
          <i class="fas fa-arrow-left icon-spaced"></i>Back
        </button>
      </div>
      <div class="column"></div>
      <div class="column"></div>
    </div>
    <div v-if="notification" :class="['notification', notification.type]">
      <button class="delete" @click="notification = null"></button>
      {{ notification.message }}
    </div>
    <div class="card px-3 py-3">
      <div class="px-3 py-3">
        <label class="label">Question</label>
        <h3>{{ question?.text }}</h3>
      </div>
      <div class="mb-3" v-if="question?.question_type === 'essay'">
        <label class="label">Sample Answer</label>
        <p class="ml-3">{{ answer?.sample_answer }}</p>
      </div>

      <div class="mb-3" v-if="question?.question_type === 'boolean'">
        <label class="label">Correct Answer</label>
        <p class="ml-3" v-if="answer?.correct_answer === true">True</p>
        <p class="ml-3" v-if="answer?.correct_answer === false">False</p>
      </div>

      <div class="mb-3" v-if="question?.question_type === 'multi-choice'">
        <div class="columns">
          <div class="column">
            <label class="label">Multiple Choice Question option Answers</label>
          </div>
          <div class="column"></div>
          <div class="column">
            <button class="button is-link" @click="openCreateOption">
              <span class="icon">
                <i class="fas fa-plus"></i>
              </span>
            </button>
          </div>
          <div class="column"></div>
        </div>
        <div class="ml-" v-for="mcq in mcq_answers" :key="mcq.id">
          <div class="columns">
            <div class="column">
              <label class="label"> Answer</label>
              <p>{{ mcq.option }}</p>
            </div>
            <div class="column">
              <label class="label">Option</label>
              <p>Correct: {{ mcq.correct_option ? "Yes" : "No" }}</p>
            </div>
            <div class="column">
              <label class="label"></label>
              <button
                class="button is-small is-primary ml-2"
                @click="editMCQAnswer(mcq)"
              >
                <i class="far fa-edit icon-spaced"></i>
                Edit
              </button>
              <button
                class="button is-small is-danger ml-2"
                @click="deleteMCQAnswer({ question, mcq })"
              >
                <i class="fas fa-trash icon-spaced"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3" v-if="question?.question_type === 'multi-choice'"></div>
      <div class="mb-" v-else>
        <button
          class="button is-small is-primary ml-2"
          @click="editAnswer(question)"
        >
          <i class="far fa-edit icon-spaced"></i>
          Edit
        </button>
        <button
          class="button is-small is-danger ml-2"
          @click="deleteAnswer(question)"
        >
          <i class="fas fa-trash icon-spaced"></i>
          Delete
        </button>
      </div>
      <BooleanEditModal
        :question="question"
        :answer="answer"
        ref="booleanEditModal"
        @boolean-edited="handleBooleanEdited"
      />
      <EssayEditModal
        :question="question"
        :answer="answer"
        ref="essayEditModal"
        @essay-edited="handleEssayEdited"
      />
      <MCQEditModal
        v-if="question && question.question_type === 'multi-choice'"
        :question="question"
        :mcqOption="selectedMCQOption"
        :mcqQuestion="mcq_question"
        ref="mcqEditModal"
        @mcq-edited="handleMCQOptionEdited"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BooleanEditModal from "@/components/Quiz/Teacher/Answer/BooleanEditModal.vue";
import EssayEditModal from "@/components/Quiz/Teacher/Answer/EssayEditModal.vue";
import MCQEditModal from "@/components/Quiz/Teacher/Answer/MCQEditModal.vue";
export default {
  data() {
    return {
      question: null,
      answer: null,
      mcq_question: null,
      mcq_answers: [],
      selectedMCQOption: null,
      notification: null,
    };
  },
  components: {
    BooleanEditModal,
    EssayEditModal,
    MCQEditModal,
  },
  async mounted() {
    const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
    const response = await axios.get(
      `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/`
    );
    this.question = response.data.data;

    if (this.question) {
      this.getQuestionAnswer();
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async editAnswer(question) {
      if (this.question.question_type === "boolean") {
        this.openBooleanEditModal();
      } else if (this.question.question_type === "essay") {
        this.openEssayEditModal();
      }

      // console.log(question);
    },
    async deleteAnswer(question) {
      const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
      if (this.question.question_type === "boolean") {
        const response = await axios.delete(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${question.id}/tf_types/${this.answer.id}/`
        );
        if (response.status === 204) {
          this.getQuestionAnswer();
        }
        this.showNotification(
          `The True or False answer for question ${this.question.text} has been deleted successfully `,
          "is-danger"
        );
      } else if (this.question.question_type === "essay") {
        const response = await axios.delete(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${question.id}/essay_types/${this.answer.id}/`
        );
        if (response.status === 204) {
          this.getQuestionAnswer();
        }
        this.showNotification(
          `The Essay answer for question ${this.question.text} has been deleted successfully `,
          "is-danger"
        );
      }
      // console.log(question);
    },
    async getQuestionAnswer() {
      const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
      if (this.question.question_type === "multi-choice") {
        const response = await axios.get(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/mtp_types/`
        );
        if (response.status === 200) {
          this.mcq_question = response.data.data[0];
          const mcq_response = await axios.get(
            `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/mtp_types/${this.mcq_question.id}/options/`
          );
          if (mcq_response.status === 200) {
            this.mcq_answers = mcq_response.data.data;
          }
        }
      } else if (this.question.question_type === "essay") {
        const response = await axios.get(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/essay_types/`
        );
        if (response.status === 200) {
          this.answer = response.data.data[0];
        }
      } else if (this.question.question_type === "boolean") {
        const response = await axios.get(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/tf_types/`
        );
        if (response.status === 200) {
          this.answer = response.data.data[0];
        }
      }
    },
    editMCQAnswer(mcq) {
      this.selectedMCQOption = mcq;
      this.$refs.mcqEditModal.openModal(mcq);
    },
    async deleteMCQAnswer({ question, mcq }) {
      const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
      const response = await axios.delete(
        `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/mtp_types/${mcq.mtp_question}/options/${mcq.id}/`
      );
      if (response.status === 204) {
        // Remove the deleted option from the local state
        this.mcq_answers = this.mcq_answers.filter(
          (option) => option.id !== mcq.id
        );

        // Check if there are multiple correct answers after deletion
        const isManyAnswers = this.checkMultipleCorrectAnswers(
          this.mcq_answers
        );

        // Update is_many_answers if it's different from the current value
        if (
          this.mcq_question &&
          this.mcq_question.is_many_answers !== isManyAnswers
        ) {
          await this.updateIsManyAnswers(isManyAnswers);
        }
        this.showNotification(
          `The Option ${editedMCQ.option} for question ${this.question.text} has been deleted successfully `,
          "is-danger"
        );
        // console.log("Deleted option", mcq.option);
      }
    },
    async openCreateOption() {
      this.openMCQEditModal();
    },
    openBooleanEditModal() {
      this.$refs.booleanEditModal.openModal();
    },
    openMCQEditModal() {
      this.$refs.mcqEditModal.openModal();
    },
    openEssayEditModal() {
      this.$refs.essayEditModal.openModal();
    },
    handleBooleanEdited(editedAnswer) {
      this.answer = editedAnswer;
      this.getQuestionAnswer();
      this.showNotification(
        `The True or False question ${this.question.text} has been edited successfully `,
        "is-success"
      );
    },
    handleEssayEdited(editedAnswer) {
      this.answer = editedAnswer;
      this.getQuestionAnswer();
      this.showNotification(
        `The Essay question ${editedAnswer.sample_answer} has been edited successfully `,
        "is-success"
      );
    },
    handleMCQOptionEdited(editedMCQ) {
      const index = this.mcq_answers.findIndex(
        (option) => option.id === editedMCQ.id
      );
      if (index !== -1) {
        this.mcq_answers.splice(index, 1, editedMCQ);
      } else {
        this.mcq_answers.push(editedMCQ);
      }
      this.selectedMCQOption = null;
      // Check if there are multiple correct answers
      const isManyAnswers = this.checkMultipleCorrectAnswers(this.mcq_answers);

      // Update is_many_answers if it's different from the current value
      if (
        this.mcq_question &&
        this.mcq_question.is_many_answers !== isManyAnswers
      ) {
        this.updateIsManyAnswers(isManyAnswers);
      }
      this.showNotification(
        `The Option ${editedMCQ.option} for question ${this.question.text} has been edited successfully `,
        "is-success"
      );
    },
    checkMultipleCorrectAnswers(options) {
      const correctAnswersCount = options.filter(
        (option) => option.correct_option
      ).length;
      return correctAnswersCount > 1;
    },
    async updateIsManyAnswers(isManyAnswers) {
      const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
      try {
        await axios.patch(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/mtp_types/${this.mcq_question.id}/`,
          {
            is_many_answers: isManyAnswers,
          }
        );
        // Update the local state
        if (this.mcq_question) {
          this.mcq_question.is_many_answers = isManyAnswers;
        }
      } catch (error) {
        console.error("Error updating is_many_answers:", error);
      }
    },
    showNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 3000); // Hide notification after 3 seconds
    },
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
