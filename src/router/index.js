import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import SignUpView from "@/views/SignUpView.vue";
import LoginView from "@/views/LoginView.vue";
import CoursesView from "@/views/CoursesView.vue";
import CourseView from "@/views/CourseView.vue";
import AuthorView from "@/views/AuthorView.vue";

// Dashboard
import MyAccountView from "@/views/dashboard/MyAccountView.vue";
import CreateCourse from "@/views/dashboard/CreateCourse.vue";
import CourseCreateDetails from "@/views/dashboard/CourseCreateDetails.vue";
import DashHome from "@/views/dashboard/DashHome.vue";
// Teacher
import TeacherCourseActivities from "@/views/dashboard/Teacher/TeacherCourseActivities.vue";
import TeacherCompletedCourses from "@/views/dashboard/Teacher/TeacherCompletedCourses.vue";
import CourseEditPage from "@/views/dashboard/Teacher/Course/CourseEditPage.vue";
import EditLessonPage from "@/views/dashboard/Teacher/Lesson/EditLessonPage.vue";
// Admin
import UserEdit from "@/views/dashboard/Admin/UserEdit.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
  },

  {
    path: "/log-in",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/courses",
    name: "Courses",
    component: CoursesView,
  },
  {
    path: "/courses/:slug",
    name: "Course",
    component: CourseView,
  },
  {
    path: "/authors/:id",
    name: "Author",
    component: AuthorView,
  },
  {
    path: "/dashboard/home",
    name: "DashHome",
    // component: MyAccountView,
    component: DashHome,
  },
  {
    path: "/dashboard/add-user/",
    name: "SignUp",
    component: SignUpView,
  },
  {
    path: "/dashboard/users/:id/user-edit",
    name: "UserEdit",
    component: UserEdit,
  },
  {
    path: "/dashboard/my-account",
    name: "MyAccount",
    component: MyAccountView,
  },
  {
    path: "/dashboard/create-course",
    name: "CreateCourse",
    component: CreateCourse,
  },
  {
    path: "/dashboard/create-course/:slug/",
    name: "CourseCreateDetails",
    component: CourseCreateDetails,
  },
  {
    path: "/dashboard/edit-course/:slug/",
    name: "CourseEditPage",
    component: CourseEditPage,
  },
  {
    path: "/dashboard/edit-course/:courseSlug/edit-lesson/:lessonSlug/",
    name: "EditLessonPage",
    component: EditLessonPage,
  },
  {
    path: "/dashboard/course-activities/:id",
    name: "TeacherCourseActivities",
    component: TeacherCourseActivities,
  },
  {
    path: "/dashboard/completed-course-activities/:id",
    name: "TeacherCompletedCourses",
    component: TeacherCompletedCourses,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
