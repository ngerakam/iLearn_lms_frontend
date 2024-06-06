<template>
  <div>
    <Nav />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import axios from "axios";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
export default {
  name: "App",
  components: {
    Nav,
    Footer,
  },
  beforeCreate() {
    this.$store.commit("initializeStore");

    const access_token = this.$store.state.user.access_token;

    if (access_token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
    } else {
      axios.defaults.headers.common["Authorization"] = "";
    }
  },
};
</script>

<style lang="scss">
@import "../node_modules/bulma";
</style>
