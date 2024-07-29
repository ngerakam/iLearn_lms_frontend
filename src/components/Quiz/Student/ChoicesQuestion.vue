<template>
  <div class="card">
    <div class="field px-3 py-3">
      <label class="label" v-if="isManyAnswers">Choose Answers</label>
      <label class="label" v-if="!isManyAnswers">Choose Answer</label>
      <div class="control" v-for="(option, index) in options" :key="index">
        <div v-if="isManyAnswers">
          <label class="checkbox mt-2 mb-2">
            <input
              type="checkbox"
              :value="option.option"
              v-model="selectedOptions"
              @change="emitAnswer"
            />
            {{ option.option }}
          </label>
        </div>
        <div v-if="!isManyAnswers">
          <label class="radio">
            <input
              type="radio"
              :value="option.option"
              v-model="selectedOption"
              @change="emitAnswer"
            />
            {{ option.option }}
          </label>
        </div>
      </div>
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
  },
  data() {
    return {
      selectedOption: null,
      selectedOptions: [],
      options: [],
    };
  },
  watch: {
    question: {
      immediate: true,
      handler(newQuestion) {
        this.fetchOptions(newQuestion);
        this.resetSelections();
      },
    },
  },
  computed: {
    isManyAnswers() {
      return this.question.details.is_many_answers;
    },
  },
  methods: {
    async fetchOptions(question) {
      const courseSlug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;
      const response = await axios.get(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${question.id}/mtp_types/${question.details.id}/options/`
      );
      if (response.status === 200) {
        this.options = response.data.data;
      }
    },
    resetSelections() {
      this.selectedOption = null;
      this.selectedOptions = [];
    },
    async submitAnswer() {
      const courseSlug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;

      const payload = {
        selectedOption: this.isManyAnswers ? this.selectedOptions : this.selectedOption,
      };

      await axios.post(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${this.question.id}/`,
        payload
      );
    },
    emitAnswer() {
      this.$emit("answer", {
        answer: this.isManyAnswers ? this.selectedOptions : this.selectedOption,
        question_type: this.question.question_type,
      });
    },
  },
  mounted() {
    this.fetchOptions(this.question);
  },
};
</script>

<style scoped>
.question {
  margin-bottom: 20px;
}
</style>
