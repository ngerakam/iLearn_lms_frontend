<template>
  <div class="card">
    <div class="px-3 py-3">
      <label class="label">Question</label>
      <h3>{{ question?.text }}</h3>
    </div>

    <div v-if="question?.question_type === 'multi-choice'">
      <ChoicesQuestion :question="question" @answer="updateAnswer" />
    </div>

    <div v-if="question?.question_type === 'boolean'">
      <BooleanQuestion :question="question" @answer="updateAnswer" />
    </div>

    <div v-if="question?.question_type === 'essay'">
      <EassyQuestion :question="question" @answer="updateAnswer" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import EassyQuestion from "@/components/Quiz/Student/EassyQuestion.vue";
import BooleanQuestion from "@/components/Quiz/Student/BooleanQuestion.vue";
import ChoicesQuestion from "@/components/Quiz/Student/ChoicesQuestion.vue";
export default {
  props: {
    question: {
      type: Object,
      required: true,
    },
  },

  components: {
    BooleanQuestion,
    EassyQuestion,
    ChoicesQuestion,
  },
  data() {
    return {
      answer: null,
    };
  },
  methods: {
    updateAnswer(answer) {
      this.answer = answer;
      this.$emit("update-answer", {
        questionId: this.question.id,
        answer: this.answer,
      });
    },
  },
};
</script>
