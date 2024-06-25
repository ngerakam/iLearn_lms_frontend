<template>
  <div class="create-course">
    <div class="hero is-info">
      <div class="columns py-3 px-3">
        <div class="column">
          <button class="button is-small is-responsive" @click="goBack">
            <i class="fas fa-arrow-left icon-spaced"></i>Back
          </button>
        </div>
        <div class="column"></div>
        <div class="column"></div>
      </div>
      <div class="has-text-centered mb-2">
        <h1 class="title is-4">Update lesson: {{ lesson?.title }}</h1>
      </div>
    </div>

    <div class="columns">
      <div class="column"></div>
      <div class="column is-10">
        <section class="section">
          <div class="px-6 py-4 has-background-white-ter">
            <LessonUpdate :lesson="lesson" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LessonUpdate from "@/components/Lesson/LessonUpdate";

export default {
  data() {
    return {
      lesson: {},
    };
  },
  components: {
    LessonUpdate,
  },
  mounted() {
    this.getLesson();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async getLesson() {
      const courseSlug = this.$router.currentRoute.value.params.courseSlug;
      const lessonSlug = this.$router.currentRoute.value.params.lessonSlug;
      console.log("Course slug", courseSlug);
      console.log("Lesson slug", lessonSlug);
      await axios.get(`courses/${courseSlug}/lessons/${lessonSlug}/`).then((response) => {
        console.log(response.data);
        this.lesson = response.data;
      });
    },
  },
};
</script>
