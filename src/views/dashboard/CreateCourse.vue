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
        <h1 class="title is-4">Create Course</h1>
      </div>
    </div>

    <div class="columns">
      <div class="column"></div>
      <div class="column is-10">
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
                  ></textarea>
                </div>
              </div>
              <div class="field">
                <label class="label">Choose category</label>
                <div class="select is-multiple">
                  <select multiple size="3" v-model="form.categories">
                    <option
                      v-for="category in categories"
                      v-bind:key="category.id"
                      v-bind:value="category.id"
                    >
                      {{ category.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="file has-name">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    name="image"
                    @change="handleFileUpload"
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label"> Course image… </span>
                  </span>
                  <span class="file-name" v-if="form.image">
                    {{ form.image.name }}
                  </span>
                </label>
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-success" @click="submitForm('draft')">
                  Save as draft
                </button>
              </div>
              <div class="control">
                <button class="button is-info" @click="submitForm('in_review')">
                  Submit for review
                </button>
              </div>
              <div class="control">
                <button class="button is-link" @click="submitForm('published')">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
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
        categories: [],
        status: "",
        image: null,
      },
      categories: [],
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      console.log("categories");
      await axios.get("courses/get_categories/").then((response) => {
        console.log(response.data);

        this.categories = response.data;
      });
    },
    goBack() {
      this.$router.back();
    },
    handleFileUpload(event) {
      this.form.image = event.target.files[0];
    },
    async submitForm(status) {
      console.log("submit form");

      console.log(this.form);

      this.form.status = status;

      await axios
        .post("courses/create-course/", this.form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          const slug = response.data.slug;
          this.$router.push({ name: "CourseCreateDetails", params: { slug } });
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
  },
};
</script>
