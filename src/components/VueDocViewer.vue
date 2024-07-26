<template>
  <div ref="docViewerContainer"></div>
</template>

<script>
import { defineComponent, onMounted, watch, ref } from "vue";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default defineComponent({
  name: "VueDocViewer",
  props: {
    fileUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const docViewerContainer = ref(null);
    let root = null;

    const renderDocViewer = () => {
      if (docViewerContainer.value && props.fileUrl) {
        const documents = [{ uri: props.fileUrl }];
        root.render(
          createElement(DocViewer, {
            documents: documents,
            pluginRenderers: DocViewerRenderers,
            style: { height: "100%", width: "100%" },
          })
        );
      }
    };

    onMounted(() => {
      root = createRoot(docViewerContainer.value);
      renderDocViewer();
    });

    watch(() => props.fileUrl, renderDocViewer);

    return {
      docViewerContainer,
    };
  },
});
</script>

<style scoped>
div {
  width: 100%;
  height: 600px; /* Adjust as needed */
}
</style>
