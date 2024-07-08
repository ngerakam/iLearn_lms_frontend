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
        <h1 class="title is-4">Edit Module: {{ form.title }}</h1>
      </div>
    </div>
    <div class="columns mt-3">
      <div class="column is-3">
        <div class="container px-3 py-3 mr-1 ml-3">
          <h2 class="title is-5">Table of Contents</h2>
          <p>Lessons</p>
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
        <section class="section">
          <div class="px-6 py-4 has-background-white-ter">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Title"
                  v-model="form.title"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <textarea
                  class="textarea"
                  placeholder="Short description"
                  v-model="form.description"
                ></textarea>
              </div>
            </div>
            <div class="field">
              <ToggleButton
                title="Module State"
                :isChecked="form.is_open"
                v-model="form.is_open"
                @toggle-change="handleToggleChange"
              />
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-link" @click="submitForm">
                  <i class="fa fa-check icon-spaced"></i>
                  Publish
                </button>
              </div>
            </div>
          </div>
        </section>
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
import ToggleButton from "@/components/Utils/ToggleButton.vue";
import LessonCreate from "@/components/Lesson/LessonCreate.vue";

export default {
  components: {
    LessonCreate,
    ToggleButton,
  },
  data() {
    return {
      form: {
        id: 0,
        title: "",
        slug: "",
        description: "",
        is_open: false,
      },

      lessons: [],
      isModalActive: false,
    };
  },
  async mounted() {
    console.log("mounted");

    const slug = this.$router.currentRoute.value.params.slug;
    const moduleSlug = this.$router.currentRoute.value.params.moduleSlug;
    // console.log(slug);

    await axios.get(`courses/${slug}/modules/${moduleSlug}/`).then((response) => {
      this.form = response.data.data;
      this.form.is_open = response.data.data.is_open;
    });

    await axios.get(`courses/${slug}/modules/${moduleSlug}/lessons/`).then((response) => {
      // console.log(response.data);
      this.lessons = response.data.data;
    });

    document.title = this.form.title + " | iLearn";
  },
  methods: {
    handleToggleChange(e) {},
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
      const moduleSlug = this.$router.currentRoute.value.params.moduleSlug;
      await axios
        .get(`courses/${slug}/modules/${moduleSlug}/lessons/`)
        .then((response) => {
          this.lessons = response.data.data;
          this.closeModal();
        });
    },
    async submitForm() {
      console.log(this.form);
      const slug = this.$router.currentRoute.value.params.slug;

      await axios
        .put(`courses/${slug}/modules/${this.form.slug}/`, this.form)
        .then((response) => {})
        .catch((error) => {
          console.log("error: ", error);
        });
    },

    editLesson(lesson) {
      const slug = this.$router.currentRoute.value.params.slug;
      this.$router.push({
        name: "EditLessonPage",
        params: {
          slug: slug,
          moduleSlug: this.form.slug,
          lessonSlug: lesson.slug,
        },
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
