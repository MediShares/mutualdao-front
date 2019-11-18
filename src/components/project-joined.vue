<template>
  <div class="project-container">
    <div class="container">
      <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
          <h4 class="title">{{$t('joined_projects')}}</h4>
          <template v-if="projects&&projects.length>0">
            <myproject-list v-for="item in projects" :key="item.ID" :info="item" :isJoined="true"></myproject-list>
          </template>
          <blank-page v-else></blank-page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blankPage from "base/blank-page";
import myprojectList from "base/myproject-list";
export default {
  data() {
    return {
      projects: null
    };
  },
  created() {
    this.getJoined();
  },
  methods: {
    getJoined() {
      this.setLoading(true);
      this.getAccount().then(res => {
        this.$http
          .get(
            this.domain + "apiDao/getJoinedProjects?v=1.0&account=" + res.name
          )
          .then(result => {
            this.setLoading(false);
            this.projects = result.data.data;
          });
      });
    }
  },
  components: {
    myprojectList,
    blankPage
  }
};
</script>

