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
      <div class="container">
        <div class="columns content">
          <div class="column is-2">
            <h2 class="title is-4">Table of Contents</h2>
            <p>Modules</p>
            <div
              class="navbar-item has-dropdown"
              v-for="module in modules"
              v-bind:key="module.id"
              :class="{
                'is-active': activeModule && activeModule.id === module.id,
              }"
              @click="toggleActiveModule(module)"
            >
              <a class="navbar-link"
                ><i v-if="module.is_open" class="fas fa-lock-open icon-spaced"></i>
                <i v-else class="fas fa-lock icon-spaced"></i>
                {{ module.title }}
              </a>

              <div class="navbar-dropdown">
                <a class="navbar-item" v-for="lesson in lessons" v-bind:key="lesson.id">
                  {{ lesson.title }}
                </a>
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

export default {
  data() {
    return {
      modules: [],
      lessons: [],
      activeModule: null,
    };
  },
  async mounted() {
    this.getModules();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async getModules() {
      const slug = this.$router.currentRoute.value.params.slug;
      await axios.get(`courses/${slug}/modules/`).then((response) => {
        if (response.status === 200) {
          this.modules = response.data.data;
        }
      });
    },
    async getModuleLessons(module) {
      const slug = this.$router.currentRoute.value.params.slug;
      await axios
        .get(`courses/${slug}/modules/${module.slug}/lessons/`)
        .then((response) => {
          if (response.status === 200) {
            this.lessons = response.data.data;
          }
        });
    },
    setActiveModule(module) {
      this.getModuleLessons(module);
      this.activeModule = module;
    },
    async toggleActiveModule(module) {
      if (this.activeModule && this.activeModule.id === module.id) {
        this.activeModule = null; // Toggle off
      } else {
        await this.getModuleLessons(module);
        this.activeModule = module; // Toggle on
      }
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
.navbar-item.has-dropdown {
  position: relative;
  cursor: pointer;
}
.navbar-dropdown {
  display: none;
  position: relative;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 10px; /* Ensure there's space between the dropdown and its parent */
}
.navbar-item.has-dropdown.is-active .navbar-dropdown {
  display: block;
}
</style>
