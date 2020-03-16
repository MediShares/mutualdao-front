<template>
  <div class="myproject-list">
    <!-- 我申请的互助 -->
    <article :class="{poiner:info.flagDeleted==0}" @click="goDetail" v-if="isApplied">
      <div class="list-pic" :style="{backgroundImage: 'url(' + info.project.img +')'}"></div>
      <div class="info">
        <h4>{{info.project.title}}</h4>
        <ul class="time">
          <li>{{$t('status')}}：{{info.flagDeleted==1?$t('deleted'):(info.status==1?$t('executed'):$t(info.status))}}</li>
          <li>{{$t('claim_time')}}：{{info.createDate}}</li>
          <li>{{$t('application_amount')}}：{{info.amount}} {{info.project.token}}</li>
        </ul>
        <p class="btn-box" v-if="info.flagDeleted==0">
          <span>{{$t('view')}}</span>
          <span class="delete" v-if="info.status!=1" @click.stop="deleteProject">{{$t('delete')}}</span>
        </p>
      </div>
    </article>
    <!-- 我支持的项目 -->
    <router-link
      class="clearfix"
      :to="{path: '/projectDetail',query: {id: info.project.ID}}"
      v-else-if="isJoined"
    >
      <div class="list-pic" :style="{backgroundImage: 'url(' + info.project.img +')'}"></div>
      <div class="info">
        <h4>{{info.project.title}}</h4>
        <ul class="time">
          <li>
            {{$t('status')}}：
            <span v-if="balance<=0">{{$t('exited')}}</span>
            <span
              v-else
              :class="{'main-color':info.remaining<=0}"
            >{{info.remaining>0?$t('waiting_period').replace('%d',info.remaining):$t('effectivity')}}</span>
          </li>
          <li>{{$t('join_time')}}：{{info.joinDate}}</li>
          <li>{{$t('mutual_aid_balance')}}：{{balance}} {{info.project.token}}</li>
        </ul>
        <p class="btn-box">
          <span>{{$t('view')}}</span>
        </p>
      </div>
    </router-link>
    <!-- 我的项目 -->
    <router-link class="clearfix" :to="{path: '/projectDetail',query: {id: info.ID}}" v-else>
      <div class="list-pic" :style="{backgroundImage: 'url(' + info.img +')'}"></div>
      <div class="info">
        <h4>{{info.title}}</h4>
        <time class="time">{{$t('release_time')}}：{{info.createDate}}</time>
        <p class="btn-box">
          <span>{{$t('view')}}</span>
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["index", "isJoined", "isApplied", "info"],
  data() {
    return {
      balance: 0
    };
  },
  created() {
    if (this.isApplied) {
      this.getCases();
    }
    if (this.isJoined) {
      this.getAccountInfo();
    }
  },
  methods: {
    // 删除申请互助
    deleteProject() {
      this.$emit(
        "deleteItem",
        this.index,
        this.info.ID,
        this.info.case_id,
        this.info.project.targetAccount
      );
    },
    // 查看项目
    goDetail() {
      if (this.info.flagDeleted == 0) {
        this.$router.push({
          path: "/projectDetail",
          query: { id: this.info.project.ID }
        });
      }
    },
    // 申请互助项目中状态判断
    getCases() {
      // 从链上获取投票详情
      this.$http
        .post(this.table_url, {
          json: true,
          code: this.info.project.targetAccount, //项目合约账户
          scope: this.info.project.targetAccount, //项目合约账户
          table: "cases"
        })
        .then(result => {
          let voteArr = result.data.rows;
          if (voteArr && voteArr.length > 0) {
            for (let i = 0; i < voteArr.length; i++) {
              // 找到相同的caseName 将投票数追加到case列表
              if (
                this.info.status == 0 &&
                voteArr[i].case_digest == this.info.caseName
              ) {
                this.$set(this.info, "case_id", voteArr[i].case_id);
                let vote_no = voteArr[i].vote_no.split(" ")[0];
                let vote_yes = voteArr[i].vote_yes.split(" ")[0];
                let outdate =
                  Date.now() -
                    new Date(this.info.endDate.replace(/\-/g, "/")) >=
                  0;
                if (outdate) {
                  this.info.status =
                    vote_yes - 0 > vote_no ? "pending" : "refused";
                } else {
                  this.info.status = "voting";
                }

                return false;
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 加入项目中状态和余额的获取
    getAccountInfo() {
      // 从链上查用户详情
      if (this.account) {
        this.$http
          .post(this.table_url, {
            json: true,
            code: this.info.project.targetAccount, //项目合约账户
            scope: this.info.project.targetAccount, //项目合约账户
            limit: "1",
            lower_bound: this.account.name,
            table: "accounts"
          })
          .then(result => {
            if (
              result.data.rows[0] &&
              result.data.rows[0].account == this.account.name
            ) {
              let user = result.data.rows[0];
              let asset = user.asset_list;
              asset.map(val => {
                let key = val.balance.split(" ")[1];
                let value = val.balance.split(" ")[0];
                user[key] = value;
              });
              this.balance = user[this.info.project.token]
                ? user[this.info.project.token]
                : 0;
            } else {
              this.balance = 0;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style scoped>
.poiner {
  cursor: pointer;
}
.myproject-list {
  display: block;
  border: 1px solid var(--very-light-blue);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 24px;
}
.myproject-list a {
  display: block;
}
.list-pic {
  float: left;
  width: 220px;
  height: 220px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.info {
  padding: 16px 24px;
  color: var(--darkColor);
  overflow: hidden;
  position: relative;
  height: 220px;
}

.info h4 {
  font: 500 20px/1.2 Gotham-Medium;
  color: var(--darkColor);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.info .time {
  display: block;
  color: var(--blueGrey);
  margin-top: 10px;
  line-height: 24px;
}
.btn-box {
  position: absolute;
  bottom: 16px;
  left: 24px;
  font: 500 16px/1.5 Gotham-Medium;
}

.btn-box span {
  display: inline-block;
  padding-right: 32px;
  color: var(--blueColor);
  cursor: pointer;
}

.btn-box .delete {
  color: #f44336 !important;
}

@media (max-width: 767px) {
  .list-pic {
    float: none;
    width: 100%;
    height: 180px;
  }
  .info {
    height: auto;
    padding: 16px;
  }
  .info h4 {
    font-size: 18px;
    -webkit-line-clamp: unset;
  }
  .btn-box {
    position: static;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
