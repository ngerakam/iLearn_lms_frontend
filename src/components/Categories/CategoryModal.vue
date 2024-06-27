<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card custom-modal-width">
      <header class="modal-card-head">
        <p class="modal-card-title">Create Category</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <CreateCategory @category-added="handleCategoryAdded" />
      </section>
    </div>
  </div>
</template>

<script>
import CreateCategory from "./CreateCategory.vue";

export default {
  components: {
    CreateCategory,
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
    handleCategoryAdded(category) {
      console.log("Category added:", category);
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
