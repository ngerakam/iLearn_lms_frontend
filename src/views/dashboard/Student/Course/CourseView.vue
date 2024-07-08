<template>
  <div class="courses">
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
      <div class="has-text-centered">
        <h1 class="title">{{ course?.title }}</h1>

        <router-link
          :to="{ name: 'Author', params: { id: course?.created_by?.id } }"
          class="subtitle mb-3"
        >
          By:
          {{ course?.created_by?.first_name + " " + course?.created_by?.last_name }}
        </router-link>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns content">
          <div class="column is-2">
            <h2 class="title is-4">Table of Contents</h2>
            <p>Modules</p>
            <ul class="menu-list no-style">
              <li v-for="module in modules" v-bind:key="module.id">
                <a :disabled="enrollmentValue === null">
                  <div v-if="!$store.state.user.isAuthenticated">
                    <i class="fas fa-lock"></i>
                    {{ module.title }}
                  </div>
                  <div v-else>
                    <i v-if="module.is_open" class="fas fa-lock-open"></i>
                    <i v-else class="fas fa-lock"></i>
                    {{ module.title }}
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div class="column is-10">
            <template v-if="$store.state.user.isAuthenticated">
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <div class="field ml-auto mb-2" v-if="enrollmentValue === null">
                    <div class="control">
                      <button class="button is-primary" @click="submitEnrollment">
                        Enroll
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <!-- Start Learning Button -->
                    <div v-if="startedValue === 'started'" class="column is-12">
                      <button class="button is-primary" @click="startLearning">
                        Start Learning
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {{ course.long_description }}
            </template>
            <template v-else>
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <div class="field ml-auto mb-2">
                    <div class="control">
                      <button
                        v-if="enrollmentValue === null"
                        class="button is-primary"
                        @click="submitEnrollment"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h2>Access Restricted</h2>
              <p>You are required to login so as to access this course.</p>
              <p>
                If you do not have an account kindly reach out to site admin ({{
                  siteSetup?.addresses?.email_contact
                }}) : for an account!
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      course: {
        created_by: {
          id: 0,
        },
      },
      modules: [],
      courseActivity: null,
      enrollmentValue: null,
      startedValue: null,
    };
  },
  computed: {
    ...mapState({
      siteSetup: (state) => state.siteSetup.siteSetup,
    }),
  },
  async mounted() {
    this.isCourseStarted();
    this.verifyEnrollment();

    const slug = this.$router.currentRoute.value.params.slug;

    await axios.get(`courses/${slug}/no-auth`).then((response) => {
      // console.log(response.data);
      this.course = response.data.data;
    });
    await axios.get(`courses/${slug}/modules`).then((response) => {
      // console.log(response.data);
      this.modules = response.data.data;
    });
    document.title = this.course.title + " | iLearn";
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    verifyEnrollment() {
      const slug = this.$router.currentRoute.value.params.slug;
      axios
        .get(`courses/${slug}/enrollments/`)
        .then((response) => {
          if (response.status === 200) {
            this.enrollmentValue = response.data.data.status;
          }
        })
        .catch((error) => {
          console.error("Error verifying enrollment:", error);
        });
    },
    submitEnrollment() {
      if (!this.$store.state.user.isAuthenticated) {
        this.$router.push("/log-in");
      }
      const slug = this.$router.currentRoute.value.params.slug;
      // console.log("Enroll button clicked");
      axios.post(`courses/${slug}/enrollments/`).then((response) => {
        // console.log(response.data);
        this.enrollmentValue = "enrolled";
      });
    },
    isCourseStarted() {
      const slug = this.$router.currentRoute.value.params.slug;
      axios
        .get(`activities/courses/${slug}/`)
        .then((response) => {
          if (response.status === 200) {
            this.startedValue = response.data.data.status;
          }
        })
        .catch((error) => {
          console.error("Error verifying course started:", error);
        });
    },
    startLearning() {
      this.$router.push({
        name: "ModuleView",
        params: { slug: this.course.slug },
      });
    },
  },
};
</script>
<!--  -->
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
.no-style {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.no-style li {
  margin: 0;
  padding: 0;
}

.no-style a {
  text-decoration: none;
}
</style>
