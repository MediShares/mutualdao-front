<template>
  <div class="project">
    <div class="container">
      <h4 class="title text-center">{{$t('all_projects')}}</h4>
      <ul class="row project-list" v-if="projects&&projects.length>0">
        <li class="col-sm-4 col-xs-12" v-for="item in projects" :key="item.id">
          <project-list
            :id="item.ID"
            :picture="item.img"
            :title="item.title"
            :introduce="item.introduce"
            :people="item.joinPersons"
            :amount="item.joinAmount"
            :token="item.token"
          ></project-list>
        </li>
      </ul>
      <blank-page :isProject="true" v-else></blank-page>
      <div v-if="projects&&projects.length>3&&isOver" class="bottom-line">
        <span>{{$t('bottom_line')}}</span>
      </div>
    </div>
    <foot></foot>
  </div>
</template>

<script>
import blankPage from "base/blank-page";
import projectList from "base/project-list";
import foot from "base/foot";
export default {
  data() {
    return {
      url: "apiDao/getProjectList?v=1.0&page=",
      isOver: false, //全部已加载
      page: 1,
      projects: []
    };
  },
  created() {
    this.getProjects();
  },
  methods: {
    getProjects() {
      // 设置一个开关来避免重复请求数据
      let sw = false;
      this.setLoading(true);
      this.$http
        .get(this.domain + this.url + this.page)
        .then(res => {
          this.setLoading(false);
          if (res.data.success) {
            // 将得到的数据放到vue中的data
            this.projects = res.data.data.data;

            if (this.projects && this.projects.length < 9) {
              // 全部已加载
              this.isOver = true;
              sw = false;
            } else {
              sw = true;
            }
          }
        })
        .catch(err => {
          this.setLoading(false);
          console.log(err);
        });

      // 注册scroll事件并监听
      $(window).scroll(() => {
        // 判断是否打开开关
        if (sw == true) {
          // 判断是否滚动到底部
          if (
            $(window).scrollTop() + $(window).height() >=
            $("#app").outerHeight(true) - $("footer").outerHeight(true)
          ) {
            this.setLoading(true);
            this.page++;
            // 将开关关闭
            sw = false;
            this.$http
              .get(this.domain + this.url + this.page)
              .then(res => {
                this.setLoading(false);
                // 将新获取的数据push到vue中的data，就会反应到视图中了
                this.projects = this.projects.concat(res.data.data.data);
                // 数据更新完毕，将开关打开
                if (res.data.data.data.length < 9) {
                  // 全部已加载
                  this.isOver = true;
                  sw = false;
                } else {
                  sw = true;
                }
              })
              .catch(err => {
                this.setLoading(false);
                console.log(err);
              });
          }
        }
      });
    }
  },
  components: {
    foot,
    projectList,
    blankPage
  }
};
</script>

<style scoped>
.project {
  padding-top: 80px;
}
.project-list {
  padding: 64px 0 30px;
}
.project-list li {
  margin-bottom: 32px;
}
.info .info-title {
  font-size: 20px;
  font-weight: 400;
  height: 4.2em;
  margin-bottom: 32px;
  line-height: 1.4;
}
.bottom-line span {
  background: var(--bgColor);
}
@media (max-width: 767px) {
  .project {
    padding-top: 24px;
  }
  .project-list {
    padding: 24px 0 0;
  }
}
</style>
