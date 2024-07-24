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
    <div v-if="notification" :class="['notification', notification.type]">
      <button class="delete" @click="notification = null"></button>
      {{ notification.message }}
    </div>

    <div class="columns">
      <div class="column">
        <h3 class="title is-5">Questions for quiz: {{ quiz?.title }}</h3>
      </div>
      <div class="column"></div>
      <div class="column">
        <button class="button is-link" @click="openCreateQuestion">
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
        </button>
      </div>
      <div class="column"></div>
    </div>
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
            <div v-if="question.question_type === 'multi-choice'">
              Multiple Choice
            </div>
          </td>
          <td>{{ question.marks }}</td>
          <td>
            <div class="buttons">
              <button
                class="button is-small is-info"
                @click="viewQuestion(question.id)"
              >
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
                @click="deleteQuestion(question)"
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
    <QuestionEditModal
      :existingQuestion="question2Edit"
      ref="questionEditModal"
      @question-edited="handleQuestionEdit"
    />
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import DataTable from "datatables.net-bm";
import "datatables.net-bm/css/dataTables.bulma.css";
import QuestionEditModal from "@/components/Quiz/Teacher/QuestionEditModal.vue";

export default {
  data() {
    return {
      questions: [],
      quiz: null,
      course: null,
      dataTable: null,
      notification: null,
      question2Edit: null,
    };
  },
  components: { QuestionEditModal },
  async mounted() {
    const slug = this.$router.currentRoute.value.params.slug;
    const quizSlug = this.$router.currentRoute.value.params.quizSlug;

    await axios.get(`courses/${slug}/`).then((response) => {
      if (response.status === 200) {
        this.course = response.data.data;
      }
    });
    await axios
      .get(`quiz/courses/${slug}/quiz/${quizSlug}/`)
      .then((response) => {
        if (response.status === 200) {
          this.quiz = response.data.data;
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
    viewQuestion(questionId) {
      // Implement view quiz functionality
      console.log(`Viewing quiz ${questionId}`);
      this.$router.push({
        name: "AnswersView",
        params: {
          slug: this.course.slug,
          quizSlug: this.quiz.slug,
          id: questionId,
        },
      });
    },
    async editQuestion(questionId) {
      this.question2Edit = await this.getQuestion(
        this.course.slug,
        this.quiz.slug,
        questionId
      );
      // console.log(`Editing quiz ${questionId}`);
      this.openQuestionEditModal();
    },
    async deleteQuestion(question) {
      if (
        confirm(
          `Are you sure you want to delete the question "${question.text}" ?`
        )
      ) {
        try {
          const response = await axios.delete(
            `quiz/courses/${this.course.slug}/quiz/${this.quiz.slug}/questions/${question.id}/`
          );
          if (response.status === 200) {
            // Remove the deleted question from the array
            this.questions = this.questions.filter((q) => q.id !== question.id);
            const message = response.data.message;
            // Show success notification
            this.showNotification(message, "is-success");
          }
        } catch (error) {
          console.error("Error deleting quiz:", error);
          // Show error notification
          this.showNotification("Failed to delete question", "is-danger");
        }
      }
    },
    showNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 3000); // Hide notification after 3 seconds
    },
    openQuestionEditModal() {
      this.$refs.questionEditModal.openModal();
    },
    async getQuestion(courseSlug, quizSlug, questionId) {
      const response = await axios.get(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${questionId}/`
      );
      return response.data.data;
    },
    async handleQuestionEdit(editedQuestion) {
      const response = await axios.put(
        `quiz/courses/${this.course.slug}/quiz/${this.quiz.slug}/questions/${this.question2Edit.id}/`,
        editedQuestion
      );
      if (response.status === 200) {
        // Update the quiz in the quizzes array
        const index = this.questions.findIndex(
          (q) => q.id === this.question2Edit.id
        );
        if (index !== -1) {
          this.questions[index] = {
            ...this.questions[index],
            ...response.data.data,
          };
        }
        this.showNotification(
          `The Question ${editedQuestion.text} has beed Edited`,
          "is-success"
        );
        console.log(`The Question ${editedQuestion.text} has beed Edited`);
      } else {
        this.showNotification(
          `The Question ${this.question2Edit.text} has beed not Edited`,
          "is-danger"
        );
        console.log(
          `The Question ${this.question2Edit.text} has not beed Edited`
        );
      }
    },
    openCreateQuestion() {
      this.$router.push({
        name: "QuestionCreateView",
        params: { slug: this.course.slug, quizSlug: this.quiz.slug },
      });
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
