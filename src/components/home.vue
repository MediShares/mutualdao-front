<template>
  <div class="home">
    <div class="mds-top">
      <div class="container">
        <div class="title">
          <span>{{$t('title')}}</span>
          <img src="static/img/icon/test.jpg" class="test-img" />
        </div>
        <div class="slogan">{{$t('slogan')}}</div>
        <!-- <a href="javascript:;" class="start btn" @click="createProject">{{$t('start_project')}}</a> -->
      </div>
    </div>
    <!-- All mutual aid programs -->
    <div class="aid-programs" v-if="programs&&programs.length>0">
      <div class="container">
        <h4 class="mds-title">{{$t('project')}}</h4>
        <ul class="row project-list">
          <li class="col-sm-4 col-xs-12" v-for="item in programs" :key="item.id">
            <project-list
              :id="item.ID"
              :picture="item.img"
              :title="item.title"
              :targetAccount="item.targetAccount"
            ></project-list>
          </li>
        </ul>
        <router-link to="/project" class="see-more">{{$t('see_more')}}</router-link>
      </div>
    </div>
    <contact></contact>
    <foot></foot>
  </div>
</template>

<script>
import projectList from "base/project-list";
import contact from "base/contact";
import foot from "base/foot";
export default {
  data() {
    return {
      programs: null
    };
  },
  created() {
    this.getPrograms();
  },
  methods: {
    getPrograms() {
      this.setLoading(true);
      this.$http
        .get(this.domain + "apiDao/getProjectList?v=1.0&page=1")
        .then(res => {
          if (res.data.success) {
            this.programs = res.data.data.data;
            if (this.programs && this.programs.length > 0) {
              this.programs = this.programs.slice(0, 3);
            }
          }
          this.setLoading(false);
        })
        .catch(err => {
          this.setLoading(false);
          console.log(err);
        });
    },
    createProject() {
      this.getAccount().then(res => {
        this.$router.push("/submitProject");
      });
    }
  },
  components: {
    contact,
    foot,
    projectList
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.project-list li {
  margin-bottom: 32px;
}
.start {
  margin-top: 104px;
}
.test-img {
  height: 32px;
}
.title span {
  vertical-align: middle;
}
@media (max-width: 767px) {
  .start {
    margin-top: 50px;
  }
  .test-img {
    height: 20px;
  }
}
</style>
