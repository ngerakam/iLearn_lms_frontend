<template>
  <div v-if="quiz && course" class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="is-size-5">{{ quiz.title }}</p>
        </div>
      </div>

      <div class="content">
        <div class="columns"></div>
        <p>
          {{ quiz.description }}
        </p>
        <router-link
          class="button is-success"
          :to="{
            name: 'TakeQuiz',
            params: { slug: course.slug, quizSlug: quiz.slug },
          }"
        >
          <i class="fas fa-play icon-spaced"></i>
          Start</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quiz: {
      type: Object,
      required: true,
      validator: function (value) {
        return value.slug !== undefined;
      },
    },
    course: {
      type: Object,
      required: true,
      validator: function (value) {
        return value.slug !== undefined;
      },
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
