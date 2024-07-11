<template>
  <div class="card">
    <div class="message px-3 py-3">
      <p>Sample answer</p>
      <div class="message-body">
        {{ sample_essay_answer }}
      </div>
    </div>
    <div class="field px-3 py-3">
      <label for="eassy_answer">Answer</label>
      <textarea
        class="textarea"
        v-model="essay_answer"
        placeholder="Enter answer ..."
      ></textarea>
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
      sample_essay_answer: this.question?.details?.sample_answer,
      essay_answer: "",
      courseSlug: this.$router.currentRoute.value.params.slug,
      quizSlug: this.$router.currentRoute.value.params.quizSlug,
      eassy_id: this.question?.details?.id,
    };
  },

  methods: {
    async getSampleAnswer() {
      await axios.post(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${question.id}/`
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
