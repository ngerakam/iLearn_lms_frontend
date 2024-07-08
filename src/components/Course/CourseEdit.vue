<template>
  <div>
    <section class="section">
      <div class="px-6 py-4 has-background-white-ter">
        <form @submit.prevent="updateCourse">
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="course.title" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Short description</label>
            <div class="control">
              <textarea
                class="textarea"
                placeholder="Short description"
                v-model="course.short_description"
              ></textarea>
            </div>
          </div>
          <div class="field">
            <label class="label">Long description</label>
            <div class="control">
              <textarea
                class="textarea"
                placeholder="Long description"
                v-model="course.long_description"
              ></textarea>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Choose category</label>
                <div class="select is-multiple">
                  <select multiple size="3" v-model="course.categories">
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
            </div>
            <div class="column">
              <div class="field mt-3">
                <label class="label">Add category</label>
                <button
                  class="button is-secondary"
                  type="button"
                  @click="openCategoryModal"
                >
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                </button>
              </div>
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
              <span class="file-name" v-if="course.image">{{ course.image.name }}</span>
            </label>
          </div>
          <div class="field">
            <label class="label">Status</label>
            <div class="control">
              <label class="radio" v-for="(status, index) in statuses" :key="index">
                <input type="radio" v-model="course.status" :value="status" />
                {{ status }}
              </label>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-primary" type="submit">
                <i class="far fa-edit icon-spaced"></i>
                Update Course
              </button>
            </div>
            <div class="control">
              <button class="button is-danger" @click="handleDelete">
                <i class="fas fa-minus icon-spaced"></i>
                Delete Course
              </button>
            </div>
          </div>
        </form>
      </div>
      <CategoryModal ref="categoryModal" @category-added="updateCategories" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import CategoryModal from "@/components/Categories/CategoryModal.vue";

export default {
  props: {
    courseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      course: {
        title: "",
        short_description: "",
        long_description: "",
        categories: [],
        status: "",
        image: null,
      },
      categories: [],
      statuses: ["published", "draft", "in_review"],
    };
  },
  components: {
    CategoryModal,
  },
  async mounted() {
    await this.getCategories();
    await this.getCourse();
  },
  methods: {
    handleFileUpload(event) {
      this.course.image = event.target.files[0];
    },
    async getCategories() {
      try {
        const response = await axios.get("courses/categories/");
        this.categories = response.data.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async getCourse() {
      const slug = this.$router.currentRoute.value.params.slug;
      console.log(slug);

      await axios.get(`courses/${slug}/status/`).then((response) => {
        console.log(response.data);

        this.course = response.data.data;
        this.lessons = response.data.lessons;
        this.course.categories = this.course.categories.map((cat) => cat.id);
        console.log("Course categories mapped to IDs: ", this.course.categories);
      });
    },
    async updateCourse() {
      try {
        const formData = new FormData();
        for (const key in this.course) {
          if (this.course.hasOwnProperty(key)) {
            if (key === "categories") {
              this.course[key].forEach((category) => {
                formData.append("categories[]", category);
              });
            } else {
              formData.append(key, this.course[key]);
            }
          }
        }

        const slug = this.$router.currentRoute.value.params.slug;
        await axios.put(`/courses/${slug}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.$emit("course-updated");
        this.$router.back();
      } catch (error) {
        console.error("Error updating course:", error);
      }
    },
    async handleDelete() {
      const slug = this.$router.currentRoute.value.params.slug;
      await axios.delete(`/courses/${slug}/`).then((response) => {
        if (response.status === 200) {
          console.log(reponse.data.data);
        }
      });
      console.log("deleted course: ", this.course);
    },
    openCategoryModal() {
      this.$refs.categoryModal.openModal();
    },
    async updateCategories(category) {
      console.log(category.data, "category data");
      await this.getCategories();
      this.course.categories.push(category.data.id);
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
