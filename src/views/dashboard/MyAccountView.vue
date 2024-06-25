<template>
  <div class="about">
    <div class="hero is-info">
      <div class="hero-body has-text-centered">
        <h1 class="title">My Account</h1>
      </div>
    </div>
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="tabs is-centered">
            <ul>
              <li
                v-for="tabName in ['Settings']"
                :key="tabName"
                :class="{ 'is-active': activeClass === tabName }"
              >
                <a @click="setActiveClass(tabName)">{{ tabName }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container">
        <h2 class="subtitle is-size-6">Your: {{ activeClass }}</h2>

        <div v-if="activeClass === 'Settings'">
          <UserSettings />
        </div>
      </div>
    </section>
    <hr />
  </div>
</template>

<script>
import UserSettings from "@/components/User/UserSettings";

export default {
  data() {
    return {
      activeClass: "Courses",
    };
  },
  components: {
    UserSettings,
  },
  mounted() {},
  methods: {
    setActiveClass(tabName) {
      this.activeClass = tabName;
    },
  },
};
</script>
