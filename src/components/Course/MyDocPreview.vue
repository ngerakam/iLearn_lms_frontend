<template>
  <div @contextmenu.prevent>
    <iframe
      v-if="pdfUrl"
      :src="viewerUrl"
      width="600"
      height="500"
      allowfullscreen
      webkitallowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "ViewerJS",
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  computed: {
    viewerUrl() {
      // The base URL of the ViewerJS library with the file to display
      return `${this.pdfUrl}`;
    },
  },
};
</script>

<style>
iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
