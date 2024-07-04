<template>
  <div class="edit-course">
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
        <h1 class="title is-4">Edit Course: {{ course.title }}</h1>
      </div>
    </div>
    <div class="columns mt-3">
      <div class="column is-3">
        <div class="container px-3 py-3 mr-1 ml-3">
          <h2 class="title is-5">Table of Contents</h2>
          <ul class="menu-list no-style">
            <li v-for="lesson in lessons" v-bind:key="lesson.id">
              <a
                class="hover"
                @click="editLesson(lesson)"
                :disabled="enrollmentValue === null"
                ><i
                  v-if="lesson.lesson_type === 'file'"
                  class="fas fa-file icon-spaced"
                ></i>
                <i
                  v-if="lesson.lesson_type === 'video' && lesson.youtube_id !== null"
                  class="fab fa-youtube icon-spaced"
                ></i>
                <i
                  v-if="lesson.lesson_type === 'video' && lesson.get_video !== null"
                  class="fas fa-video icon-spaced"
                ></i>
                <i
                  v-if="lesson.lesson_type === 'quiz'"
                  class="fas fa-question icon-spaced"
                ></i>
                <i
                  v-if="lesson.lesson_type === 'article'"
                  class="fas fa-newspaper icon-spaced"
                ></i
                >{{ lesson.title }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="column">
        <CourseEdit />
      </div>
    </div>

    <!-- Modal for adding lessons -->
    <div class="modal" :class="{ 'is-active': isModalActive }">
      <div class="modal-background"></div>
      <div class="modal-card custom-modal-width">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Lesson</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <!-- Include LessonCreate component here -->
          <LessonCreate :course="course" @lesson-created="refreshLessons" />
        </section>
        <!-- <footer class="modal-card-foot">
          <button class="button is-success" @click="saveLesson">Save</button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer> -->
      </div>
    </div>

    <!-- end button -->
    <div class="columns">
      <div class="column"></div>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column field is-grouped">
        <div class="control">
          <button class="button is-primary" @click="openModal">
            <i class="fas fa-plus icon-spaced"></i>
            Add Lesson
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CourseEdit from "@/components/Course/CourseEdit";
import LessonCreate from "@/components/Lesson/LessonCreate.vue";

export default {
  components: {
    CourseEdit,
    LessonCreate,
  },
  data() {
    return {
      course: {
        created_by: {
          id: 0,
        },
      },
      lessons: [],
      isModalActive: false,
    };
  },
  async mounted() {
    console.log("mounted");

    const slug = this.$router.currentRoute.value.params.slug;
    console.log(slug);

    await axios.get(`courses/${slug}/`).then((response) => {
      console.log(response.data);

      this.course = response.data.data;
      this.lessons = response.data.lessons;
    });

    document.title = this.course.title + " | iLearn";
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    openModal() {
      this.isModalActive = true;
      console.log("Modal opened");
    },
    closeModal() {
      this.isModalActive = false;
    },
    async refreshLessons() {
      const slug = this.$router.currentRoute.value.params.slug;
      await axios.get(`courses/${slug}/`).then((response) => {
        this.lessons = response.data.lessons;
        this.closeModal();
      });
    },
    editLesson(lesson) {
      const courseSlug = this.$router.currentRoute.value.params.slug;
      this.$router.push({
        name: "EditLessonPage",
        params: { courseSlug: courseSlug, lessonSlug: lesson.slug },
      });
      console.log(lesson.title);
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
.custom-modal-width {
  max-width: 960px;
  width: 100%;
}
a.hover {
  transition: background-color 0.3s, color 0.3s;
}
a.hover:hover {
  background-color: #24d0ee;
  color: #3273dc;
  text-decoration: none;
}
</style>
