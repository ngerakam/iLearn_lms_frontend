<!-- LessonActivities.vue -->
<template>
  <div>
    <h3 class="title is-5">{{ lesson.title }}</h3>
    <table class="table is-bordered is-hoverable">
      <thead>
        <tr>
          <th>Student</th>
          <th>Status</th>
          <th>Completed At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="activity in lesson" :key="activity.id">
          <td>
            {{ activity.completed_users[0].created_by.first_name }}
            {{ activity.completed_users[0].created_by.last_name }}
          </td>
          <td>{{ activity.status }}</td>
          <td>{{ activity.completed_users[0].created_at }}</td>
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
