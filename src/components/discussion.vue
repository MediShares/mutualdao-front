<template>
  <section class="project-sm-container" v-if="claim">
    <article class="container">
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <h2 class="project-title">{{claim.title}}</h2>
          <h4
            class="info-title"
            :style="'backgroundImage:url(https://api.medishares.net/apiTools/getAddressHead?address='+claim.proposer+'&v=1.0)'"
          >{{claim.proposer}}</h4>
          <!-- 申请文案 -->
          <p class="claim-des" v-html="webUtil.getFormatCode(claim.story)"></p>
          <!-- 申请图片 -->
          <viewer :images="claim.photo" class="clearfix">
            <span class="pic-container" v-for="src in claim.photo" :key="src">
              <img :src="src" />
            </span>
          </viewer>
          <!-- 投票信息 -->
          <ul class="vote-info">
            <li>
              <!-- 投票状态 -->
              <span class="label-name">{{$t('status')}}</span>
              <p v-if="status">{{$t('voting')}}</p>
              <p v-else>{{$t('vote_end')}}</p>
            </li>
            <li>
              <!-- 申请互助金额 -->
              <span class="label-name">{{$t('application_amount')}}</span>
              <p>{{claim.amount}} {{claim.token}}</p>
            </li>
            <li>
              <!-- 申请时间 -->
              <span class="label-name">{{$t('claim_time')}}</span>
              <p>{{claim.createDate}}</p>
            </li>
            <li>
              <!-- 投票结束时间 -->
              <span class="label-name">{{$t('voting_endtime')}}</span>
              <p>{{claim.endTime}}</p>
            </li>
          </ul>
        </div>
        <div class="col-md-8 col-md-offset-2 comment">
          <h4>{{$t('discussion')}}</h4>
          <input
            type="text"
            class="basic-input"
            :placeholder="$t('enter_comment')"
            v-model="comment"
          />
          <div class="submit" @click="submitComment">{{$t('comment')}}</div>
          <!-- 评论信息 -->
          <ul class="comment-info" v-if="comments&&comments.length>0">
            <li
              v-for="item in comments"
              :key="item.ID"
              :style="'backgroundImage:url(https://api.medishares.net/apiTools/getAddressHead?address='+item.proposer+'&v=1.0)'"
            >
              <h4>{{item.user}}</h4>
              <p>{{item.content}}</p>
              <time>{{item.createDate}}</time>
            </li>
          </ul>
          <div v-if="comments&&comments.length>0&&isOver" class="bottom-line">
            <span>{{$t('bottom_line')}}</span>
          </div>
        </div>
      </div>
    </article>
    <successModal :title="successModalTitle" :info="successModalInfo" />
  </section>
  <section v-else class="isNull">{{$t('no_claim')}}</section>
