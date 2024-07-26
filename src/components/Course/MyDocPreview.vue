<template>
  <div @contextmenu.prevent>
    <iframe
      v-if="viewerUrl"
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
  name: "VueDocPreview",
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      objectUrl: null,
    };
  },
  computed: {
    viewerUrl() {
      if (this.objectUrl) {
        return `/pdfjs-4.4.168-dist/web/viewer.html?file=${encodeURIComponent(
          this.objectUrl
        )}&zoom=150&toolbar=0&navpanes=0`;
      }
      return null;
    },
  },
  async created() {
    await this.loadPdf();
  },
  beforeDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  },
  methods: {
    async loadPdf() {
      try {
        const response = await fetch(this.pdfUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const blob = await response.blob();
        this.objectUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error("Failed to load PDF:", error);
      }
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
