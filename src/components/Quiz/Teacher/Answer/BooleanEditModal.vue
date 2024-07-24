<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card custom-modal-width">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Answer for question: {{ question?.text }}</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="card">
          <div class="field px-3 py-3">
            <label class="label">Choose Answer</label>
            <div class="control">
              <label class="radio">
                <input type="radio" v-model="localCorrectAnswer" :value="true" />
                True
              </label>
              <label class="radio">
                <input type="radio" v-model="localCorrectAnswer" :value="false" />
                False
              </label>
            </div>
          </div>
          <div class="field px-3 py-3">
            <button class="button is-small is-primary ml-2" @click="handleBooleanEdited">
              <i class="fas fa-save icon-spaced"></i>
              Save
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    question: {
      type: Object,
      required: true,
    },
    answer: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
      localCorrectAnswer: null,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.localCorrectAnswer = this.answer ? this.answer.correct_answer : null;
    },
    closeModal() {
      this.showModal = false;
    },
    async handleBooleanEdited() {
      const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
      try {
        let response;
        if (this.answer) {
          // Update existing answer
          response = await axios.put(
            `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/tf_types/${this.answer.id}/`,
            { correct_answer: this.localCorrectAnswer }
          );
        } else {
          // Create new answer
          response = await axios.post(
            `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/tf_types/`,
            { correct_answer: this.localCorrectAnswer }
          );
        }
        if (response.status === 200 || response.status === 201) {
          this.$emit("boolean-edited", response.data.data[0]);
          this.closeModal();
        }
      } catch (error) {
        console.error("Error updating/creating the answer:", error);
      }
    },
  },
};
</script>

<style scoped>
.custom-modal-width {
  max-width: 960px;
  width: 100%;
}
.icon-spaced {
  margin-right: 8px;
}
</style>
