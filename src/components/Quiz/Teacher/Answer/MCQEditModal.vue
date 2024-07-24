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
            <label class="label">Option</label>
            <div class="control">
              <input class="input" v-model="localOption" />
              <label class="checkbox mt-2 mb-2">
                <input type="checkbox" v-model="localCorrectOption" /> Correct
              </label>
            </div>
          </div>
          <div class="field px-3 py-3">
            <button class="button is-small is-primary ml-2" @click="handleMCQEdited">
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
    mcqQuestion: {
      type: Object,
      required: true,
    },
    mcqOption: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
      localOption: "",
      localCorrectOption: false,
    };
  },
  methods: {
    openModal(mcqOption) {
      this.showModal = true;
      if (mcqOption) {
        this.localOption = mcqOption.option;
        this.localCorrectOption = mcqOption.correct_option;
      } else {
        this.localOption = "";
        this.localCorrectOption = false;
      }
      // console.log("opened modal: ", this.localOption);
      // console.log("opened modal: ", this.mcqOption);
    },
    closeModal() {
      this.showModal = false;
    },
    async handleMCQEdited() {
      const { slug, quizSlug, id } = this.$router.currentRoute.value.params;
      try {
        let response;
        const payload = {
          option: this.localOption,
          correct_option: this.localCorrectOption,
        };

        if (this.mcqOption) {
          // Update existing answer
          response = await axios.put(
            `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/mtp_types/${this.mcqQuestion.id}/options/${this.mcqOption.id}/`,
            payload
          );
        } else {
          // Create new answer
          response = await axios.post(
            `quiz/courses/${slug}/quiz/${quizSlug}/questions/${id}/mtp_types/${this.mcqQuestion.id}/options/`,
            payload
          );
        }

        if (response.status === 200 || response.status === 201) {
          this.$emit("mcq-edited", response.data.data);
          this.closeModal();
        }
      } catch (error) {
        console.error("Error updating/creating the MCQ option:", error);
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
