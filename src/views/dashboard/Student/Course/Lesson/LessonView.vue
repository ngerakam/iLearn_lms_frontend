<template>
  <div>
    <div class="notification is-success mt-3 mb-3" v-if="final_score == !null">
      <button class="delete" @click="removeNotif()"></button>
      Here is your final score: {{ final_score }}
    </div>
    <div class="columns">
      <div class="column">
        <h2>{{ activeLesson.title }}</h2>
      </div>
      <div class="column">
        <template v-if="activeLesson?.lesson_type === 'quiz'">
          Score: {{ totalScore }} / {{ numQuiz }}
        </template>
      </div>
      <div class="column">
        <span class="tag is-warning" v-if="activity.status == 'started'">
          Started (mark as done)
        </span>
        <span class="tag is-success" v-else> Done </span>
      </div>
    </div>

    <hr />
    <div v-if="activeLesson.long_description">
      <article class="message">
        <div class="message-body">
          {{ activeLesson.long_description }}
        </div>
      </article>

      <hr />
    </div>

    <template v-if="activeLesson.lesson_type === 'quiz'">
      <div v-if="quizList.length > 0">
        <div v-for="(quiz, index) in quizList" v-bind:key="index">
          <Quiz v-bind:quiz="quiz" @quiz-result="handleQuizResult(quiz, $event)" />
          <hr />
        </div>
        <div class="field ml-auto mb-2">
          <div class="control">
            <button class="button is-primary" @click="submitQuizResults">
              Submit Results
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- divider -->
    <template v-if="activeLesson.lesson_type === 'video'">
      <article class="message">
        <div class="message-body">
          {{ activeLesson.short_description }}
        </div>
      </article>
      <div v-if="activeLesson.youtube_id !== null">
        <Video v-bind:youtube_id="activeLesson.youtube_id" />
      </div>
      <div v-else>
        custom video component
        <MyCustomVideo
          v-bind:videoUrl="activeLesson.get_video"
          v-bind:videoType="getVideoType(activeLesson.get_video)"
        />
      </div>
    </template>
    <!-- divider -->
    <template v-if="activeLesson.lesson_type === 'article'">
      <p>Add a Comment</p>
      <CourseComment
        v-for="comment in comments"
        v-bind:key="comment.id"
        v-bind:comment="comment"
      />

      <AddComment
        v-bind:course="course"
        v-bind:activeLesson="activeLesson"
        v-on:submitComment="submitComment"
      />
    </template>
    <template v-if="activeLesson.lesson_type === 'file'">
      <div v-if="['docx'].includes(getFileType(activeLesson.get_file))">
        <MyCustomDoc :fileUrl="activeLesson.get_file" />
      </div>
      <div v-if="getFileType(activeLesson.get_file) === 'pptx'">
        <div class="columns">
          <div class="column"></div>
          <div class="column"></div>
          <div class="column">
            <!-- Finish Course Button -->
            <div v-if="activeLesson && isLastLesson" class="column is-12 mt-5">
              <template
                v-if="
                  courseActivity &&
                  courseActivity.course_status &&
                  courseActivity.course_status.status === 'done'
                "
              >
                <span class="tag is-success" @click="handleComplete"> Completed </span>
              </template>
              <template v-else>
                <button class="button is-primary" @click="finishCourse">
                  Finish Course
                </button>
              </template>
            </div>
            <div class="column is-12" v-else>
              <nav class="pagination">
                <a class="pagination-previous" @click="previousLesson">Previous</a>
                <a class="pagination-next" @click="nextLesson">Next</a>
              </nav>
            </div>
          </div>
        </div>
        <MyCustomPptViewer :fileUrl="activeLesson.get_file" />
      </div>
      <div v-if="getFileType(activeLesson.get_file) === 'pdf'">
        <MyDocPreview :pdfUrl="activeLesson.get_file" />
      </div>
    </template>
    <template v-if="activeLesson && !isLastLesson">
      <div
        v-if="
          activeLesson &&
          activeLesson.lesson_type === 'file' &&
          getFileType(activeLesson.get_file) === 'pptx'
        "
      ></div>
      <div class="column is-12" v-else>
        <nav class="pagination">
          <a class="pagination-previous" @click="previousLesson">Previous</a>
          <a class="pagination-next" @click="nextLesson">Next</a>
        </nav>
      </div>
    </template>
    <div
      v-if="
        activeLesson &&
        activeLesson.lesson_type === 'file' &&
        getFileType(activeLesson.get_file) === 'pptx'
      "
    ></div>

    <div class="columns" v-else>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column">
        <!-- Finish Course Button -->
        <div v-if="activeLesson && isLastLesson" class="column is-12 mt-5">
          <template
            v-if="
              courseActivity &&
              courseActivity.course_status &&
              courseActivity.course_status.status === 'done'
            "
          >
            <span class="tag is-success" @click="handleComplete"> Completed </span>
          </template>
          <template v-else>
            <button class="button is-primary" @click="finishCourse">Finish Course</button>
          </template>
        </div>
      </div>
    </div>
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
};
</script>
