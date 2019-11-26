<template>
  <div class="project-release project-sm-container">
    <div class="container">
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="title">{{$t('submit_project')}}</div>
          <form class="basic-form" accept-charset="utf-8" ref="form" enctype="multipart/form-data">
            <!-- 项目名称 title-->
            <label>{{$t('project_title')}}</label>
            <input
              autocomplete="off"
              name="title"
              type="text"
              class="basic-input"
              v-model="title"
              :placeholder="$t('project_title_pl')"
            />
            <!-- 项目简介 des -->
            <label>{{$t('project_introduce')}}</label>
            <div id="story">
              <div v-if="!isFocus" class="story-pl">{{$t('project_introduce_pl')}}</div>
            </div>
            <!-- 封面图片-->
            <label>{{$t('position_photo')}}</label>
            <div class="photo-container">
              <div
                class="photo"
                :style="{background: photo?'url(' + photo +')no-repeat center/cover':'var(--paleBlue)'}"
              >
                <input autocomplete="off" name="img" type="file" @change="uploadPic" />
                <template v-if="!isLoad">
                  <img src="static/img/icon/web_icon_pic.png" width="72" />
                  <h5>{{$t('position_photo_pl')}}</h5>
                  <p class="photo-tip">{{$t('position_photo_tip')}}</p>
                </template>
              </div>
              <div class="photo-ext" v-if="isLoad">
                <div class="pull-right">
                  <span class="delete" @click="deletePic">{{$t('delete')}}</span>
                  <span class="again">{{$t('upload_again')}}</span>
                </div>
                <div class="blank"></div>
              </div>
            </div>
            <!-- 进入保障池的资金比例 -->
            <button
              class="help"
              data-toggle="tooltip"
              data-placement="bottom"
              :title="$t('aid_pool_tip')"
            >
              <img src="static/img/icon/qa.png" width="16" />
            </button>
            <label>{{$t('proportion_aid_pool')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                name="mutualPercent"
                class="basic-input"
                type="number"
                v-model="mutualPercent"
                placeholder="1-100"
              />
              <span class="target-token">%</span>
            </p>
            <!-- 进入治理池的资金比例 -->
            <button
              class="help"
              data-toggle="tooltip"
              data-placement="bottom"
              :title="$t('dividend_pool_tip')"
            >
              <img src="static/img/icon/qa.png" width="16" />
            </button>
            <label>{{$t('proportion_dividend_pool')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                name="dividendPercent"
                class="basic-input"
                type="number"
                v-model="dividendPercent"
                placeholder="1-100"
              />
              <span class="target-token">%</span>
            </p>
            <!-- 推荐比例 -->
            <button
              class="help"
              data-toggle="tooltip"
              data-placement="bottom"
              :title="$t('share_pool_tip')"
            >
              <img src="static/img/icon/qa.png" width="16" />
            </button>
            <label>{{$t('referral_ratio')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                name="referralRatio"
                class="basic-input"
                type="number"
                v-model="referralRatio"
                placeholder="1-100"
              />
              <span class="target-token">%</span>
            </p>
            <!-- 筹款Token -->
            <label>{{$t('token_aid')}}</label>
            <p class="basic-group">
              <select
                class="basic-input"
                name="token"
                v-model="token"
                @change="changetoken"
                disabled
              >
                <option value="EOS">EOS</option>
                <option value="EMDS">EMDS</option>
                <option value="EUSD">EUSD</option>
                <option value="EETH">EETH</option>
                <option value="EBTC">EBTC</option>
              </select>
              <span class="tri"></span>
            </p>
            <!-- 最低筹款金额  low  -->
            <label>{{$t('minimum_token_aid')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                class="basic-input"
                name="low"
                type="number"
                v-model="low"
                :placeholder="$t('enter_minimum_amount')"
              />
              <span class="target-token">{{token}}</span>
            </p>
            <!-- 最高筹款金额  high-->
            <label>{{$t('maximum_token_aid')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                class="basic-input"
                name="high"
                type="number"
                v-model="high"
                :placeholder="$t('enter_maximum_amount')"
              />
              <span class="target-token">{{token}}</span>
            </p>
            <!-- 合约等待期 -->
            <label>{{$t('contract_waiting_period')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                class="basic-input"
                name="waitingPeriod"
                type="number"
                v-model="waitingPeriod"
                :placeholder="$t('enter_contract_period')"
              />
              <span class="target-token">{{$t('days')}}</span>
            </p>
            <!-- 投票持续时间 -->
            <label>{{$t('voting_duration')}}</label>
            <p class="basic-group">
              <input
                autocomplete="off"
                class="basic-input"
                name="window"
                type="number"
                v-model="window"
                :placeholder="$t('enter_voting_duration')"
              />
              <span class="target-token">{{$t('days')}}</span>
            </p>
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
                <a href="#rule" data-toggle="modal">《{{$t('DAO_rule')}}》</a>
              </div>
            </div>
            <a class="confirm btn" @click="nextStep">{{$t('release')}}</a>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <successModal :title="$t('release_success')" :link="'/projectDetail?id='+projectID" />

    <div class="modal" id="rule">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
          <div class="platform_rules" v-html="$t('platform_rules')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import successModal from "base/success-modal";
import "wangeditor/release/wangEditor.css";
import E from "wangeditor";
export default {
  data() {
    return {
      checked: false, //是否同意规则
      isLoad: false, //是否上传封面图片
      isFocus: false, //富文本是否填写内容
      projectID: "", //项目ID
      token: "EOS", //【 筹款Token,比如：EOS，IQ，MEV 】
      title: "", //【 项目名称 】
      low: "", //【 加入最低金额 】
      high: "", //【 加入最高金额 】
      introduce: "", //【 项目简介 】
      photo: "", //【 封面图片url 】
      mutualPercent: "", //【 资金池百分比 】
      dividendPercent: "", //【 分红池百分比 】
      referralRatio: "", //【 推荐百分比 】
      window: "", //【 投票窗口期 】
      waitingPeriod: "", //【 等待期 】
      decimal: "4", //【 精度，非必须 】
      targetAccount: "mdsdaotest22", //【 合约名，非必须 】
      email: "" //【 邮箱，非必须 】
    };
  },
  mounted() {
    $('[data-toggle="tooltip"]').tooltip();
    this.editorConfig();
  },
  methods: {
    // 引入富文本编辑器
    editorConfig() {
      const editor = new E("#story");
      const that = this;
      editor.customConfig.uploadImgServer =
        this.domain + "apiDao/introduceImgUpload?v=1.0";
      editor.customConfig.zIndex = 10;
      editor.customConfig.menus = [
        "list", // 列表
        "bold", // 粗体
        "fontSize", // 字号
        "italic", // 斜体
        "image", // 插入图片
        "justify" // 对齐方式
      ];
      editor.customConfig.lang = {
        上传图片: that.$t("upload_image"),
        网络图片: that.$t("web_image"),
        图片链接: that.$t("image_link"),
        插入: that.$t("insert"),
        字号: that.$t("font_size"),
        设置列表: that.$t("settings_list"),
        有序列表: that.$t("ordered"),
        无序列表: that.$t("unordered"),
        对齐方式: that.$t("alignment"),
        靠左: that.$t("left"),
        居中: that.$t("center"),
        靠右: that.$t("right")
      };
      editor.customConfig.onfocus = function() {
        that.isFocus = true;
      };
      editor.customConfig.onchange = function(html) {
        that.isFocus = true;
        that.introduce = html.replace(
          /<div class="story_pl">&\s*\S*&<\/div>/g,
          ""
        );
      };
      editor.create();
    },
    // 提交表单
    nextStep() {
      // 判断是否登录
      this.getAccount().then(res => {
        // 表单匹配
        if (!this.title) {
          this.$toast(this.$t("form_match_title"));
          return false;
        }
        if (!this.introduce) {
          this.$toast(this.$t("form_match_des"));
          return false;
        }
        if (!this.photo) {
          this.$toast(this.$t("form_match_photos"));
          return false;
        }
        if (
          this.mutualPercent -
            0 +
            (this.dividendPercent - 0) +
            (this.referralRatio - 0) !=
          100
        ) {
          this.$toast(this.$t("percent_limit"));
          return false;
        }
        if (this.low <= 0) {
          this.$toast(this.$t("form_match_low_limit"));
          return false;
        }
        if (this.high <= 0) {
          this.$toast(this.$t("enter_maximum_amount"));
          return false;
        }
        if (this.high - 0 > 1000) {
          this.$toast(this.$t("form_match_high_limit"));
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
        formData.append("creator", res.name);
        formData.append("introduce", this.introduce);
        formData.append("targetAccount", this.targetAccount);

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
        this.$http
          .post(this.domain + "apiDao/submitNewProject?v=1.0", formData, {
            cache: false,
            processData: false,
            contentType: false
          })
          .then(res => {
            this.setLoading(false);
            if (res.data.success) {
              this.projectID = res.data.data;
              $("#successModal").modal("show");
            } else {
              this.$toast(res.data.message, {
                duration: 4000
              });
            }
          })
          .catch(error => {
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("release_error"));
          });
      });
    },
    uploadPic(event) {
      //获取的图片文件
      var fileList = event.target.files[0];
      if (fileList) {
        this.photo = window.URL.createObjectURL(fileList);
        this.isLoad = true;
      }
    },
    deletePic(event) {
      this.photo = "";
      this.isLoad = false;
    },
    changetoken(event) {
      const target = event.target.value;
      this.token = target;
      switch (target) {
        case "EOS":
          this.decimal = 4;
          break;
        case "EMDS":
          this.decimal = 4;
          break;
        default:
          this.decimal = 8;
          break;
      }
    }
  },
  components: {
    successModal
  }
};
</script>

<style scoped>
@import "../../static/css/basicForm.css";
</style>
