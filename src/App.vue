<template>
  <div id="app">
    <mds-nav></mds-nav>
    <router-view />
    <loading v-show="isLoading" />
  </div>
</template>

<script>
import mdsNav from "@/base/mdsNav";
import loading from "@/base/loading";
export default {
  created() {
    this.$router.afterEach((to, from) => {
      if (
        to.path != "/myProject" &&
        to.path != "/projectJoined" &&
        to.path != "/projectApplied"
      ) {
        this.loginByScatter();
      }
    });
  },
  methods: {
    loginByScatter() {
      this.getAccount().then(
        res => {
          this.setLoading(false);
        },
        err => {
          if (
            this.$route.path == "/submitProject" ||
            this.$route.path == "/submitClaim"
          ) {
            this.$router.push("/");
          }
        }
      );
    }
  },
  components: {
    mdsNav,
    loading
  }
};
</script>

<style>
</style>
