import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import SignUpView from "@/views/SignUpView.vue";
import LoginView from "@/views/LoginView.vue";
import CoursesView from "@/views/CoursesView.vue";
import AuthorView from "@/views/AuthorView.vue";

// Dashboard
import MyAccountView from "@/views/dashboard/MyAccountView.vue";
import DashHome from "@/views/dashboard/DashHome.vue";
// Admin
import UserEdit from "@/views/dashboard/Admin/UserEdit.vue";
// Teacher
import TeacherCourseActivities from "@/views/dashboard/Teacher/TeacherCourseActivities.vue";
import TeacherCompletedCourses from "@/views/dashboard/Teacher/TeacherCompletedCourses.vue";
import CourseTeacherView from "@/views/dashboard/Teacher/Course/CourseTeacherView.vue";
import CreateCourse from "@/views/dashboard/Teacher/Course/CreateCourse.vue";
import CourseEditPage from "@/views/dashboard/Teacher/Course/CourseEditPage.vue";
import CreateModule from "@/views/dashboard/Teacher/Module/CreateModule.vue";
import ModuleEditPage from "@/views/dashboard/Teacher/Module/ModuleEditPage.vue";
import LessonCreateDetails from "@/views/dashboard/Teacher/Lesson/LessonCreateDetails.vue";
import EditLessonPage from "@/views/dashboard/Teacher/Lesson/EditLessonPage.vue";
// Student
import CourseView from "@/views/dashboard/Student/Course/CourseView.vue";
import ModuleView from "@/views/dashboard/Student/Course/Module/ModuleView.vue";

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
    path: "/courses/",
    name: "Courses",
    component: CoursesView,
  },
  {
    path: "/courses/:slug/",
    name: "Course",
    component: CourseView,
  },
  {
    path: "/courses/:slug/modules/",
    name: "ModuleView",
    component: ModuleView,
  },
  {
    path: "/authors/:id",
    name: "Author",
    component: AuthorView,
  },
  {
    path: "/dashboard/",
    name: "DashHome",
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
    path: "/dashboard/account",
    name: "MyAccount",
    component: MyAccountView,
  },
  {
    path: "/dashboard/create-course",
    name: "CreateCourse",
    component: CreateCourse,
  },
  {
    path: "/dashboard/create-course/:slug/module/",
    name: "CreateModule",
    component: CreateModule,
  },
  {
    path: "/dashboard/create-course/:slug/module/:moduleSlug/",
    name: "LessonCreateDetails",
    component: LessonCreateDetails,
  },
  {
    path: "/dashboard/edit-course/:slug/modules/",
    name: "CourseEditPage",
    component: CourseEditPage,
  },
  {
    path: "/dashboard/edit-course/:slug/modules/:moduleSlug/",
    name: "ModuleEditPage",
    component: ModuleEditPage,
  },
  {
    path: "/dashboard/edit-course/:slug/modules/:moduleSlug/lessons/:lessonSlug/",
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
