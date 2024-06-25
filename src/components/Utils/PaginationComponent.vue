<!-- src/components/Utils/PaginationComponent.vue -->
<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a class="pagination-previous" @click="changePage(currentPage - 1)">
      Previous
    </a>
    <a class="pagination-next" @click="changePage(currentPage + 1)"> Next </a>
    <ul class="pagination-list">
      <li v-for="page in totalPages" :key="page">
        <a
          class="pagination-link"
          :class="{ 'is-current': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 4,
    },
    initialPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      currentPage: this.initialPage,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.$emit("page-changed", this.currentPage);
      }
    },
  },
  watch: {
    initialPage(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>

<style scoped>
.pagination-link.is-current {
  background-color: #3273dc;
  color: white;
}
</style>
