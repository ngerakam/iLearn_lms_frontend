<template>
  <div>
    <h2 class="title is-5">Essay Question</h2>
    <div class="field">
      <label class="label">Sample Answer</label>
      <div class="control">
        <textarea
          class="textarea"
          v-model="form.sample_answer"
          placeholder="Enter sample answer"
        ></textarea>
      </div>
    </div>
    <button class="button is-primary" @click="submitEssayQuestion">
      Submit Essay Sample
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        sample_answer: "",
      },
    };
  },
  methods: {
    submitEssayQuestion() {
      this.$emit("submit-essay-question", this.form);
    },
  },
};
</script>
