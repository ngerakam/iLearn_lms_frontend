<template>
  <div class="courses">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <h1 class="title">{{ course.title }}</h1>

        <router-link
          :to="{ name: 'Author', params: { id: course.created_by.id } }"
          class="subtitle"
        >
          By:
          {{ course.created_by.first_name + " " + course.created_by.last_name }}
        </router-link>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <div class="columns content">
          <div class="column is-2">
            <h2>Table of Contents</h2>
            <ul class="menu-list">
              <li v-for="lesson in lessons" v-bind:key="lesson.id">
                <a
                  @click="setActiveLesson(lesson)"
                  :disabled="enrollmentValue === null"
                  >{{ lesson.title }}</a
                >
              </li>
            </ul>
          </div>
          <div class="column is-10">
            <template v-if="$store.state.user.isAuthenticated">
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <div
                    class="field ml-auto mb-2"
                    v-if="enrollmentValue === null"
                  >
                    <div class="control">
                      <button
                        class="button is-primary"
                        @click="submitEnrollment"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <!-- Start Learning Button -->
                    <div v-if="startedValue === null" class="column is-12">
                      <button class="button is-primary" @click="startLearning">
                        Start Learning
                      </button>
                    </div>
                    <div v-if="courseActivity && activeLesson === null">
                      <div
                        class="column is-12"
                        v-if="courseActivity.course_status.status === 'done'"
                      >
                        <router-link class="button is-primary" to="/courses">
                          Completed
                        </router-link>
                      </div>
                      <div
                        class="column is-12"
                        v-else-if="
                          courseActivity.course_status.status === 'started'
                        "
                      >
                        <button
                          class="button is-primary"
                          @click="continueLearning"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="activeLesson">
                <div
                  class="notification is-success mt-3 mb-3"
                  v-if="final_score == !null"
                >
                  <button class="delete" @click="removeNotif()"></button>
                  Here is your final score: {{ final_score }}
                </div>
                <div class="columns">
                  <div class="column">
                    <h2>{{ activeLesson.title }}</h2>
                  </div>
                  <div class="column">
                    <template v-if="activeLesson.lesson_type === 'quiz'">
                      Score: {{ totalScore }} / {{ numQuiz }}
                    </template>
                  </div>
                  <div class="column">
                    <span
                      class="tag is-warning"
                      v-if="activity.status == 'started'"
                    >
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
                      <Quiz
                        v-bind:quiz="quiz"
                        @quiz-result="handleQuizResult(quiz, $event)"
                      />
                      <hr />
                    </div>
                    <div class="field ml-auto mb-2">
                      <div class="control">
                        <button
                          class="button is-primary"
                          @click="submitQuizResults"
                        >
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
                  <div
                    v-if="['docx'].includes(getFileType(activeLesson.get_file))"
                  >
                    <MyCustomDoc :fileUrl="activeLesson.get_file" />
                  </div>
                  <div v-if="getFileType(activeLesson.get_file) === 'pptx'">
                    <MyCustomPptViewer :fileUrl="activeLesson.get_file" />
                  </div>
                  <div v-if="getFileType(activeLesson.get_file) === 'pdf'">
                    <MyDocPreview :pdfUrl="activeLesson.get_file" />
                  </div>
                </template>
              </template>
              <template v-else>
                {{ course.long_description }}
              </template>
              <template v-if="activeLesson && !isLastLesson">
                <div class="column is-12">
                  <nav class="pagination">
                    <a class="pagination-previous" @click="previousLesson"
                      >Previous</a
                    >
                    <a class="pagination-next" @click="nextLesson">Next</a>
                  </nav>
                </div>
              </template>
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <!-- Finish Course Button -->
                  <div v-if="activeLesson && isLastLesson" class="column is-12">
                    <template
                      v-if="courseActivity.course_status.status === 'done'"
                    >
                      <router-link class="button is-primary" to="/courses">
                        Completed
                      </router-link>
                    </template>
                    <template v-else>
                      <button class="button is-primary" @click="finishCourse">
                        Finish Course
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="columns">
                <div class="column"></div>
                <div class="column"></div>
                <div class="column">
                  <div class="field ml-auto mb-2">
                    <div class="control">
                      <button
                        v-if="enrollmentValue === null"
                        class="button is-primary"
                        @click="submitEnrollment"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h2>Access Restricted</h2>
              <p>You are required to login so as to access this course.</p>
              <p>
                If you do not have an account kindly reach out to site admin :
                (example@siteadmin.com) for an account!
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
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
  data() {
    return {
      course: {
        created_by: {
          id: 0,
        },
      },
      lessons: [],
      comments: [],
      activeLesson: null,
      errors: [],
      quiz: {},
      activity: {},
      courseActivity: null,
      quizList: [],
      scores: [],
      final_score: null,
      enrollmentValue: null,
      startedValue: null,
    };
  },
  async mounted() {
    console.log("mounted");

    const slug = this.$router.currentRoute.value.params.slug;
    console.log(slug);

    await axios.get(`courses/${slug}/`).then((response) => {
      console.log(response.data);

      this.course = response.data.course;
      this.lessons = response.data.lessons;
    });

    this.verifyEnrollment();
    this.isCourseStarted();

    document.title = this.course.title + " | iLearn";
  },
  computed: {
    isLastLesson() {
      return (
        this.lessons.findIndex(
          (lesson) => lesson.id === this.activeLesson.id
        ) ===
        this.lessons.length - 1
      );
    },
    totalScore() {
      return this.scores.reduce(
        (total, score) => total + Number(score.score_value),
        0
      );
    },
    numQuiz() {
      return this.quizList.length;
    },
  },
  methods: {
    removeNotif() {
      this.final_score = null;
      this.activeLesson = null;
    },
    handleQuizResult(quiz, result) {
      console.log("Received quiz result:", result, "for quiz:", quiz);
      let score_value = "";
      if (result === "incorrect") {
        score_value = "0";
      }
      if (result === "correct") {
        score_value = "1";
      }

      const existingScore = this.scores.find(
        (score) => score.quiz_id === quiz.id
      );

      if (!existingScore) {
        const score = {
          quiz_id: quiz.id,
          course_id: this.course.id,
          lesson_id: this.activeLesson.id,
          score_value: score_value,
        };

        this.scores.push(score);
        console.log(this.scores);
      } else {
        console.log(`Quiz with ID ${quiz.id} already exists in the scores.`);
      }
    },
    submitQuizResults() {
      axios
        .post("activities/add-to-scoreboard/", this.scores)
        .then((response) => {
          console.log(response.data);

          this.final_score = response.data.total_score;
        });
      setTimeout(() => {
        this.markAsDone();
        this.removeNotif();
      }, 30000);
    },
    submitComment(comment) {
      this.comments.push(comment);
    },

    setActiveLesson(lesson) {
      if (this.enrollmentValue === null) {
        this.activeLesson === null;
      } else {
        this.activeLesson = lesson;
        this.scores = [];
        this.quizList = [];
      }

      if (lesson.lesson_type === "quiz") {
        this.getQuiz();
      } else {
        this.getComments();
      }

      this.trackStarted();
    },
    trackStarted() {
      axios
        .post(
          `activities/track_started/${this.$router.currentRoute.value.params.slug}/${this.activeLesson.slug}/`
        )
        .then((response) => {
          console.log(response.data);

          this.activity = response.data;
        });
    },
    markAsDone() {
      axios
        .post(
          `activities/mark_as_done/${this.$router.currentRoute.value.params.slug}/${this.activeLesson.slug}/`
        )
        .then((response) => {
          console.log(response.data);

          this.activity = response.data;
        });
    },
    continueLearning() {
      // Loop through the lessons array
      for (let lesson of this.lessons) {
        axios
          .post(
            `activities/track_started/${this.$router.currentRoute.value.params.slug}/${lesson.slug}/`
          )
          .then((response) => {
            console.log(response.data);

            this.activity = response.data;

            // Check if the lesson status is "started"
            if (this.activity.status === "started") {
              // Set activeLesson to the lesson with status "started"
              this.activeLesson = lesson;
              // Exit the loop since we found the lesson
              return;
            }
          })
          .catch((error) => {
            console.error("Error continuing learning:", error);
          });
      }
    },
    getQuiz() {
      axios
        .get(`courses/${this.course.slug}/${this.activeLesson.slug}/get-quiz/`)
        .then((response) => {
          console.log(response.data);

          this.quizList = response.data;
        });
    },
    getComments() {
      axios
        .get(
          `courses/${this.course.slug}/${this.activeLesson.slug}/get-comments/`
        )
        .then((response) => {
          console.log(response.data);

          this.comments = response.data;
        });
    },
    verifyEnrollment() {
      axios
        .get(`activities/verify_enrolled_course/${this.course.slug}`)
        .then((response) => {
          this.enrollmentValue =
            response.data.status === 200 ? "enrolled" : null;
          console.log(this.enrollmentValue);
        })
        .catch((error) => {
          console.error("Error verifying enrollment:", error);
        });
    },
    submitEnrollment() {
      if (!this.$store.state.user.isAuthenticated) {
        this.$router.push("/log-in");
      }
      const slug = this.$router.currentRoute.value.params.slug;
      console.log("Enroll button clicked");
      axios
        .post("activities/create_course_enrollment/", {
          course_slug: slug,
        })
        .then((response) => {
          console.log(response.data);
          this.enrollmentValue = "enrolled";
        });
    },
    getFileType(FileUrl) {
      const FileType = FileUrl.split(".").pop();
      return FileType.toLowerCase();
    },
    getVideoType(videoUrl) {
      const videoType = videoUrl.split(".").pop();
      return videoType.toLowerCase();
    },
    nextLesson() {
      this.markAsDone();
      const currentIndex = this.lessons.findIndex(
        (lesson) => lesson.id === this.activeLesson.id
      );
      if (currentIndex !== -1 && currentIndex < this.lessons.length - 1) {
        this.setActiveLesson(this.lessons[currentIndex + 1]);
      }
    },
    previousLesson() {
      const currentIndex = this.lessons.findIndex(
        (lesson) => lesson.id === this.activeLesson.id
      );
      if (currentIndex > 0) {
        this.setActiveLesson(this.lessons[currentIndex - 1]);
      }
    },
    isCourseStarted() {
      axios
        .get(`activities/verify_started_course/${this.course.slug}`)
        .then((response) => {
          this.startedValue = response.data.status === 200 ? "started" : null;
          this.courseActivity = response.data;
          console.log(this.courseActivity);
        })
        .catch((error) => {
          console.error("Error verifying course started:", error);
        });
    },
    startLearning() {
      console.log("Start Learning");
      axios
        .post(
          `activities/course_track_started/${this.$router.currentRoute.value.params.slug}/`
        )
        .then((response) => {
          console.log(response.data);

          if (this.lessons.length > 0) {
            this.setActiveLesson(this.lessons[0]);
          }
        });
    },
    finishCourse() {
      console.log("Finish Course");
      axios
        .post(
          `activities/mark_course_as_done/${this.$router.currentRoute.value.params.slug}/`
        )
        .then((response) => {
          console.log(response.data);

          this.markAsDone();

          this.$router.push("/courses");
        });
    },
  },
};
</script>
