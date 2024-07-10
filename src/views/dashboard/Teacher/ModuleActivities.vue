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
    <h3 class="title is-5">{{ selectedModule?.title }}</h3>
    <table
      id="moduleActivitiesTable"
      class="table is-bordered is-hoverable"
      v-if="selectedModule"
    >
      <thead>
        <tr>
          <th>Lesson Title</th>
          <th>Total Who Completed</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="lesson in selectedModule.lessons"
          :key="lesson.id"
          :class="{
            'is-selected': selectedLesson && selectedLesson?.id === lesson.id,
          }"
          @click="showLessonActivities(lesson)"
        >
          <td>{{ lesson.title }}</td>
          <td>{{ lesson.completed_users.length }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedLesson">
      <LessonActivitiesTable :lesson="selectedLesson" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LessonActivitiesTable from "./LessonActivitiesTable.vue";
import $ from "jquery";
import DataTable from "datatables.net-bm";
import "datatables.net-bm/css/dataTables.bulma.css";

export default {
  data() {
    return {
      course: null,
      selectedModule: null,
      selectedLesson: null,
    };
  },
  mounted() {
    this.getModuleLessons();
  },
  components: { LessonActivitiesTable },
  methods: {
    showLessonActivities(lesson) {
      this.selectedLesson = lesson;
      this.$nextTick(() => {
        if ($.fn.dataTable.isDataTable("#lessonActivitiesTable")) {
          $("#lessonActivitiesTable").DataTable().destroy();
        }
        $("#lessonActivitiesTable").DataTable();
      });
    },
    getModuleById(courseData, moduleId) {
      if (!courseData || !courseData.modules) {
        throw new Error("Invalid course data");
      }

      const modules = courseData.modules;
      const module = modules.find((mod) => mod.id === moduleId);

      if (!module) {
        throw new Error(`Module with ID ${moduleId} not found`);
      }

      return module;
    },
    async getModuleLessons() {
      const id = this.$route.params.id;
      const modId = parseInt(this.$route.params.modId, 10);
      try {
        const response = await axios.get(`statistics/course-activities/${id}/`);
        console.log("API Response:", response.data);
        this.course = response.data.course;
        this.selectedModule = this.getModuleById(this.course, modId);
        console.log("Selected Module:", this.selectedModule);
        this.$nextTick(() => {
          $("#moduleActivitiesTable").DataTable();
        });
      } catch (error) {
        console.error("Error getting course activities", error);
        this.course = {};
      }
    },
    goBack() {
      this.$router.back();
    },
  },
  beforeDestroy() {
    if ($.fn.dataTable.isDataTable("#moduleActivitiesTable")) {
      $("#moduleActivitiesTable").DataTable().destroy();
    }
    if ($.fn.dataTable.isDataTable("#lessonActivitiesTable")) {
      $("#lessonActivitiesTable").DataTable().destroy();
    }
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
