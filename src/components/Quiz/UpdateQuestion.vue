<template>
  <form class="box" @submit.prevent="submitQuiz">
    <div class="field">
      <label class="label">Question</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Enter question"
          v-model="form.question"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Option 1</label>
      <div class="control">
        <label class="radio">
          <input type="radio" v-model="form.answer" :value="form.op1" />
          is this anser correct?
        </label>
        <input
          class="input"
          type="text"
          placeholder="Option 1"
          v-model="form.op1"
        />
      </div>
    </div>
    <div class="field">
      <label class="label">Option 2</label>
      <div class="control">
        <label class="radio">
          <input type="radio" v-model="form.answer" :value="form.op2" />
          is this anser correct?
        </label>
        <input
          class="input"
          type="text"
          placeholder="Option 2"
          v-model="form.op2"
        />
      </div>
    </div>
    <div class="field">
      <label class="label">Option 3</label>
      <div class="control">
        <label class="radio">
          <input type="radio" v-model="form.answer" :value="form.op3" />
          is this anser correct?
        </label>
        <input
          class="input"
          type="text"
          placeholder="Option 3"
          v-model="form.op3"
        />
      </div>
    </div>

    <button class="button is-primary" type="submit">Update Quiz</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        question: "",
        op1: "",
        op2: "",
        op3: "",
        answer: null,
      },
    };
  },
  methods: {
    submitQuiz() {
      this.$emit("submit-quiz", this.form);
    },
  },
};
</script>
