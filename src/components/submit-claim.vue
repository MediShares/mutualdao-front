<template>
  <div class="project-release project-sm-container">
    <div class="container">
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="title">{{$t('submit_new_claim')}}</div>
          <p class="subtitle" v-if="projectTitle">{{$t('project')}}：{{projectTitle}}</p>
          <form class="basic-form" accept-charset="utf-8" ref="form" enctype="multipart/form-data">
            <!-- 申请互助金额-->
            <label>{{$t('claim_amount')}}</label>
            <input
              autocomplete="off"
              name="amount"
              type="number"
              class="basic-input"
              v-model="amount"
              :placeholder="$t('number_claim_amount')"
            />
            <!-- 申请描述 des -->
            <label>{{$t('tell_story')}}</label>
            <textarea
              autocomplete="off"
              class="basic-input"
              name="story"
              v-model="story"
              rows="10"
              :placeholder="$t('tell_story_pl')"
            ></textarea>
            <!-- 申请展示图片，注意name为数组，以后可能要传多张 photos[]-->
            <label class="photos">{{$t('photos')}}</label>
            <p>{{$t('photos_credibility')}}</p>
            <section class="photo-box clearfix">
              <div
                v-for="(item,index) in photos"
                :key="item"
                class="add-img"
                @click="deletePic(index)"
                :style="'background:#e1e6e9 url(' + item + ') center center/cover no-repeat'"
              >
                <p class="delete">{{$t('delete')}}</p>
              </div>
              <div class="photo">
                <input autocomplete="off" type="file" multiple @change="uploadPic" />
              </div>
            </section>
            <!-- 反馈通知 email-->
            <label>{{$t('project_email')}}</label>
            <input
              autocomplete="off"
              name="email"
              type="email"
              class="basic-input"
              v-model="email"
              :placeholder="$t('project_email_pl')"
            />
            <div class="agree">
              <input autocomplete="off" type="checkbox" v-model="checked" />
              <div>
                {{$t('agree')}}
                <a href="#rule" data-toggle="modal">《{{$t('DAO_claim_rule')}}》</a>
              </div>
            </div>
            <a class="confirm btn" @click="nextStep">{{$t('submit')}}</a>
          </form>
        </div>
      </div>
    </div>
    <successModal :title="$t('apply_success')" :link="'/projectDetail?id='+this.id" />
    <div class="modal" id="rule">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
          <div class="platform_rules" v-html="$t('submit_cliam_rules')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import successModal from "base/success-modal";
import sha from "js-sha256";
export default {
  props: ["id"],
  data() {
    return {
      projectTitle: "", //合约项目标题
      projectAccount: "", //合约名
      checked: false, //是否同意规则
      email: "",
      amount: "", //【 筹款金额 】
      story: "", //【 简介 】
      caseName: "", //【 简介base64 】
      photos: [], //【 图片url 】
      photo: [], //【 图片file 】
      token: "EOS" //【 筹款Token,比如：EOS，IQ，MEV 】
    };
  },
  created() {
    this.getProjectInfo();
  },
  methods: {
    getProjectInfo() {
      this.$http
        .get(this.domain + "apiDao/getProjectInfo?v=1.0&id=" + this.id)
        .then(res => {
          if (res.data.success && res.data.data.data) {
            this.projectAccount = res.data.data.data.targetAccount;
            this.projectTitle = res.data.data.data.title;
          } else {
            this.projectAccount = "";
            this.projectTitle = "";
          }
        })
        .catch(err => {
          console.log(err.statusText);
        });
    },
    uploadPic(event) {
      //获取的图片文件
      var fileList = event.target.files;
      if (fileList.length > 0) {
        for (var i = 0; i < fileList.length; i++) {
          this.photo.push(fileList[i]);
          this.photos.push(window.URL.createObjectURL(fileList[i]));
        }
      }
    },
    deletePic(index) {
      if (this.photos.length > 0) {
        this.$confirm({
          content: this.$t("delete_img_alert"),
          yesText: this.$t("confirm"),
          noText: this.$t("cancel")
        })
          .then(res => {
            this.photo.splice(index, 1);
            this.photos.splice(index, 1);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 提交表单
    nextStep() {
      // 先做base64加密
      let Base64 = require("js-base64").Base64;
      this.caseName = sha.sha256(Base64.encode(this.story));

      // 判断是否登录
      this.getAccount().then(res => {
        // 表单匹配
        if (!this.story) {
          this.$toast(this.$t("form_match_des"));
          return false;
        }
        if (this.photos.length == 0) {
          this.$toast(this.$t("form_match_photos"));
          return false;
        }
        if (this.amount <= 0) {
          this.$toast(this.$t("form_match_no_negative"));
          return false;
        }
        if (this.email && !this.webUtil.emailFormat(this.email)) {
          this.$toast(this.$t("email_error"));
          return false;
        }
        if (!this.checked) {
          this.$toast(this.$t("agree_terms"));
          return false;
        }

        // 生成表单数据
        const formData = new FormData(this.$refs.form);
        this.photo.map((item, index) => {
          formData.append("photo[" + index + "]", item);
        });
        formData.append("story", this.story);
        formData.append("caseName", this.caseName);
        formData.append("projectID", this.id);
        formData.append("proposer", this.account.name);

        // 去除空文件元素
        try {
          for (let pair of formData.entries()) {
            if (
              pair[1] instanceof File &&
              pair[1].name == "" &&
              pair[1].size == 0
            ) {
              formData.delete(pair[0]);
            }
          }
        } catch (e) {}

        this.setLoading(true);
        const eos = this.sctuser.getEos();
        // 创建项目提交到链上
        eos
          .transaction({
            actions: [
              {
                account: this.projectAccount, // 合约名
                name: "propose", // 合约方法
                authorization: [
                  {
                    actor: res.name, // 当前登录账户
                    permission: res.authority
                  }
                ],
                data: {
                  proposer: res.name, // 互助申请人
                  case_digest: this.caseName, // case名称
                  required_fund:
                    parseFloat(this.amount).toFixed(this.tokenDecimals) +
                    " " +
                    this.token // 申请金额
                }
              }
            ]
          })
          .then(
            result => {
              // 成功，调用我们的接口
              this.$http
                .post(this.domain + "apiDao/submitNewCase?v=1.0", formData, {
                  cache: false,
                  processData: false,
                  contentType: false
                })
                .then(res => {
                  this.setLoading(false);
                  if (res.data.success) {
                    $("#successModal").modal("show");
                  } else {
                    this.$toast(res.data.message);
                  }
                })
                .catch(error => {
                  // 失败
                  this.setLoading(false);
                  console.log(error);
                  this.$toast(this.$t("apply_error"));
                });
            },
            error => {
              this.setLoading(false);
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split(":")[1]
                  ? content.split(":")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("apply_error"));
              }
            }
          )
          .catch(error => {
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("apply_error"));
          });
      });
    }
  },
  watch: {
    id() {
      this.getProjectInfo();
    }
  },
  components: {
    successModal
  }
};
</script>

<style scoped>
@import "../../static/css/basicForm.css";
.photos {
  margin-bottom: 4px;
}
.photos + p {
  color: var(--blueGrey);
}
.add-img,
.photo {
  position: relative;
  float: left;
  width: 112px;
  height: 112px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  margin: 16px 16px 0 0;
}
.add-img .delete {
  height: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  background: var(--primaryColor);
  font: 500 12px/16px Gotham-Medium;
}
.photo {
  margin-right: 0;
  background: var(--paleBlue) url(../../static/img/icon/web_icon_pic.png)
    no-repeat center/48px;
}
</style>
