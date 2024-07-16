<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card custom-modal-width">
      <header class="modal-card-head">
        <p class="modal-card-title">Create Learning Path</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <CreateLearningPath @learning-path-added="handleLearningPathAdded" />
      </section>
    </div>
  </div>
</template>

<script>
import CreateLearningPath from "./CreateLearningPath.vue";

export default {
  components: {
    CreateLearningPath,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleLearningPathAdded(learning_path) {
      this.$emit("learning-path-added", learning_path);
      console.log("Learning Path added:", learning_path);
      this.closeModal();
    },
  },
};
</script>
<style scoped>
.custom-modal-width {
  max-width: 960px;
  width: 100%;
}
</style>
