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
            <LessonViewT :lesson="currentLesson" />
            <div v-if="!isLastLesson || !isLastModule" class="mt-3">
              <nav class="pagination">
                <a class="pagination-previous" @click="handlePreviousLesson">
                  Previous
                </a>
                <a class="pagination-next" @click="handleNextLesson"> Next </a>
              </nav>
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
import LessonViewT from "@/views/dashboard/Teacher/ViewCourse/Lesson/LessonViewT.vue";

export default {
  components: {
    CustomModuleDropdown,
    LessonViewT,
  },
  data() {
    return {
      modules: [],
      lessons: [],
      currentLesson: null,
      currentModule: null,
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
    await this.initializeModuleAndLesson();
  },
  methods: {
    goBack() {
      this.$router.back();
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
      if (this.modules.length > 0) {
        await this.handleChoosenModule(this.modules[0]);
        if (this.lessons.length > 0) {
          await this.handleChoosenLesson({
            lesson: this.lessons[0],
            module: this.modules[0],
          });
        }
      }
    },
    async handleChoosenModule(module) {
      this.currentModule = module;
      await this.fetchLessons(module);
    },
    async handleChoosenLesson({ lesson, module }) {
      this.currentLesson = lesson;
      this.currentModule = module;
    },
    async handleNextLesson() {
      const currentLessonIndex = this.lessons.findIndex(
        (lesson) => lesson.id === this.currentLesson.id
      );
      if (currentLessonIndex < this.lessons.length - 1) {
        await this.handleChoosenLesson({
          lesson: this.lessons[currentLessonIndex + 1],
          module: this.currentModule,
        });
      } else if (!this.isLastModule) {
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
  },
};
</script>

<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
