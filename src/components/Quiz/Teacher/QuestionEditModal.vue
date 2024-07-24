<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card custom-modal-width">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Quiz {{ existingQuiz?.title }}</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <CreateQuestion
          :existingQuestion="currentQuestion"
          @submit-question="handleQuestionEdited"
        />
      </section>
    </div>
  </div>
</template>

<script>
import CreateQuestion from "../CreateQuestion.vue";

export default {
  props: {
    existingQuestion: {
      type: Object,
      default: null,
    },
  },
  components: {
    CreateQuestion,
  },
  data() {
    return {
      showModal: false,
      currentQuestion: null,
    };
  },
  watch: {
    existingQuestion: {
      immediate: true,
      handler(newQuiz) {
        if (newQuiz) {
          this.currentQuestion = { ...newQuiz };
        }
      },
    },
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleQuestionEdited(question) {
      this.$emit("question-edited", question);
      this.closeModal();
    },
  },
};
</script>
<style scoped>
.custom-modal-width {
  max-width: 960px;
  width: 100%;
}
</style>
