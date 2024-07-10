<template>
  <div class="create-course">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <h3 class="title is-4">Create a Lesson</h3>
      </div>
    </div>
    <section class="section">
      <div class="px-6 py-4 has-background-white-ter">
        <div class="notification is-danger mt-3 mb-3" v-if="errors.length">
          <button class="delete" @click="removeNotif()"></button>
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </div>
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
          <label class="label">Short description</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Short description"
              v-model="form.short_description"
            ></textarea>
          </div>
        </div>
        <div class="field">
          <label class="label">Long description</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Long description"
              v-model="form.long_description"
              :disabled="isFile || isVideo"
            ></textarea>
          </div>
        </div>
        <!-- New fields in one row -->
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Create Lesson as</label>
              <div class="control">
                <div class="select is-primary">
                  <select v-model="form.lesson_type">
                    <option disabled value="">Lesson Type</option>
                    <option value="article">Article</option>
                    <option value="file">File</option>
                    <option value="quiz">Quiz</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Lesson Youtube Id</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Youtube Id: bT7uJwLfqmg"
                  v-model="form.youtube_id"
                  :disabled="isArticle || isFile || form.video"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- End of new fields in one row -->

        <div class="field">
          <label class="label">Lesson Video</label>
          <div class="file has-name mt-3">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="video"
                @change="handleVideoUpload"
                :disabled="isArticle || isFile || form.youtube_id"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label"> Lesson video… </span>
              </span>
              <span class="file-name" v-if="form.video">
                {{ form.video.name }}
              </span>
            </label>
          </div>
        </div>

        <div class="field">
          <label class="label">Document</label>
          <div class="file has-name mt-3">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="document"
                @change="handleFileUpload"
                :disabled="isArticle || isVideo"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label"> Lesson document… </span>
              </span>
              <span class="file-name" v-if="form.document">
                {{ form.document.name }}
              </span>
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-success" @click="submitForm('draft')">
              <i class="fa fa-check icon-spaced"></i>
              Save as draft
            </button>
          </div>

          <div class="control">
            <button class="button is-link" @click="submitForm('published')">
              <i class="fa fa-check icon-spaced"></i>
              Publish
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        title: "",
        short_description: "",
        long_description: "",
        youtube_id: "",
        video: null,
        document: null,
        lesson_type: "",
        status: "",
      },

      errors: [],
    };
  },

  computed: {
    isVideo() {
      return this.form.lesson_type === "video";
    },
    isArticle() {
      return this.form.lesson_type === "article";
    },
    isFile() {
      return this.form.lesson_type === "file";
    },
  },
  methods: {
    removeNotif() {
      this.errors = [];
    },
    handleFileUpload(event) {
      this.form.document = event.target.files[0];
    },
    handleVideoUpload(event) {
      this.form.video = event.target.files[0];
    },
    validateForm() {
      this.errors = [];
      if (!this.form.title) {
        this.errors.push("Title is required.");
      }
      if (this.isArticle && !this.form.long_description) {
        this.errors.push(
          "Long and Short description is required for articles."
        );
      }
      if (this.isVideo) {
        if (!this.form.youtube_id && !this.form.video) {
          this.errors.push(
            "Either Youtube ID or video file and a short description is required for videos."
          );
        }
        if (this.form.youtube_id && this.form.video) {
          this.errors.push(
            "Please provide either Youtube ID or video file, not both."
          );
        }
      }
      if (this.isFile && !this.form.document) {
        this.errors.push(
          "Document file and a short description is required for file lessons."
        );
      }
      if (this.isQuiz && this.form.quizObject.length === 0) {
        this.errors.push("At least one quiz question is required for quizzes.");
      }
      return this.errors.length === 0;
    },
    submitForm(status) {
      console.log("submit form");

      console.log(this.form);

      this.form.status = status;

      this.validateForm();

      const slug = this.$router.currentRoute.value.params.slug;
      const moduleSlug = this.$router.currentRoute.value.params.moduleSlug;

      axios
        .post(`courses/${slug}/modules/${moduleSlug}/lessons/`, this.form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // console.log(response.data);
          this.$emit("lesson-created");
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
