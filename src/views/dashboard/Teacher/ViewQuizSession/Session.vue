<template>
  <div class="columns">
    <div class="column is-3">
      <div v-if="totalCourses !== null" class="card">
        <header class="card-header">
          <p class="card-header-title">Total Courses</p>
        </header>
        <div class="card-content">
          <div class="content">
            <h2 class="title">{{ totalCourses }}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-9">
      <div>
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': activeTab === 'enrollments' }">
              <a @click="changeTab('enrollments')">Enrolled Courses</a>
            </li>
            <li :class="{ 'is-active': activeTab === 'completions' }">
              <a @click="changeTab('completions')">Completed Quizzes</a>
            </li>
          </ul>
        </div>

        <div v-if="activeTab === 'started'">
          <h2 class="title is-4">Enrollment Count</h2>
          <table id="enrollmentTable" class="table is-bordered is-hoverable">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Title</th>
                <th>Total Enrollments</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="enrollment in enrollments"
                :key="enrollment.course_id"
                @click="navigateToCourseActivities(enrollment.course_id)"
              >
                <td>{{ enrollment.course_id }}</td>
                <td>{{ enrollment.course_title }}</td>
                <td>{{ enrollment.total_enrollments }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'completed'">
          <h2 class="title is-4">Completion Status</h2>
          <table id="completionTable" class="table is-bordered is-hoverable">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Title</th>
                <th>Total Completions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="completion in completions"
                :key="completion.course_id"
                @click="navigateToFinishedCourse(completion.course_id)"
              >
                <td>{{ completion.course_id }}</td>
                <td>{{ completion.course_title }}</td>
                <td>{{ completion.total_completions }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
      totalCourses: null,
      activeTab: "completed",
      enrollments: [],
      completions: [],
      error: "",
    };
  },
  mounted() {
    this.getTotalCourses();
    this.fetchEnrollments();
    this.fetchCompletions();
  },
  methods: {
    async getTotalCourses() {
      try {
        const response = await axios.get("statistics/my-total-courses/");
        if (response.data.status === 200) {
          this.totalCourses = response.data.total_courses;
        } else {
          this.totalCourses = 0;
        }
      } catch (error) {
        console.error("Error fetching total courses:", error);
        this.totalCourses = 0;
      }
    },
    navigateToCourseActivities(courseId) {
      console.log("clicked Activity for course:", courseId);
      this.$router.push({
        name: "TeacherCourseActivities",
        params: { id: courseId },
      });
    },
    navigateToFinishedCourse(courseId) {
      console.log("clicked completed course:", courseId);
      this.$router.push({
        name: "TeacherCompletedCourses",
        params: { id: courseId },
      });
    },
    async fetchEnrollments() {
      try {
        const response = await axios.get("statistics/enrollment-count/");
        this.enrollments = response.data;
        this.$nextTick(() => {
          $("#enrollmentTable").DataTable();
        });
      } catch (error) {
        this.error = "Error fetching enrollment data";
        console.error("Error fetching enrollment data:", error);
      }
    },
    async fetchCompletions() {
      try {
        const response = await axios.get("statistics/completion-status/");
        this.completions = response.data;
        this.$nextTick(() => {
          $("#completionTable").DataTable();
        });
      } catch (error) {
        this.error = "Error fetching completion data";
        console.error("Error fetching completion data:", error);
      }
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.$nextTick(() => {
        if (tab === "enrollments") {
          if ($.fn.dataTable.isDataTable("#enrollmentTable")) {
            $("#enrollmentTable").DataTable().destroy();
          }
          this.$nextTick(() => {
            $("#enrollmentTable").DataTable();
          });
        } else if (tab === "completions") {
          if ($.fn.dataTable.isDataTable("#completionTable")) {
            $("#completionTable").DataTable().destroy();
          }
          this.$nextTick(() => {
            $("#completionTable").DataTable();
          });
        }
      });
    },
  },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
