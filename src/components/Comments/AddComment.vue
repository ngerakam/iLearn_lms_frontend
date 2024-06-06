<template>
  <form v-on:submit.prevent="submitComment()">
    <div class="field">
      <label for="">Name</label>
      <div class="control">
        <input type="text" class="input" v-model="comment.name" />
      </div>
    </div>
    <div class="field">
      <label for="">Content</label>
      <div class="control">
        <textarea class="textarea" v-model="comment.content"> </textarea>
      </div>
    </div>
    <div
      class="notification is-danger"
      v-for="error in errors"
      v-bind:key="error"
    >
      <button class="delete" @click="removeNotif()"></button>
      {{ error }}
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-link">submit</button>
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";

export default {
  props: ["course", "activeLesson"],
  data() {
    return {
      comment: {
        name: "",
        content: "",
      },
      errors: [],
    };
  },
  methods: {
    removeNotif() {
      this.errors = [];
    },
    submitComment() {
      console.log("submitComment");

      this.errors = [];

      if (this.comment.name === "") {
        this.errors.push("The name must be filled out");
      }

      if (this.comment.content === "") {
        this.errors.push("Kindly add the comment!");
      }

      if (!this.errors.length) {
        axios
          .post(
            `courses/${this.$router.currentRoute.value.params.slug}/${this.activeLesson.slug}/`,
            this.comment
          )
          .then((response) => {
            this.comment.name = "";
            this.comment.content = "";

            this.$emit("submitComment", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
