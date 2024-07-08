<template>
  <div class="create-course">
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
      <div class="has-text-centered mb-2">
        <h1 class="title is-4">Create Module</h1>
      </div>
    </div>

    <div class="columns">
      <div class="column"></div>
      <div class="column is-10">
        <section class="section">
          <div class="px-6 py-4 has-background-white-ter">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Title"
                  v-model="form.title"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <textarea
                  class="textarea"
                  placeholder="Short description"
                  v-model="form.description"
                ></textarea>
              </div>
            </div>
            <div class="field">
              <ToggleButton
                title="Module State"
                :isChecked="form.is_open"
                @toggle-change="form.is_open = $event"
              />
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-link" @click="submitForm">
                  <i class="fa fa-check icon-spaced"></i>
                  Publish
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ToggleButton from "@/components/Utils/ToggleButton.vue";

export default {
  data() {
    return {
      form: {
        title: "",
        description: "",
        is_open: false,
      },
    };
  },
  components: {
    ToggleButton,
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async submitForm() {
      console.log(this.form);
      const slug = this.$router.currentRoute.value.params.slug;

      await axios
        .post(`courses/${slug}/modules/`, this.form)
        .then((response) => {
          if (response.status === 201) {
            const slug = this.$router.currentRoute.value.params.slug;
            const moduleSlug = response.data.data.slug;
            this.$router.push({
              name: "LessonCreateDetails",
              params: { slug: slug, moduleSlug: moduleSlug },
            });
          }
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
