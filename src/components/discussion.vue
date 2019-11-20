<template>
  <section class="project-sm-container" v-if="claim">
    <article class="container">
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <h2 class="project-title">Mutual aid of Major illness</h2>
          <h4 class="info-title">{{claim.proposer}}</h4>
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
              <span class="label-name">{{$t('claim_amount')}}</span>
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
            <li v-for="item in comments" :key="item.ID">
              <h4>{{item.proposer}}</h4>
              <p>{{item.info}}</p>
              <time>{{item.createDate}}</time>
            </li>
          </ul>
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
      comment: ""
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
        .get(this.domain + "apiDao/?v=1.0&id=" + this.id)
        .then(res => {
          this.setLoading(false);
          if (res.data.success) {
            if (res.data.data && res.data.data.length > 0) {
              this.claim = res.data.data[0];
            } else {
              this.claim = null;
            }
          }
        })
        .catch(err => {
          this.setLoading(false);
          console.log(err);
        });
    },
    getComments() {
      this.$http
        .get(this.domain + "apiDao/?v=1.0&id=" + this.id)
        .then(res => {
          this.setLoading(false);
          if (res.data.success) {
            if (res.data.data && res.data.data.length > 0) {
              this.comments = res.data.data;
            } else {
              this.comments = null;
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.setLoading(false);
        });
    },
    submitComment() {
      this.setLoading(true);
      this.getAccount().then(account => {
        if (!this.comment.trim()) {
          this.$toast(this.$t("enter_comment"));
          return false;
        }
        this.$http
          .post(
            this.domain + "",
            {
              comment: this.comment,
              proposer: account.name
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
  padding: 8px 0 8px 56px;
  margin: 32px 0 16px;
  background: url(../../static/img/icon/web_icon_ID.png) no-repeat left
    center/48px;
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
  border-bottom: 1px solid var(--very-light-blue);
}
.comment-info li {
  padding: 24px 0 24px 56px;
  border-top: 1px solid var(--very-light-blue);
  background: url(../../static/img/icon/web_icon_ID.png) no-repeat left 24px/48px;
}
.comment-info h4 {
  padding: 8px 0;
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
</style>