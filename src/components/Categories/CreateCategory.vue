<template>
  <div class="create-category">
    <div class="columns">
      <div class="column is-12">
        <div class="notification is-danger mt-3 mb-3" v-if="form?.errors?.length">
          <button class="delete" @click="removeNotif()"></button>
          <p v-for="error in form.errors" v-bind:key="error">{{ error }}</p>
        </div>
        <section class="section">
          <div class="px-3 py-3 has-background-white-ter">
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
              <div class="field">
                <label class="label">Short description</label>
                <div class="control">
                  <textarea
                    class="textarea"
                    placeholder="Short description"
                    v-model="form.short_description"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-link" @click="submitForm">
                  <i class="fa fa-check icon-spaced"></i>
                  Save
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

export default {
  data() {
    return {
      form: {
        title: "",
        short_description: "",
        errors: [],
      },
    };
  },

  methods: {
    removeNotif() {
      this.form.errors = [];
    },
    async submitForm() {
      if (this.form.title === "") {
        this.form.errors.push("The title is missing!");
      }
      if (this.form.short_description === "") {
        this.form.errors.push("The short description is missing!");
      }
      try {
        const response = await axios.post("courses/categories/", this.form);
        const newCategory = response.data;
        this.$emit("category-added", newCategory);
        this.clearForm();
      } catch (error) {
        console.error("Error creating category:", error);
      }
    },
    clearForm() {
      this.form.title = "";
      this.form.short_description = "";
    },
  },
};
</script>
<style scoped>
.icon-spaced {
  margin-right: 8px;
}
</style>
