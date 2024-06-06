<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-html="docxContent" v-if="docxContent && !isLoading"></div>
    <div id="pptContainer" v-if="pptContent && !isLoading"></div>
  </div>
</template>

<script>
import mammoth from "mammoth";
import PptxGenJS from "pptxgenjs";

export default {
  props: {
    fileUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      docxContent: "",
      pptContent: null,
      isLoading: false,
      error: "",
    };
  },
  watch: {
    fileUrl: "processFile",
  },
  mounted() {
    this.processFile();
  },
  methods: {
    async processFile() {
      this.docxContent = "";
      this.pptContent = null;
      this.isLoading = true;
      this.error = "";

      const fileType = this.getFileType(this.fileUrl);
      try {
        if (fileType === "docx") {
          await this.fetchAndRenderDocx(this.fileUrl);
        } else if (fileType === "pptx") {
          await this.fetchAndRenderPpt(this.fileUrl);
        } else {
          this.error = "Unsupported file type";
        }
      } catch (error) {
        this.error = "Error processing file";
        console.error("Error processing file:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAndRenderDocx(url) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        this.docxContent = result.value;
      } catch (error) {
        this.error = "Error rendering DOCX file";
        console.error("Error rendering DOCX file:", error);
      }
    },
    async fetchAndRenderPpt(url) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        // Initialize PptxGenJS instance
        const ppt = new PptxGenJS();
        ppt.addSlide();

        // Check if the `load` method is available
        if (typeof ppt.load !== "function") {
          throw new Error("PptxGenJS: load method is not available.");
        }

        // Load PPTX content
        ppt.addSlide(); // Add a slide to initialize pptx object
        ppt.load(arrayBuffer); // Load PPTX content

        const container = document.getElementById("pptContainer");
        ppt.renderToHtml(container); // Render PPTX content to HTML
      } catch (error) {
        this.error = "Error rendering PPT file: " + error.message;
        console.error("Error rendering PPT file:", error);
      }
    },

    getFileType(fileUrl) {
      return fileUrl.split(".").pop().toLowerCase();
    },
  },
};
</script>

<style scoped>
#pptContainer {
  margin-top: 20px;
}
</style>
