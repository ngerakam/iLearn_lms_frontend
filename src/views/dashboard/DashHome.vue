<template>
  <div class="about">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <h1 class="title">My Account</h1>
      </div>
    </div>
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="tabs is-centered">
            <ul>
              <li
                v-for="tabName in [
                  'Courses',
                  'Enrolled Courses',
                  'Created Courses',
                  'Unpublished Courses',
                ]"
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
        <h2 class="subtitle is-size-6">Your: {{ activeClass }}</h2>
        <div v-if="activeClass === 'Enrolled Courses'">
          <div v-if="enrolled_courses.length === 0"></div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-4"
              v-for="course in enrolled_courses"
              v-bind:key="course.id"
            >
              <CourseItem :course="course" />
            </div>
          </div>
        </div>
        <div v-if="activeClass === 'Courses'">
          <div v-if="all_courses.length === 0"></div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-4"
              v-for="course in all_courses"
              v-bind:key="course.id"
            >
              <CourseItem :course="course" />
            </div>
          </div>
        </div>
        <div v-if="activeClass === 'Created Courses'">
          <div v-if="own_courses.length === 0"></div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-4"
              v-for="course in own_courses"
              v-bind:key="course.id"
            >
              <CourseItemStatus :course="course" />
            </div>
          </div>
        </div>
        <div v-if="activeClass === 'Unpublished Courses'">
          <div v-if="unpub_courses.length === 0"></div>
          <div v-else class="columns is-multiline">
            <div
              class="column is-4"
              v-for="course in unpub_courses"
              v-bind:key="course.id"
            >
              <CourseItemStatus :course="course" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <hr />
  </div>
</template>

<script>
import axios from "axios";
import CourseItem from "@/components/Course/CourseItem";
import CourseItemStatus from "@/components/Course/CourseItemStatus";

export default {
  data() {
    return {
      own_courses: [],
      unpub_courses: [],
      all_courses: [],
      enrolled_courses: [],
      activeClass: "Courses", // Set initial active tab
    };
  },
  components: {
    CourseItem,
    CourseItemStatus,
  },
  mounted() {
    this.getOwnCourses();
    this.getAllCourses();
    this.getUnpublishedCourses();
    this.getEnrolledCourses();
  },
  methods: {
    getAllCourses() {
      axios.get("courses").then((response) => {
        console.log(response.data, "all_courses");
        this.all_courses = response.data;
      });
    },
    getEnrolledCourses() {
      axios.get("activities/get_my_registered_courses/").then((response) => {
        console.log(response.data, "enrolled_courses");
        this.enrolled_courses = response.data.courses;
      });
    },
    getOwnCourses() {
      axios.get("activities/get_my_created_courses/").then((response) => {
        console.log(response.data, "own_courses");
        this.own_courses = response.data;
      });
    },
    getUnpublishedCourses() {
      axios.get("activities/get_my_unpublished_courses/").then((response) => {
        console.log(response.data, "unpub_courses");
        this.unpub_courses = response.data;
      });
    },
    setActiveClass(tabName) {
      this.activeClass = tabName;
    },
  },
};
</script>
