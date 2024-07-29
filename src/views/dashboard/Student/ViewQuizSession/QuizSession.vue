<template>
  <div>
    <div class="columns is-multiline">
      <div
        class="column is-6"
        v-for="item in paginatedCourseQuizzes"
        :key="item.course.id"
      >
        <QuizCard :quiz="item.quiz" :course="item.course" />
      </div>
    </div>
    <PaginationComponent
      :total-items="courseQuizzes.length"
      :items-per-page="4"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script>
import axios from "axios";
import QuizCard from "./QuizCard.vue";
import PaginationComponent from "@/components/Utils/PaginationComponent";

export default {
  components: {
    QuizCard,
    PaginationComponent,
  },
  data() {
    return {
      courseQuizzes: [],
      currentPage: 1,
    };
  },
  computed: {
    paginatedCourseQuizzes() {
      const start = (this.currentPage - 1) * 4;
      const end = start + 4;
      return this.courseQuizzes.slice(start, end);
    },
  },
  methods: {
    async getCourses() {
      try {
        const response = await axios.get("courses/?user_courses=true");
        return response.data.data;
      } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
      }
    },
    async getQuizzes(courseSlug) {
      try {
        const response = await axios.get(`quiz/courses/${courseSlug}/`);
        return response.data.data;
      } catch (error) {
        console.error(`Error fetching quizzes for course ${courseSlug}:`, error);
        return [];
      }
    },
    async fetchCourseQuizzes() {
      const courses = await this.getCourses();
      this.courseQuizzes = await Promise.all(
        courses.map(async (course) => {
          const quizzes = await this.getQuizzes(course.slug);
          return quizzes.map((quiz) => ({ course, quiz }));
        })
      );
      // Flatten the array of arrays
      this.courseQuizzes = this.courseQuizzes.flat();
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
    },
  },
  created() {
    this.fetchCourseQuizzes();
  },
};
</script>