</template>
<script>
import successModal from "base/success-modal";
export default {
  props: ["id"],
  data() {
    return {
      successModalTitle: "",
      successModalInfo: "",
      claim: null,
      // 评论列表
      comments: null,
      // 评论区提交内容
      comment: "",
      // 获取评论数翻页
      page: 1,
      isOver: false
    };
  },
  computed: {
    status() {
      // 过期
      let isOutdate =
        Date.now() - new Date(this.claim.endTime.replace(/\-/g, "/")) >= 0;

      if (this.claim.status == 1 || isOutdate) {
        return false;
      }

      return true;
    }
  },
  created() {
    this.getCase();
    this.getComments();
  },
  methods: {
    getCase() {
      this.$http
        .get(this.domain + "apiDao/getCaseInfo?v=1.0&id=" + this.id)
        .then(res => {
          this.setLoading(false);
          // res.data = JSON.parse(res.data);
          if (res.data.success) {
            this.claim = res.data.data;
          }
        })
        .catch(err => {
          this.setLoading(false);
          console.log(err);
        });
    },
    getComments() {
      // 设置一个开关来避免重复请求数据
      let sw = false;
      this.setLoading(true);
      this.$http
        .get(
          this.domain +
            "apiDao/getCommentList?v=1.0&id=" +
            this.id +
            "&page=" +
            this.page
        )
        .then(res => {
          this.setLoading(false);
          if (res.data.success) {
            // 将得到的数据放到vue中的data
            this.comments = res.data.data.data;

            if (this.comments && this.comments.length < 9) {
              // 全部已加载
              this.isOver = true;
              sw = false;
            } else {
              sw = true;
            }
          } else {
            this.comments = null;
            this.isOver = true;
            sw = false;
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
            $("#app").outerHeight(true)
          ) {
            this.setLoading(true);
            this.page++;
            // 将开关关闭
            sw = false;
            this.$http
              .get(
                this.domain +
                  "apiDao/getCommentList?v=1.0&id=" +
                  this.id +
                  "&page=" +
                  this.page
              )
              .then(res => {
                this.setLoading(false);
                if (res.data.success) {
                  // 将新获取的数据push到vue中的data，就会反应到视图中了
                  this.comments = this.comments.concat(res.data.data.data);
                  // 数据更新完毕，将开关打开
                  if (res.data.data.data.length < 9) {
                    // 全部已加载
                    this.isOver = true;
                    sw = false;
                  } else {
                    sw = true;
                  }
                } else {
                  // 全部已加载
                  this.isOver = true;
                  sw = false;
                }
              })
              .catch(err => {
                this.setLoading(false);
                console.log(err);
              });
          }
        }
      });
    },
    submitComment() {
      this.getAccount().then(account => {
        if (!this.comment.trim()) {
          this.$toast(this.$t("enter_comment"));
          return false;
        }
        this.setLoading(true);
        this.$http
          .post(
            this.domain + "apiDao/submitComment?v=1.0",
            {
              content: this.comment,
              user: account.name,
              caseID: this.claim.ID,
              projectID: this.claim.projectID
            },
            {
              emulateJSON: true
            }
          )
          .then(res => {
            if (res.data.success) {
              this.successModalTitle = "comment_success";
              $("#successModal").modal("show");
              $("#successModal").on("hidden.bs.modal", function(e) {
                window.location.reload();
              });
            } else {
              this.$toast(this.$t("comment_error"));
            }
          })
          .catch(() => {
            this.$toast(this.$t("comment_error"));
          });
      });
    }
  },
  watch: {
    id() {
      this.getCase();
      this.getComments();
    }
  },
  components: {
    successModal
  }
};
</script>
<style scoped>
.project-title {
  font: 500 32px/1 Gotham-Medium;
  padding-top: 16px;
}
h4 {
  font: 500 16px/24px Gotham-Medium;
  color: var(--darkColor);
}
.info-title {
  padding: 8px 0 8px 48px;
  margin: 32px 0 16px;
  background: url(../../static/img/icon/web_icon_ID.png) no-repeat 0 8px/32px;
}
.pic-container {
  background: var(--bgColor);
}
.claim-des {
  font-size: 16px;
  line-height: 24px;
}
.vote-info {
  padding-top: 24px;
}
.comment {
  margin-top: 32px;
}
.comment-info {
  font-size: 16px;
  line-height: 24px;
  margin-top: 24px;
}
.comment-info li {
  padding: 32px 0 24px 56px;
  border-top: 1px solid var(--very-light-blue);
  background: url(../../static/img/icon/web_icon_ID.png) no-repeat 8px 28px/32px;
}
.comment-info time {
  font-size: 14px;
  line-height: 20px;
  color: var(--blueGrey);
  display: block;
  margin-top: 16px;
}
.basic-input {
  margin-top: 40px;
  background: var(--bgColor);
}
.submit {
  background: transparent;
  border: 1px solid var(--primaryColor);
  color: var(--primaryColor);
  margin-top: 16px;
  padding: 14px 12px;
  width: 100px;
  text-align: center;
  border-radius: 4px;
  line-height: 18px;
  cursor: pointer;
  display: inline-block;
}
@media (max-width: 767px) {
  .project-title {
    font-size: 26px;
    padding-top: 0;
  }
  .basic-input {
    margin-top: 24px;
  }
  .comment {
    padding-bottom: 10px;
  }
}
</style>