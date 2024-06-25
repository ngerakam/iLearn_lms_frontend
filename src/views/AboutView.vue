<template>
  <div class="about">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <div v-if="siteSetup.title === ''">
          <h1 class="title">About iLearn LMS</h1>
        </div>
        <div v-else>
          <h1 class="title">About {{ siteSetup.title }}</h1>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <p>{{ siteSetup?.abouts?.about_message }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  mounted() {
    document.title = "About | iLearn";
  },
  computed: {
    ...mapState({
      siteSetup: (state) => state.siteSetup.siteSetup,
    }),
  },
};
</script>
