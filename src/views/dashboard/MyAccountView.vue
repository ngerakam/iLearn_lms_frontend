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
                  'Settings',
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
          <div class="columns">
            <div
              class="column is-4"
              v-for="course in courses"
              v-bind:key="course.id"
            >
              <CourseItem :course="course" />
            </div>
          </div>
        </div>
        <div v-if="activeClass === 'Settings'">
          <UserSettings />
        </div>
      </div>
    </section>
    <hr />
  </div>
</template>

<script>
import axios from "axios";
import CourseItem from "@/components/Course/CourseItem";
import UserSettings from "@/components/User/UserSettings";

export default {
  data() {
    return {
      courses: [],
      activeClass: "Enrolled Courses", // Set initial active tab
    };
  },
  components: {
    CourseItem,
    UserSettings,
  },
  mounted() {
    axios.get("activities/get_active_courses/").then((response) => {
      console.log(response.data);
      this.courses = response.data;
    });
  },
  methods: {
    setActiveClass(tabName) {
      this.activeClass = tabName;
    },
  },
};
</script>
