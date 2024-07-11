<template>
  <div class="card">
    <div class="field px-3 py-3">
      <label class="label">Choose Answer</label>
      <div class="control" v-for="(option, index) in options" :key="index">
        <div v-if="isManyAnswers">
          <label class="checkbox mt-2 mb-2">
            <input type="checkbox" v-model="correct_option" />
            {{ option.option }}
          </label>
        </div>
        <div v-if="!isManyAnswers">
          <label class="radio">
            <input type="radio" v-model="correct_option" :value="false" />
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
      correct_option: "",

      options: [],
      is_many_answers: this.question.details.is_many_answers,
    };
  },
  async mounted() {
    await this.getOptions();
  },
  computed: {
    isManyAnswers() {
      return this.question.details.is_many_answers;
    },
  },
  methods: {
    async getOptions() {
      const courseSlug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;
      const response = await axios.get(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${this.question.id}/mtp_types/${this.question.details.id}/options/`
      );
      if (response.status === 200) {
        this.options = response.data.data;
      }
    },
    async submitAnswer() {
      await axios.post(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${this.question.id}/`
      );
    },
  },
};
</script>

<style scoped>
.question {
  margin-bottom: 20px;
}
</style>
