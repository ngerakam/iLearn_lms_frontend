<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="course.get_image" alt="placeholder-image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="is-size-5">{{ course.title }}</p>
        </div>
      </div>

      <div class="content">
        <div class="columns">
          <div class="column">
            <span class="tag is-text" v-if="course.status == 'draft'"> Draft </span>
            <span class="tag is-link" v-if="course.status == 'published'">
              Published
            </span>
            <span class="tag is-warning" v-if="course.status == 'in_review'">
              In Review
            </span>
          </div>
        </div>
        <p>
          {{ course.short_description }}
        </p>
        <router-link
          class="button is-success"
          :to="{ name: 'CourseEditPage', params: { slug: course.slug } }"
          >Edit</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["course"],
};
</script>
