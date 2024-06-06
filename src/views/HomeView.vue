<template>
  <div class="home">
    <div class="hero is-info is-medium">
      <div class="hero-body has-text-centered">
        <h1 class="title">Welcome to iLearn LMS</h1>

        <h2 class="subtitle">An E-learning platform for gaining knowledge.</h2>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-4">
            <div class="box has-text-centered">
              <span class="icon is-size-2 has-text-in">
                <i class="far fa-clock"></i>
              </span>
              <h2 class="is-size-4 mt-4 mb-4">Self-paced studying</h2>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                deserunt ipsam deleniti, eius provident libero aspernatur aut
                maxime nulla veniam rerum pariatur inventore, repudiandae
                mollitia natus beatae ducimus doloribus eligendi!
              </p>
            </div>
          </div>
          <div class="column is-4">
            <div class="box has-text-centered">
              <span class="icon is-size-2 has-text-in">
                <i class="far fa-comments"></i>
              </span>
              <h2 class="is-size-4 mt-4 mb-4">Group studying</h2>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                deserunt ipsam deleniti, eius provident libero aspernatur aut
                maxime nulla veniam rerum pariatur inventore, repudiandae
                mollitia natus beatae ducimus doloribus eligendi!
              </p>
            </div>
          </div>
          <div class="column is-4">
            <div class="box has-text-centered">
              <span class="icon is-size-2 has-text-in">
                <i class="fas fa-home"></i>
              </span>
              <h2 class="is-size-4 mt-4 mb-4">Study Anywhere</h2>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                deserunt ipsam deleniti, eius provident libero aspernatur aut
                maxime nulla veniam rerum pariatur inventore, repudiandae
                mollitia natus beatae ducimus doloribus eligendi!
              </p>
            </div>
          </div>
          <template v-if="!$store.state.user.isAuthenticated">
            <div class="column is-12 has-text-centered">
              <a href="/sign-up" class="button is-info is-size-3 mt-6 mb 6">
                click to get started
              </a>
            </div>
          </template>

          <hr />

          <div
            class="column is-3 mt-3"
            v-for="course in courses"
            v-bind:key="course.id"
          >
            <CourseItem :course="course" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

import CourseItem from "@/components/Course/CourseItem";

export default {
  name: "HomeView",
  data() {
    return {
      courses: [],
    };
  },
  components: {
    CourseItem,
  },
  mounted() {
    console.log("mounted");

    axios.get("courses/get_frontpage_courses/").then((response) => {
      console.log(response.data);

      this.courses = response.data;
    });

    document.title = "Home | iLearn";
  },
};
</script>
