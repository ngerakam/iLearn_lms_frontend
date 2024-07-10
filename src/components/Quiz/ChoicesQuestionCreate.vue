<template>
  <div>
    <h2 class="title is-5">Multiple Choice Question</h2>
    <div class="field">
      <label class="label">Choose Ordering</label>
      <div class="select is-primary">
        <select v-model="form.ordering">
          <option value="" disabled>Choose Ordering</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>
    <div class="field">
      <label class="label">Choices</label>
      <div class="control" v-for="(option, index) in form.options" :key="index">
        <input class="input" v-model="option.option" placeholder="Option text" />
        <label class="checkbox mt-2 mb-2">
          <input type="checkbox" v-model="option.correct_option" /> Correct
        </label>
        <button
          class="button is-small is-danger mt-2 mb-2 ml-3"
          @click="removeOption(index)"
        >
          Remove Option
        </button>
      </div>
      <button class="button is-small" @click="addOption">Add Option</button>
    </div>
    <button class="button is-primary" @click="submitChoicesQuestion">Submit M C Q</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        ordering: "",
        options: [
          { option: "", correct_option: false },
          { option: "", correct_option: false },
        ],
      },
      categories: ["content", "random", "none"],
    };
  },
  methods: {
    addOption() {
      this.form.options.push({ text: "", correct: false });
    },
    removeOption(index) {
      this.form.options.splice(index, 1);
    },
    submitChoicesQuestion() {
      this.$emit("submit-choices-question", this.form);
    },
  },
};
</script>
