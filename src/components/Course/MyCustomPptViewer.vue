<template>
  <div class="pptx-viewer-container">
    <iframe
      v-if="!error"
      ref="pptxFrame"
      :src="viewerUrl"
      width="100%"
      height="600px"
      frameborder="0"
      @load="handleIframeLoad"
      @error="handleIframeError"
    ></iframe>
    <div v-else class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";

export default defineComponent({
  name: "MyCustomPptViewer",
  props: {
    fileUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const pptxFrame = ref(null);
    const viewerUrl = ref("");
    const error = ref(null);

    const updateViewerUrl = () => {
      viewerUrl.value = `/pptx-viewer.html?file=${encodeURIComponent(props.fileUrl)}`;
      error.value = null; // Reset error when URL changes
    };

    const handleIframeLoad = () => {
      // Check if the iframe content loaded successfully
      try {
        const iframeDocument =
          pptxFrame.value.contentDocument || pptxFrame.value.contentWindow.document;
        if (iframeDocument.body.innerHTML === "") {
          error.value = "Failed to load PPTX file. Please check the file and try again.";
        }
      } catch (e) {
        error.value =
          "Error accessing iframe content. This might be due to cross-origin restrictions.";
      }
    };

    const handleIframeError = () => {
      error.value =
        "Failed to load PPTX viewer. Please check your internet connection and try again.";
    };

    watch(() => props.fileUrl, updateViewerUrl, { immediate: true });

    onMounted(() => {
      updateViewerUrl();
    });

    return {
      pptxFrame,
      viewerUrl,
      error,
      handleIframeLoad,
      handleIframeError,
    };
  },
});
</script>

<style scoped>
.pptx-viewer-container {
  width: 100%;
  height: 600px; /* Adjust as needed */
}

.pptx-viewer-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.error-message {
  color: red;
  padding: 20px;
  border: 1px solid red;
  background-color: #ffeeee;
}
</style>
