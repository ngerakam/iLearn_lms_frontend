<template>
  <div v-if="course">
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
      <h1 class="title is-3">{{ course.title }}</h1>
      <div class="columns">
        <div class="column">
          <img :src="course.get_image" alt="Course Image" style="max-width: 300px" />
        </div>
        <div class="column"></div>
        <div class="column">
          <h2>Course Description</h2>
          <p>{{ course.short_description }}</p>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <table id="courseActivitiesTable" class="table is-bordered is-hoverable">
            <thead>
              <tr>
                <th>Module Title</th>
                <th>Total Who Completed</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="module in course.modules"
                :key="module.id"
                :class="{
                  'is-selected': selectedModule && selectedModule.id === module.id,
                }"
                @click="showModuleActivities(module)"
              >
                <td>{{ module.title }}</td>
                <td>{{ module.completed_users_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="column" v-if="selectedModule">
          <ModuleCompletionTable :module="selectedModule" />
        </div> -->
      </div>
    </div>
  </div>
  <div v-else class="is-loading">
    <p>Loading course activities...</p>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import DataTable from "datatables.net-bm";
import "datatables.net-bm/css/dataTables.bulma.css";
import ModuleCompletionTable from "./ModuleCompletionTable.vue";

export default {
  data() {
    return {
      course: null,
      selectedModule: null,
    };
  },
  components: { ModuleCompletionTable },
  mounted() {
    this.getCourseActivities();
  },
  methods: {
    async getCourseActivities() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`statistics/completed-course-activities/${id}/`);
        this.course = response.data.course;
        this.$nextTick(() => {
          $("#courseActivitiesTable").DataTable();
        });
      } catch (error) {
        console.error("Error getting course activities", error);
        this.course = {};
      }
    },

    goBack() {
      this.$router.back();
    },
    showModuleActivities(module) {
      this.selectedModule = module;
      this.$router.push({
        name: "ModuleCompletionTable",
        params: { id: this.course.id, modId: module.id },
      });
    },
  },
  beforeDestroy() {
    if ($.fn.dataTable.isDataTable("#courseActivitiesTable")) {
      $("#courseActivitiesTable").DataTable().destroy();
    }
    if ($.fn.dataTable.isDataTable("#moduleActivitiesTable")) {
      $("#moduleActivitiesTable").DataTable().destroy();
    }
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}

table#courseActivitiesTable tbody tr.is-selected {
  background-color: rgb(180, 212, 223);
  cursor: pointer;
}
</style>
