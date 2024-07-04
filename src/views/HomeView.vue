<template>
  <div class="home">
    <div class="hero is-info is-medium">
      <div class="hero-body has-text-centered">
        <h1 class="title">{{ siteSetup.hero_name }}</h1>
        <h2 class="subtitle">{{ siteSetup.hero_message }}</h2>
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
              <h2 class="is-size-4 mt-4 mb-4">{{ siteSetup.card1_name }}</h2>
              <p>{{ siteSetup.card1 }}</p>
            </div>
          </div>
          <div class="column is-4">
            <div class="box has-text-centered">
              <span class="icon is-size-2 has-text-in">
                <i class="far fa-comments"></i>
              </span>
              <h2 class="is-size-4 mt-4 mb-4">{{ siteSetup.card2_name }}</h2>
              <p>{{ siteSetup.card2 }}</p>
            </div>
          </div>
          <div class="column is-4">
            <div class="box has-text-centered">
              <span class="icon is-size-2 has-text-in">
                <i class="fas fa-home"></i>
              </span>
              <h2 class="is-size-4 mt-4 mb-4">{{ siteSetup.card3_name }}</h2>
              <p>{{ siteSetup.card3 }}</p>
            </div>
          </div>
          <template v-if="!$store.state.user.isAuthenticated">
            <div class="column is-12 has-text-centered">
              <a href="/sign-up" class="button is-info is-size-3 mt-6 mb-6">
                Click to get started
              </a>
            </div>
          </template>

          <hr />

          <div class="column is-3 mt-3" v-for="course in courses" :key="course.id">
            <CourseItem :course="course" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
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
  computed: {
    ...mapState({
      siteSetup: (state) => state.siteSetup.siteSetup,
    }),
  },
  mounted() {
    console.log("mounted");

    axios.get("activities/courses/frontpage/").then((response) => {
      console.log(response.data);

      this.courses = response.data.data;
    });

    document.title = "Home | iLearn";
  },
};
</script>
