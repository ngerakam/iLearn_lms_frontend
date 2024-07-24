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
        <h3 class="title is-5">Quizzes for course: {{ course?.title }}</h3>
      </div>
      <div class="column"></div>
      <div class="column">
        <button class="button is-link" @click="openCreateQuiz">
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
      v-if="quizzes.length > 0"
    >
      <thead>
        <tr>
          <th>Quiz Title</th>
          <th>Quiz Type</th>
          <th>Total Questions</th>
          <th>Passing Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quiz in quizzes" :key="quiz.id">
          <td>{{ quiz.title }}</td>
          <td>{{ quiz.category }}</td>
          <td>{{ quiz.total_questions }}</td>
          <td>{{ quiz.pass_mark }}%</td>
          <td>
            <div class="control buttons">
              <button
                class="button is-small is-info"
                @click="viewQuiz(quiz.slug)"
              >
                <i class="far fa-eye icon-spaced"></i>
                View
              </button>
              <button
                class="button is-small is-primary ml-2"
                @click="editQuiz(quiz.slug)"
              >
                <i class="far fa-edit icon-spaced"></i>
                Edit
              </button>
              <button
                class="button is-small is-danger ml-2"
                @click="deleteQuiz(quiz)"
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
    <QuizEditModal
      :existingQuiz="quiz2Edit"
      ref="quizEditModal"
      @quiz-edited="handleQuizEdit"
    />
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import DataTable from "datatables.net-bm";
import "datatables.net-bm/css/dataTables.bulma.css";
import QuizEditModal from "@/components/Quiz/Teacher/QuizEditModal.vue";

export default {
  data() {
    return {
      quizzes: [],
      course: null,
      dataTable: null,
      notification: null,
      quiz2Edit: null,
    };
  },
  components: { QuizEditModal },
  async mounted() {
    const slug = this.$router.currentRoute.value.params.slug;
    await axios.get(`courses/${slug}/`).then((response) => {
      if (response.status === 200) {
        this.course = response.data.data;
      }
    });
    this.fetchQuizzes();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchQuizzes() {
      const slug = this.$router.currentRoute.value.params.slug;
      try {
        const response = await axios.get(`quiz/courses/${slug}/`);
        const quizzesData = response.data.data;

        // Fetch question count for each quiz
        this.quizzes = await Promise.all(
          quizzesData.map(async (quiz) => {
            const questionCount = await this.getQuestionCount(
              this.course.slug,
              quiz.slug
            );
            return {
              ...quiz,
              total_questions: questionCount,
            };
          })
        );

        this.$nextTick(() => {
          this.initializeDataTable();
        });
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    },
    async getQuestionCount(courseSlug, quizSlug) {
      try {
        const response = await axios.get(
          `quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/`
        );
        return response.data.data.length;
      } catch (error) {
        console.error(
          `Error fetching quizzes for course ${courseSlug}: and quiz${quizSlug}`,
          error
        );
        return 0;
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
    viewQuiz(quizSlug) {
      this.$router.push({
        name: "QuestionView",
        params: { slug: this.course.slug, quizSlug: quizSlug },
      });
    },
    async editQuiz(quizSlug) {
      this.quiz2Edit = await this.getQuiz(this.course.slug, quizSlug);
      // console.log(this.quiz2Edit);
      this.openQuizEditModal();
    },
    async deleteQuiz(quiz) {
      if (
        confirm(`Are you sure you want to delete the quiz "${quiz.title}"?`)
      ) {
        try {
          const response = await axios.delete(
            `quiz/courses/${this.course.slug}/quiz/${quiz.slug}/`
          );
          if (response.status === 200) {
            // Remove the deleted quiz from the array
            this.quizzes = this.quizzes.filter((q) => q.id !== quiz.id);
            const message = response.data.message;
            // Show success notification
            this.showNotification(message, "is-success");
          }
        } catch (error) {
          console.error("Error deleting quiz:", error);
          // Show error notification
          this.showNotification("Failed to delete quiz", "is-danger");
        }
      }
    },
    showNotification(message, type) {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 3000); // Hide notification after 3 seconds
    },
    openQuizEditModal() {
      this.$refs.quizEditModal.openModal();
    },
    async getQuiz(courseSlug, quizSlug) {
      const response = await axios.get(
        `quiz/courses/${courseSlug}/quiz/${quizSlug}/`
      );
      return response.data.data;
    },
    async handleQuizEdit(editedQuiz) {
      const response = await axios.put(
        `quiz/courses/${this.course.slug}/quiz/${this.quiz2Edit.slug}/`,
        editedQuiz
      );
      if (response.status === 200) {
        // Update the quiz in the quizzes array
        const index = this.quizzes.findIndex(
          (q) => q.slug === this.quiz2Edit.slug
        );
        if (index !== -1) {
          this.quizzes[index] = {
            ...this.quizzes[index],
            ...response.data.data,
          };
        }
        this.showNotification(
          `The Quiz ${editedQuiz.title} has beed Edited`,
          "is-success"
        );
        console.log(`The Quiz ${editedQuiz.title} has beed Edited`);
      } else {
        this.showNotification(
          `The Quiz ${this.quiz2Edit.title} has beed not Edited`,
          "is-danger"
        );
        console.log(`The Quiz ${this.quiz2Edit.title} has not beed Edited`);
      }
    },
    openCreateQuiz() {
      this.$router.push({
        name: "QuizCreateView",
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
