<template>
  <div>
    <h3 class="title is-5">{{ lesson.title }}</h3>
    <table id="lessonActivitiesTable" class="table is-bordered is-hoverable">
      <thead>
        <tr>
          <th>Student</th>
          <th>Status</th>
          <th>Completed At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in lesson.completed_users" :key="user.created_by__id">
          <td>{{ user.created_by__first_name }} {{ user.created_by__last_name }}</td>
          <td>done</td>
          <td>{{ user.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    lesson: {
      type: Object,
      required: true,
    },
  },
};
</script>
