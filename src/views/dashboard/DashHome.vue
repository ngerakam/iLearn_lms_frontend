<template>
  <div class="DashHome">
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="tabs is-centered">
            <ul>
              <li
                v-for="tabName in tabNames"
                :key="tabName"
                :class="{ 'is-active': activeClass === tabName }"
              >
                <a @click="setActiveClass(tabName)">{{ tabName }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container">
        <h2 class="subtitle is-size-6">{{ activeClass }}</h2>
        <!-- Enrolled Courses Tab -->
        <div v-if="activeClass === 'Enrolled Courses'">
          <div v-if="enrolled_courses.length === 0">No enrolled courses found.</div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-3"
              v-for="course in paginatedEnrolledCourses"
              :key="course.id"
            >
              <CourseItem :course="course" />
            </div>
          </div>
          <div class="column is-7 mx-auto">
            <PaginationComponent
              v-if="enrolled_courses.length > itemsPerPage"
              :totalItems="enrolled_courses.length"
              :itemsPerPage="itemsPerPage"
              :initialPage="currentPage.enrolled"
              @page-changed="handlePageChanged('enrolled', $event)"
            />
          </div>
        </div>
        <!-- Courses Tab -->
        <div v-if="activeClass === 'Courses'">
          <div v-if="all_courses.length === 0">No courses found.</div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-3"
              v-for="course in paginatedAllCourses"
              :key="course.id"
            >
              <CourseItem :course="course" />
            </div>
          </div>
          <div class="column is-7 mx-auto">
            <PaginationComponent
              v-if="all_courses.length > itemsPerPage"
              :totalItems="all_courses.length"
              :itemsPerPage="itemsPerPage"
              :initialPage="currentPage.all"
              @page-changed="handlePageChanged('all', $event)"
            />
          </div>
        </div>
        <!-- Created Courses Tab -->
        <div v-if="activeClass === 'Created Courses'">
          <div class="columns">
            <div class="column"></div>
            <div class="column"></div>
            <div class="column"></div>
            <div class="column">
              <router-link to="/dashboard/create-course" class="button is-primary">
                <i class="fas fa-plus icon-spaced"></i>
                Create Course
              </router-link>
            </div>
          </div>
          <div v-if="own_courses.length === 0">No created courses found.</div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-3"
              v-for="course in paginatedOwnCourses"
              :key="course.id"
            >
              <CourseItemStatus :course="course" @click="handleCourseEdit(course.slug)" />
            </div>
          </div>
          <div class="column is-7 mx-auto">
            <PaginationComponent
              v-if="own_courses.length > itemsPerPage"
              :totalItems="own_courses.length"
              :itemsPerPage="itemsPerPage"
              :initialPage="currentPage.own"
              @page-changed="handlePageChanged('own', $event)"
            />
          </div>
        </div>

        <!-- Completed Courses Tab -->
        <div v-if="activeClass === 'Completed Courses'">
          <div v-if="completed_courses.length === 0">
            You have not completed any course.
          </div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-3"
              v-for="course in paginatedCompletedCourses"
              :key="course.id"
            >
              <CourseItem :course="course" />
            </div>
          </div>
          <div class="column is-7 mx-auto">
            <PaginationComponent
              v-if="completed_courses.length > itemsPerPage"
              :totalItems="completed_courses.length"
              :itemsPerPage="itemsPerPage"
              :initialPage="currentPage.unpub"
              @page-changed="handlePageChanged('completed', $event)"
            />
          </div>
        </div>

        <!-- Unpublished Courses Tab -->
        <div v-if="activeClass === 'Unpublished Courses'">
          <div v-if="unpub_courses.length === 0">No unpublished courses found.</div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-3"
              v-for="course in paginatedUnpubCourses"
              :key="course.id"
            >
              <CourseItemStatus :course="course" />
            </div>
          </div>
          <div class="column is-7 mx-auto">
            <PaginationComponent
              v-if="unpub_courses.length > itemsPerPage"
              :totalItems="unpub_courses.length"
              :itemsPerPage="itemsPerPage"
              :initialPage="currentPage.unpub"
              @page-changed="handlePageChanged('unpub', $event)"
            />
          </div>
        </div>
        <div v-if="activeClass === 'Course Notifications'">
          <div class="columns is-multiline">
            <div>
              <TeacherNotifications />
            </div>
          </div>
        </div>
        <div v-if="activeClass === 'Courses Statistics'">
          <div class="columns is-multiline">
            <div>
              <TeacherStatistics />
            </div>
          </div>
        </div>
        <div v-if="activeClass === 'User Management'">
          <div class="columns my-0">
            <div class="column"></div>
            <div class="column"></div>
            <div class="column"></div>
            <div class="column">
              <router-link to="/dashboard/add-user/" class="button is-primary">
                <i class="fas fa-user-plus icon-spaced"></i>
                Add User
              </router-link>
            </div>
          </div>
          <div class="columns is-multiline">
            <div><UserManagment /></div>
          </div>
        </div>
        <div v-if="activeClass === 'Website Management'">
          <div><SiteSetup /></div>
        </div>
        <div v-if="activeClass === 'Site Notifications'">
          <div class="columns is-multiline">
            <div>Site Notifications</div>
          </div>
        </div>
      </div>
    </section>
    <hr />
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import CourseItem from "@/components/Course/CourseItem";
import CourseItemStatus from "@/components/Course/CourseItemStatus";
import TeacherNotifications from "./Teacher/TeacherNotifications.vue";
import TeacherStatistics from "./Teacher/TeacherStatistics.vue";
import UserManagment from "./Admin/UserManagment.vue";
import SiteSetup from "./Admin/SiteSetup.vue";
import PaginationComponent from "@/components/Utils/PaginationComponent";

export default {
  data() {
    return {
      completed_courses: [],
      own_courses: [],
      unpub_courses: [],
      all_courses: [],
      enrolled_courses: [],
      activeClass: "",
      itemsPerPage: 4,
      currentPage: {
        enrolled: 1,
        all: 1,
        own: 1,
        unpub: 1,
        completed: 1,
      },
    };
  },
  components: {
    CourseItem,
    CourseItemStatus,
    TeacherNotifications,
    TeacherStatistics,
    UserManagment,
    SiteSetup,
    PaginationComponent,
  },
  computed: {
    ...mapState({
      userDetails: (state) => state.userDetails.userDetails,
    }),
    tabNames() {
      const userRoles = this.userDetails.user;
      let tabs = ["Courses"]; // Always include 'Courses'

      if (userRoles?.is_student) {
        tabs.push("Enrolled Courses", "Completed Courses");
      }

      if (userRoles?.is_teacher) {
        tabs = [
          "Courses Statistics",
          "Created Courses",
          "Unpublished Courses",
          "Course Notifications",
        ];
      }

      if (userRoles?.is_admin) {
        tabs = [
          "User Management",
          "Website Management",
          "Site Notifications",
          "Courses Statistics",
          "Created Courses",
        ];
      }

      return tabs;
    },
    paginatedCompletedCourses() {
      return this.paginate(this.completed_courses, this.currentPage.completed);
    },
    paginatedEnrolledCourses() {
      return this.paginate(this.enrolled_courses, this.currentPage.enrolled);
    },
    paginatedAllCourses() {
      return this.paginate(this.all_courses, this.currentPage.all);
    },
    paginatedOwnCourses() {
      return this.paginate(this.own_courses, this.currentPage.own);
    },
    paginatedUnpubCourses() {
      return this.paginate(this.unpub_courses, this.currentPage.unpub);
    },
  },
  watch: {
    tabNames: {
      immediate: true,
      handler(newTabNames) {
        if (newTabNames.length > 0) {
          this.activeClass = newTabNames[0];
        }
      },
    },
  },
  mounted() {
    this.getOwnCourses();
    this.getAllCourses();
    this.getUnpublishedCourses();
    this.getEnrolledCourses();
    this.getDoneCourses();
  },
  methods: {
    getDoneCourses() {
      axios.get("activities/courses/completed/").then((response) => {
        this.completed_courses = response.data.data;
      });
    },
    getAllCourses() {
      axios.get("courses").then((response) => {
        this.all_courses = response.data.data;
      });
    },
    getEnrolledCourses() {
      axios.get("activities/courses/enrolled/").then((response) => {
        this.enrolled_courses = response.data.data;
      });
    },
    getOwnCourses() {
      axios.get("activities/courses/created/").then((response) => {
        this.own_courses = response.data.data;
      });
    },
    getUnpublishedCourses() {
      axios.get("activities/courses/unpublished/").then((response) => {
        this.unpub_courses = response.data.data;
      });
    },
    setActiveClass(tabName) {
      this.activeClass = tabName;
    },
    handleCourseEdit(course_slug) {
      this.$router.push({
        name: "CourseEditPage",
        params: { slug: course_slug },
      });
    },
    paginate(items, currentPage) {
      if (!Array.isArray(items)) {
        console.error("Expected an array but got:", items);
        return [];
      }
      const start = (currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return items.slice(start, end);
    },
    handlePageChanged(type, page) {
      this.currentPage[type] = page;
    },
    handlePageChanged(type, page) {
      this.currentPage[type] = page;
    },
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
