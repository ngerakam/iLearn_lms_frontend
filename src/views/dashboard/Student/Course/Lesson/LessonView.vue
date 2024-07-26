<template>
  <div>
    <div class="columns">
      <div class="column">
        <h2>{{ lesson?.title }}</h2>
      </div>
      <div class="column"></div>
      <div class="column">
        <span class="tag is-warning" v-if="lessonActivity?.status == 'started'">
          Started (mark as done)
        </span>
        <span class="tag is-success" v-else-if="lessonActivity?.status == 'done'">
          Done
        </span>
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
        custom video component
        <MyCustomVideo
          v-bind:videoUrl="lesson?.get_video"
          v-bind:videoType="getVideoType(lesson?.get_video)"
        />
      </div>
    </template>

    <template v-if="lesson?.lesson_type === 'article'">
      <p>Add a Comment</p>
      <CourseComment
        v-for="comment in comments"
        v-bind:key="comment.id"
        v-bind:comment="comment"
      />

      <AddComment v-bind:lesson="lesson" v-on:submitComment="submitComment" />
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
import AddComment from "@/components/Comments/AddComment";
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
    lessonActivity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
    };
  },
  components: {
    CourseComment,
    AddComment,
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
    submitComment(comment) {
      console.log("Submitting comment:", comment);
      // Implement your comment submission logic here
    },
  },
};
</script>
