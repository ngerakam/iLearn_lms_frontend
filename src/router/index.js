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
    path: "/sign-up",
    name: "SignUp",
    component: SignUpView,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
