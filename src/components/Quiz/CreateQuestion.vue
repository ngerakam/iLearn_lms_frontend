<template>
  <form class="box" @submit.prevent="submitQuiz">
    <div class="field">
      <label class="label">Question</label>
      <div class="control">
        <textarea
          class="textarea"
          placeholder="Enter quiz description"
          v-model="form.text"
          required
        ></textarea>
      </div>
    </div>

    <div class="field">
      <label class="label">Choose Question Type</label>
      <div class="select is-primary">
        <select v-model="form.question_type">
          <option value="" disabled>Choose Question Type</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="field">
      <label class="label">Marks</label>
      <div class="control">
        <input
          class="input"
          type="number"
          placeholder="Enter pass mark"
          v-model="form.marks"
          required
        />
      </div>
    </div>

    <button class="button is-primary" type="submit">Add Quiz</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        text: "",
        question_type: "",
        marks: 0,
      },
      categories: ["essay", "boolean", "multi-choice"],
    };
  },
  methods: {
    submitQuiz() {
      this.$emit("submit-quiz", this.form);
    },
  },
};
</script>
