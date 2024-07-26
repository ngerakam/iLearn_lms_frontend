<template>
  <div>
    <h2>Document Viewer Troubleshooter</h2>
    <div>
      <h3>File Information:</h3>
      <p>URL: {{ fileUrl }}</p>
      <p>File type: {{ fileType }}</p>
    </div>
    <div>
      <h3>Accessibility Check:</h3>
      <button @click="checkFileAccessibility">Check File Accessibility</button>
      <p v-if="accessibilityResult">{{ accessibilityResult }}</p>
    </div>
    <div>
      <h3>CORS Check:</h3>
      <button @click="checkCORS">Check CORS</button>
      <p v-if="corsResult">{{ corsResult }}</p>
    </div>
    <div>
      <h3>File Content:</h3>
      <button @click="fetchFileContent">Fetch File Content</button>
      <pre v-if="fileContent">{{ fileContent }}</pre>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DocViewerTroubleshooter",
  props: {
    fileUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const accessibilityResult = ref("");
    const corsResult = ref("");
    const fileContent = ref("");
    const fileType = ref("");

    const checkFileAccessibility = async () => {
      try {
        const response = await fetch(props.fileUrl, { method: "HEAD" });
        if (response.ok) {
          accessibilityResult.value = "File is accessible";
          fileType.value = response.headers.get("Content-Type") || "Unknown";
        } else {
          accessibilityResult.value = `File is not accessible. Status: ${response.status}`;
        }
      } catch (error) {
        accessibilityResult.value = `Error checking file: ${error.message}`;
      }
    };

    const checkCORS = async () => {
      try {
        const response = await fetch(props.fileUrl);
        corsResult.value = "CORS is properly configured";
      } catch (error) {
        corsResult.value = `CORS error: ${error.message}`;
      }
    };

    const fetchFileContent = async () => {
      try {
        const response = await fetch(props.fileUrl);
        const content = await response.text();
        fileContent.value = content.substring(0, 1000) + "..."; // Show first 1000 characters
      } catch (error) {
        fileContent.value = `Error fetching file content: ${error.message}`;
      }
    };

    return {
      accessibilityResult,
      corsResult,
      fileContent,
      fileType,
      checkFileAccessibility,
      checkCORS,
      fetchFileContent,
    };
  },
});
</script>
