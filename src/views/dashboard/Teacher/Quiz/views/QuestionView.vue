<template>
  <div class="container mt-3 mb-3">
    <div class="columns">
      <div class="column">
        <button class="button is-small is-responsive" @click="goBack">
          <i class="fas fa-arrow-left icon-spaced"></i>Back
        </button>
      </div>
      <div class="column"></div>
      <div class="column"></div>
    </div>
    <h3 class="title is-5">Question for: {{ quiz?.title }}</h3>
    <table
      id="courseQuizzesTable"
      class="table is-bordered is-hoverable"
      v-if="questions.length > 0"
    >
      <thead>
        <tr>
          <th>Question Title</th>
          <th>Question Type</th>
          <th>Marks</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.text }}</td>
          <td>
            <div v-if="question.question_type === 'boolean'">True or False</div>
            <div v-if="question.question_type === 'essay'">Eassy</div>
            <div v-if="question.question_type === 'multi-choice'">Multiple Choice</div>
          </td>
          <td>{{ question.marks }}</td>
          <td>
            <div class="buttons">
              <button class="button is-small is-info" @click="viewQuestion(question.id)">
                <i class="far fa-eye icon-spaced"></i>
                View
              </button>
              <button
                class="button is-small is-primary ml-2"
                @click="editQuestion(question.id)"
              >
                <i class="far fa-edit icon-spaced"></i>
                Edit
              </button>
              <button
                class="button is-small is-danger ml-2"
                @click="deleteQuestion(question.id)"
              >
                <i class="fas fa-trash icon-spaced"></i>
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No quizzes found for this course.</p>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import DataTable from "datatables.net-bm";
import "datatables.net-bm/css/dataTables.bulma.css";
export default {
  data() {
    return {
      questions: [],
      quiz: null,
      course: null,
      dataTable: null,
    };
  },
  async mounted() {
    const slug = this.$router.currentRoute.value.params.slug;
    const quizSlug = this.$router.currentRoute.value.params.quizSlug;

    await axios.get(`courses/${slug}/`).then((response) => {
      if (response.status === 200) {
        this.course = response.data.data;
      }
    });
    await axios.get(`quiz/courses/${slug}/quiz/${quizSlug}`).then((response) => {
      if (response.status === 200) {
        this.course = response.data.data;
      }
    });
    this.fetchQuestions();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchQuestions() {
      const slug = this.$router.currentRoute.value.params.slug;
      const quizSlug = this.$router.currentRoute.value.params.quizSlug;
      try {
        const response = await axios.get(
          `quiz/courses/${slug}/quiz/${quizSlug}/questions/`
        );
        this.questions = response.data.data;

        this.$nextTick(() => {
          this.initializeDataTable();
        });
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    },
    initializeDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
      this.dataTable = $("#courseQuizzesTable").DataTable({
        responsive: true,
        columnDefs: [
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 },
        ],
      });
    },
    viewQuestion(quizSlug) {
      // Implement view quiz functionality
      console.log(`Viewing quiz ${quizSlug}`);
      //   this.$router.push({
      //     name: "QuestionView",
      //     params: { slug: this.course.slug, quizSlug: quizSlug },
      //   });
    },
    editQuestion(quizSlug) {
      // Implement edit quiz functionality
      console.log(`Editing quiz ${quizSlug}`);
    },
  },
  beforeDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  },
};
</script>

<style scoped>
.ml-2 {
  margin-left: 0.5rem;
}

.icon-spaced {
  margin-right: 8px;
}
</style>
