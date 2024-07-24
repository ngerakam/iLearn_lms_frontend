<template>
  <div>
    <h2 class="title is-6">Boolean Question</h2>
    <div class="field">
      <label class="label">Correct Answer</label>
      <div class="control">
        <label class="radio">
          <input type="radio" v-model="form.correct_answer" :value="true" />
          True
        </label>
        <label class="radio">
          <input type="radio" v-model="form.correct_answer" :value="false" />
          False
        </label>
      </div>
    </div>
    <button class="button is-primary" @click="submitBooleanQuestion">
      <i v-if="isQuestion" class="far fa-edit icon-spaced"></i>
      <i v-else class="fas fa-plus icon-spaced"></i>
      {{ isQuestion ? "Update Boolean Question" : "Add Boolean Question" }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    isQuestion: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        correct_answer: null,
      },
    };
  },
  methods: {
    submitBooleanQuestion() {
      this.$emit("submit-boolean-question", this.form);
    },
  },
};
</script>
