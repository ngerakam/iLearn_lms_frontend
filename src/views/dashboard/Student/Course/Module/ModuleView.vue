<template>
  <div class="modules">
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
    </div>
    <section class="section">
      <div class="container is-fullhd">
        <div class="columns content">
          <div class="column is-2">
            <h2 class="title is-4">Table of Contents</h2>
            <p>Modules</p>
            <CustomModuleDropdown
              v-for="module in modules"
              :key="module.id"
              :module="module"
              :isActiveModule="currentModule && currentModule.id === module.id"
              @click="handleChoosenModule(module)"
              @clicked-lesson="handleChoosenLesson"
            />
          </div>
          <div class="column is-10">
            <LessonViewVue
              :lesson="currentLesson"
              :lessonActivity="currentLessonActivity"
            />
            <div v-if="!isLastLesson || !isLastModule" class="mt-3">
              <nav class="pagination">
                <a class="pagination-previous" @click="handlePreviousLesson">
                  Previous
                </a>
                <a class="pagination-next" @click="handleNextLesson"> Next </a>
              </nav>
            </div>
            <div>
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <div v-if="isLastLesson && isLastModule" class="column is-12 mt-5">
                    <template v-if="courseActivity?.status === 'done'">
                      <span class="tag is-success">Completed</span>
                    </template>
                    <template v-else>
                      <button class="button is-primary" @click="finishCourse">
                        Finish Course
                      </button>
                    </template>
                  </div>
                </div>
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
import CustomModuleDropdown from "@/components/Utils/CustomModuleDropdown.vue";
import LessonViewVue from "../Lesson/LessonView.vue";

