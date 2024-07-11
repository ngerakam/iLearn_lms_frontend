<template>
  <div class="card">
    <div class="field px-3 py-3">
      <label class="label">Choose Answer</label>
      <div class="control">
        <label class="radio">
          <input type="radio" v-model="correct_answer" :value="true" />
          True
        </label>
        <label class="radio">
          <input type="radio" v-model="correct_answer" :value="false" />
          False
        </label>
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
      correct_answer: { type: Boolean },
      courseSlug: this.$router.currentRoute.value.params.slug,
      quizSlug: this.$router.currentRoute.value.params.quizSlug,
    };
  },
  mounted() {},
  methods: {
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
