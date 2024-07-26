<template>
  <div class="container is-centered mt-3 mb-3">
    <h3 class="title is-5">My Courses and Quizzes</h3>
    <table
      id="courseQuizzesTable"
      class="table is-bordered is-hoverable"
      v-if="tableData.length > 0"
    >
      <thead>
        <tr>
          <th>Course Title</th>
          <th>Number of Quizzes</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="course in tableData"
          :key="course.id"
          @click="navigateToCourseQuizzes(course)"
        >
          <td>{{ course.title }}</td>
          <td>{{ course.quizCount }}</td>
        </tr>
      </tbody>
    </table>
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
      own_courses: [],
      tableData: [],
    };
  },
  mounted() {
    this.getOwnCourses();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async getOwnCourses() {
      try {
        const response = await axios.get("activities/courses/created/");
        this.own_courses = response.data.data;
        await this.prepareTableData();
        this.$nextTick(() => {
          $("#courseQuizzesTable").DataTable();
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async prepareTableData() {
      this.tableData = await Promise.all(
        this.own_courses.map(async (course) => {
          const quizCount = await this.getQuizCount(course.slug);
          return {
            id: course.id,
            title: course.title,
            quizCount: quizCount,
            slug: course.slug,
          };
        })
      );
    },
    async getQuizCount(courseSlug) {
      try {
        const response = await axios.get(`quiz/courses/${courseSlug}/`);
        return response.data.data.length; // Assuming the API returns an array of quizzes
      } catch (error) {
        console.error(
          `Error fetching quizzes for course ${courseSlug}:`,
          error
        );
        return 0;
      }
    },
    navigateToCourseQuizzes(course) {
      this.$router.push({
        name: "SingleQuiz",
        params: { slug: course.slug },
      });
    },
  },
  beforeDestroy() {
    if ($.fn.dataTable.isDataTable("#courseQuizzesTable")) {
      $("#courseQuizzesTable").DataTable().destroy();
    }
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
