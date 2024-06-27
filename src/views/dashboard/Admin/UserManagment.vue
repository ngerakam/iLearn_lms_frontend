<template>
  <div>
    <div class="columns">
      <!-- Column for Cards -->
      <div class="column is-one-quarter">
        <div class="columns is-multiline is-mobile">
          <!-- Total Users Card -->
          <div class="card custom-card">
            <header class="card-header">
              <p class="card-header-title">
                <i class="fas fa-users icon-spaced"></i>
                Total Users
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <h2 class="title is-4">{{ users.length }}</h2>
              </div>
            </div>
          </div>
          <!-- Admins Card -->
          <div class="card custom-card">
            <header class="card-header">
              <p class="card-header-title">
                <i class="fas fa-users-cog icon-spaced"></i>
                Admins
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <h2 class="title is-4">{{ adminCount }}</h2>
              </div>
            </div>
          </div>
          <!-- Teachers Card -->
          <div class="card custom-card">
            <header class="card-header">
              <p class="card-header-title">
                <i class="fas fa-chalkboard-teacher icon-spaced"></i>
                Teachers
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <h2 class="title is-4">{{ teacherCount }}</h2>
              </div>
            </div>
          </div>
          <!-- Students Card -->
          <div class="card custom-card">
            <header class="card-header">
              <p class="card-header-title">
                <i class="fas fa-user-graduate icon-spaced"></i>
                Students
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <h2 class="title is-4">{{ studentCount }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Column for Table -->
      <div class="column mx-5">
        <div class="container mt-5">
          <h2 class="title is-4">List of Users</h2>
          <table id="usersTable" class="table is-bordered is-hoverable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                @click="editUser(user.id)"
              >
                <td>{{ user.first_name }} {{ user.last_name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ getRole(user) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import DataTable from "datatables.net-bm";
import "datatables.net-bm/css/dataTables.bulma.css";

export default {
  data() {
    return {
      users: [],
      adminCount: 0,
      teacherCount: 0,
      studentCount: 0,
      dataTable: null, // Variable to store DataTable instance
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get("/authentication/users");
        this.users = response.data;
        this.computeRoleCounts();
        this.initDataTable();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    computeRoleCounts() {
      this.adminCount = this.users.filter((user) => user.is_superuser).length;
      this.teacherCount = this.users.filter((user) => user.is_teacher).length;
      this.studentCount = this.users.filter((user) => user.is_student).length;
    },
    getRole(user) {
      if (user.is_superuser) return "Admin";
      if (user.is_teacher) return "Teacher";
      if (user.is_student) return "Student";
      return "User";
    },
    initDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
      this.$nextTick(() => {
        this.dataTable = $("#usersTable").DataTable({
          // DataTables options or configuration
          responsive: true,
          // Add more options as needed
        });
      });
    },
    editUser(userId) {
      this.$router.push({ name: "UserEdit", params: { id: userId } });
    },
  },
  beforeDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  },
};
</script>

<style scoped>
.custom-card {
  height: 120px;
  width: 100%;
  margin-bottom: 20px;
}
.icon-spaced {
  margin-right: 8px;
}
</style>
