<template>
  <div class="project-backed project-container">
    <div class="container">
      <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
          <h4 class="title">{{$t('apply_projects')}}</h4>
          <ul v-if="projects&&projects.length>0">
            <li v-for="(item,index) in projects" :key="item.ID">
              <myproject-list
                v-if="item.project.ID"
                @deleteItem="deleteProject"
                :index="index"
                :isApplied="true"
                :info="item"
              ></myproject-list>
            </li>
          </ul>
          <blank-page :isApplied="true" v-else></blank-page>
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
    this.getApplied();
  },
  methods: {
    getApplied() {
      this.setLoading(true);
      this.getAccount().then(res => {
        this.$http
          .get(this.domain + "apiDao/getAppliedCases?v=1.0&account=" + res.name)
          .then(result => {
            this.setLoading(false);
            this.projects = result.data.data;
          })
          .catch(err => {
            console.log(err);
            this.setLoading(false);
          });
      });
    },
    deleteProject(index, id, case_id, targetAccount) {
      this.setLoading(true);
      // 判断是否登录
      this.getAccount().then(res => {
        const eos = this.sctuser.getEos();
        // 删除项目提交到链上
        eos
          .transaction({
            actions: [
              {
                account: targetAccount, // 合约名
                name: "delproposal", // 合约方法
                authorization: [
                  {
                    actor: res.name, // 当前登录账户
                    permission: res.authority
                  }
                ],
                data: {
                  account: res.name, // 互助申请人--》当前登录账户
                  case_id: case_id // 申请互助 id
                }
              }
            ]
          })
          .then(result => {
            // 成功，调用我们的接口
            this.$http
              .post(
                this.domain + "apiDao/deleteAppliedCase?v=1.0",
                {
                  id: id,
                  proposer: res.name // 互助申请人--》当前登录账户
                },
                { emulateJSON: true }
              )
              .then(res => {
                this.setLoading(false);
                if (res.data.success) {
                  this.$toast(this.$t("delete_success"));
                  this.$router.go(0);
                } else {
                  this.$toast(res.data.message);
                }
              })
              .catch(() => {
                // 失败
                this.$toast(_this.$t("delete_error"));
              });
          })
          .catch(error => {
            this.setLoading(false);
            // 失败
            this.$toast(this.$t("delete_error"));
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

