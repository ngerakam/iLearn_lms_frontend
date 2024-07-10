<template>
  <form class="box" @submit.prevent="submitQuiz">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Enter quiz title"
          v-model="form.title"
          required
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea
          class="textarea"
          placeholder="Enter quiz description"
          v-model="form.description"
          required
        ></textarea>
      </div>
    </div>

    <div class="field">
      <label class="label">Choose Category</label>
      <div class="select is-primary">
        <select v-model="form.category">
          <option value="" disabled>Choose category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="form.random_order" />
        Random Order
      </label>
    </div>

    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="form.answers_at_end" />
        Show Answers at End
      </label>
    </div>

    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="form.exam_paper" />
        Exam Paper
      </label>
    </div>

    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="form.single_attempt" />
        Single Attempt
      </label>
    </div>

    <div class="field">
      <label class="label">Pass Mark</label>
      <div class="control">
        <input
          class="input"
          type="number"
          placeholder="Enter pass mark"
          v-model="form.pass_mark"
          required
        />
      </div>
    </div>

    <div class="field">
      <label class="checkbox">
        <input type="checkbox" v-model="form.draft" />
        Draft
      </label>
    </div>

    <button class="button is-primary" type="submit">Add Quiz</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "",
        description: "",
        category: "",
        random_order: false,
        answers_at_end: false,
        exam_paper: false,
        single_attempt: false,
        pass_mark: 0,
        draft: false,
      },
      categories: ["assignment", "exam", "practice"],
    };
  },
  methods: {
    submitQuiz() {
      if (!this.form.title || !this.form.description || !this.form.pass_mark) {
        alert("Please fill in all required fields.");
        return;
      }

      this.$emit("submit-quiz", this.form);
      console.log(this.form);
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
