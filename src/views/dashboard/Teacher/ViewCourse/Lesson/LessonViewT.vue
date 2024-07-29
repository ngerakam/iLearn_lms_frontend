<template>
  <div>
    <div class="columns">
      <div class="column">
        <h2>{{ lesson?.title }}</h2>
      </div>
      <div class="column"></div>
      <div class="column">
        <!-- Removed student activity status -->
      </div>
    </div>

    <hr />
    <div v-if="lesson?.long_description">
      <article class="message">
        <div class="message-body">
          {{ lesson?.long_description }}
        </div>
      </article>

      <hr />
    </div>

    <template v-if="lesson?.lesson_type === 'quiz'">
      <p>Quiz</p>
      <!-- Quiz component remains unchanged -->
    </template>

    <template v-if="lesson?.lesson_type === 'video'">
      <article class="message">
        <div class="message-body">
          {{ lesson?.short_description }}
        </div>
      </article>
      <div v-if="lesson?.youtube_id !== null">
        <Video v-bind:youtube_id="lesson?.youtube_id" />
      </div>
      <div v-else>
        <MyCustomVideo
          v-bind:videoUrl="lesson?.get_video"
          v-bind:videoType="getVideoType(lesson?.get_video)"
        />
      </div>
    </template>

    <template v-if="lesson?.lesson_type === 'article'">
      <!-- Removed ability to add comments -->
      <CourseComment
        v-for="comment in comments"
        v-bind:key="comment.id"
        v-bind:comment="comment"
      />
    </template>

    <template v-if="lesson?.lesson_type === 'file'">
      <div v-if="['docx'].includes(getFileType(lesson?.get_file))">
        <MyCustomDoc :fileUrl="lesson?.get_file" />
      </div>
      <div v-if="getFileType(lesson?.get_file) === 'pptx'">
        <MyCustomPptViewer :fileUrl="lesson?.get_file" />
      </div>
      <div v-if="getFileType(lesson?.get_file) === 'pdf'">
        <MyDocPreview :pdfUrl="lesson?.get_file" />
      </div>
    </template>
  </div>
</template>

<script>
import CourseComment from "@/components/Comments/CourseComment";
import Quiz from "@/components/Quiz/Quiz";
import Video from "@/components/Course/Video";
import MyDocPreview from "@/components/Course/MyDocPreview";
import MyCustomVideo from "@/components/Course/MyCustomVideo";
import MyCustomDoc from "@/components/Course/MyCustomDoc";
import MyCustomPptViewer from "@/components/Course/MyCustomPptViewer";
import "video.js/dist/video-js.css";

export default {
  props: {
    lesson: {
      type: Object,
      required: true,
    },
    // Removed lessonActivity prop
  },
  data() {
    return {
      comments: [],
    };
  },
  components: {
    CourseComment,
    Quiz,
    Video,
    MyDocPreview,
    MyCustomVideo,
    MyCustomDoc,
    MyCustomPptViewer,
  },
  methods: {
    getFileType(FileUrl) {
      if (!FileUrl) return "";
      const FileType = FileUrl.split(".").pop();
      return FileType.toLowerCase();
    },
    getVideoType(videoUrl) {
      if (!videoUrl) return "";
      const videoType = videoUrl.split(".").pop();
      return videoType.toLowerCase();
    },
    // Removed submitComment method
  },
};
</script>
