<template>
  <div class="card">
    <div class="px-3 py-3">
      <label class="label">Question</label>
      <h3>{{ question?.text }}</h3>
    </div>

    <div v-if="question?.question_type === 'multi-choice'">
      <ChoicesQuestion :question="question" />
    </div>

    <div v-if="question?.question_type === 'boolean'">
      <BooleanQuestion :question="question" />
    </div>

    <div v-if="question?.question_type === 'essay'">
      <EassyQuestion :question="question" />
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
};
</script>
