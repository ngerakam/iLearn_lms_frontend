<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card custom-modal-width">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Quiz {{ existingQuiz?.title }}</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <QuizForm :existingQuiz="currentQuiz" @submit-quiz="handleQuizEdited" />
      </section>
    </div>
  </div>
</template>

<script>
import QuizForm from "../QuizForm.vue";

export default {
  props: {
    existingQuiz: {
      type: Object,
      default: null,
    },
  },
  components: {
    QuizForm,
  },
  data() {
    return {
      showModal: false,
      currentQuiz: null,
    };
  },
  watch: {
    existingQuiz: {
      immediate: true,
      handler(newQuiz) {
        if (newQuiz) {
          this.currentQuiz = { ...newQuiz };
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
    handleQuizEdited(quiz) {
      this.$emit("quiz-edited", quiz);
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