export default {
  components: {
    CustomModuleDropdown,
    LessonViewVue,
  },
  data() {
    return {
      modules: [],
      lessons: [],
      currentLesson: null,
      currentModule: null,
      activityModule: null,
      courseActivity: null,
      currentLessonActivity: null,
    };
  },
  computed: {
    isLastLesson() {
      if (!this.lessons || this.lessons.length === 0) return true;
      const lastIndex = this.lessons.length - 1;
      return this.currentLesson?.id === this.lessons[lastIndex].id;
    },
    isFirstLesson() {
      if (!this.lessons || this.lessons.length === 0) return true;
      return this.currentLesson?.id === this.lessons[0].id;
    },
    isLastModule() {
      if (!this.modules || this.modules.length === 0) return true;
      const lastIndex = this.modules.length - 1;
      return this.currentModule?.id === this.modules[lastIndex].id;
    },
    isFirstModule() {
      if (!this.modules || this.modules.length === 0) return true;
      return this.currentModule?.id === this.modules[0].id;
    },
  },
  async mounted() {
    await this.getModules();
    await this.fetchCourseActivity();
    await this.initializeModuleAndLesson();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchCourseActivity() {
      const slug = this.$router.currentRoute.value.params.slug;
      try {
        const response = await axios.get(`activities/courses/${slug}/`);
        if (response.status === 200) {
          this.courseActivity = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching course activity:", error);
      }
    },
    async fetchModuleActivity(moduleSlug) {
      try {
        const response = await axios.get(`activities/modules/${moduleSlug}/`);
        this.activityModule = response.data.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const postResponse = await axios.post(`activities/modules/${moduleSlug}/`);
            this.activityModule = postResponse.data.data;
          } catch (postError) {
            console.error("Error creating module activity:", postError);
          }
        } else {
          console.error("Error fetching module activity:", error);
        }
      }
    },
    async getModules() {
      const slug = this.$route.params.slug;
      const response = await axios.get(`courses/${slug}/modules/`);
      if (response.status === 200) {
        this.modules = response.data.data;
      }
    },
    async fetchLessons(module) {
      const slug = this.$route.params.slug;
      const response = await axios.get(`courses/${slug}/modules/${module.slug}/lessons/`);
      if (response.status === 200) {
        this.lessons = response.data.data;
      }
    },
    async initializeModuleAndLesson() {
      if (this.courseActivity && this.courseActivity.status !== "done") {
        for (const module of this.modules) {
          await this.fetchModuleActivity(module.slug);
          if (this.activityModule.status !== "done") {
            await this.handleChoosenModule(module);
            for (const lesson of this.lessons) {
              const lessonActivity = await this.fetchLessonActivity(lesson.slug);
              if (lessonActivity?.status !== "done") {
                await this.handleChoosenLesson({ lesson, module });
                return;
              }
            }
            return;
          }
        }
      } else {
        if (this.modules.length > 0) {
          await this.handleChoosenModule(this.modules[0]);
          if (this.lessons.length > 0) {
            await this.handleChoosenLesson({
              lesson: this.lessons[0],
              module: this.modules[0],
            });
          }
        }
      }
    },
    async handleChoosenModule(module) {
      this.currentModule = module;
      await this.fetchLessons(module);
      await this.fetchModuleActivity(module.slug);
    },
    async handleChoosenLesson({ lesson, module }) {
      this.currentLesson = lesson;
      this.currentModule = module;
      await this.fetchLessonActivity(lesson.slug);
    },
    async fetchLessonActivity(lessonSlug) {
      try {
        const response = await axios.get(`activities/lessons/${lessonSlug}/`);
        this.currentLessonActivity = response.data.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const postResponse = await axios.post(`activities/lessons/${lessonSlug}/`);
            this.currentLessonActivity = postResponse.data.data;
          } catch (postError) {
            console.error("Error creating lesson activity:", postError);
          }
        } else {
          console.error("Error fetching lesson activity:", error);
        }
      }
    },
    async handleNextLesson() {
      const currentLessonIndex = this.lessons.findIndex(
        (lesson) => lesson.id === this.currentLesson.id
      );
      if (currentLessonIndex < this.lessons.length - 1) {
        await this.updateLessonActivity(this.currentLesson.slug);
        await this.handleChoosenLesson({
          lesson: this.lessons[currentLessonIndex + 1],
          module: this.currentModule,
        });
      } else if (!this.isLastModule) {
        await this.updateModuleActivity(this.currentModule.slug);
        const currentModuleIndex = this.modules.findIndex(
          (module) => module.id === this.currentModule.id
        );
        await this.handleChoosenModule(this.modules[currentModuleIndex + 1]);
        await this.handleChoosenLesson({
          lesson: this.lessons[0],
          module: this.modules[currentModuleIndex + 1],
        });
      }
    },
    async handlePreviousLesson() {
      const currentLessonIndex = this.lessons.findIndex(
        (lesson) => lesson.id === this.currentLesson.id
      );
      if (currentLessonIndex > 0) {
        await this.handleChoosenLesson({
          lesson: this.lessons[currentLessonIndex - 1],
          module: this.currentModule,
        });
      } else if (!this.isFirstModule) {
        const currentModuleIndex = this.modules.findIndex(
          (module) => module.id === this.currentModule.id
        );
        await this.handleChoosenModule(this.modules[currentModuleIndex - 1]);
        await this.handleChoosenLesson({
          lesson: this.lessons[this.lessons.length - 1],
          module: this.modules[currentModuleIndex - 1],
        });
      }
    },
    async updateLessonActivity(lessonSlug) {
      try {
        const response = await axios.put(`activities/lessons/${lessonSlug}/`, {
          status: "done",
        });
        if (response.status === 200) {
          console.log("Lesson activity updated successfully.");
        }
      } catch (error) {
        console.error("Error updating lesson activity:", error);
      }
    },
    async updateModuleActivity(moduleSlug) {
      try {
        const response = await axios.put(`activities/modules/${moduleSlug}/`, {
          status: "done",
        });
        if (response.status === 200) {
          console.log("Module activity updated successfully.");
        }
      } catch (error) {
        console.error("Error updating module activity:", error);
      }
    },
    async finishCourse() {
      const slug = this.$router.currentRoute.value.params.slug;
      try {
        const response = await axios.put(`activities/courses/${slug}/`, {
          status: "done",
        });
        if (response.status === 200) {
          console.log("Module activity updated successfully.", response.data.data);
        }
      } catch (error) {
        console.error("Error updating Course activity:", error);
      }
    },
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
