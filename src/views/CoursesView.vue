<template>
  <div class="courses">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <h1 class="title">Courses</h1>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-2">
            <aside class="menu">
              <p class="menu-label">Categories</p>
              <ul class="menu-list">
                <li>
                  <a
                    v-bind:class="{ 'is-active': !activeCategory }"
                    @click="setActiveCategory(null)"
                  >
                    All courses
                  </a>
                </li>
                <li
                  v-for="category in categories"
                  v-bind:key="category.id"
                  @click="setActiveCategory(category)"
                >
                  <a>{{ category.title }}</a>
                </li>
              </ul>
            </aside>
          </div>
          <div class="column is-10">
            <div class="columns is-multiline">
              <div
                class="column is-4"
                v-for="course in paginatedCourses"
                v-bind:key="course.id"
              >
                <CourseItem :course="course" />
              </div>
              <div class="column is-12">
                <PaginationComponent
                  :totalItems="totalCourses"
                  :itemsPerPage="itemsPerPage"
                  :initialPage="currentPage"
                  @page-changed="handlePageChanged"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import CourseItem from "@/components/Course/CourseItem";
import PaginationComponent from "@/components/Utils/PaginationComponent";

export default {
  data() {
    return {
      courses: [],
      categories: [],
      activeCategory: null,
      totalCourses: 0,
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  components: {
    CourseItem,
    PaginationComponent,
  },
  async mounted() {
    console.log("mounted");

    await axios.get("courses/get_categories/").then((response) => {
      console.log(response.data);

      this.categories = response.data;
    });

    this.getCourses();

    document.title = "Courses | iLearn";
  },
  computed: {
    paginatedCourses() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.courses.slice(start, end);
    },
  },
  methods: {
    setActiveCategory(category) {
      this.activeCategory = category;
      this.currentPage = 1;
      this.getCourses();
    },
    getCourses() {
      let url = "courses/";

      if (this.activeCategory) {
        url += "?category_id=" + this.activeCategory.id;
      }

      axios.get(url).then((response) => {
        console.log(response.data);

        this.courses = response.data;
        this.totalCourses = response.data.length;
      });
    },
    handlePageChanged(page) {
      this.currentPage = page;
    },
  },
};
</script>
