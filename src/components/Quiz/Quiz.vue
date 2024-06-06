<template>
  <div>
    <h3>{{ quiz.question }}</h3>
    <div class="control">
      <label class="radio ms-2">
        <input type="radio" :value="quiz.op1" v-model="form.selectedAnswer" />
        {{ quiz.op1 }}
      </label>
    </div>
    <div class="control">
      <label class="radio ms-2">
        <input type="radio" :value="quiz.op2" v-model="form.selectedAnswer" />
        {{ quiz.op2 }}
      </label>
    </div>
    <div class="control">
      <label class="radio ms-2">
        <input type="radio" :value="quiz.op3" v-model="form.selectedAnswer" />
        {{ quiz.op3 }}
      </label>
    </div>
    <div class="control mt-4">
      <button class="button is-link" @click="submitQuiz">Check Answer</button>
    </div>
    <template v-if="form.quizResult == 'correct'">
      <div class="notification is-success mt-4">
        <button class="delete" @click="removeNotif()"></button>
        Correct Answer :-) You have gained 1 point!
      </div>
    </template>
    <template v-if="form.quizResult == 'incorrect'">
      <div class="notification is-danger mt-4">
        <button class="delete" @click="removeNotif()"></button>
        Wrong Answer :-( You have lost 1 point!
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ["quiz"],
  data() {
    return {
      form: {
        selectedAnswer: "",
        quizResult: null,
      },
    };
  },
  methods: {
    removeNotif() {
      this.form.quizResult = null;
    },
    submitQuiz() {
      this.form.quizResult = null;

      if (this.form.selectedAnswer) {
        if (this.form.selectedAnswer === this.quiz.answer) {
          this.form.quizResult = "correct";
        } else {
          this.form.quizResult = "incorrect";
        }
        setTimeout(() => {
          this.removeNotif();
        }, 10000);
      } else {
        alert("Select an answer first!");
      }
      this.$emit("quiz-result", this.form.quizResult);
    },
  },
};
</script>
