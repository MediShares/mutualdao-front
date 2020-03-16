<template>
  <div class="project-detail">
    <div class="isNull" v-if="isNull">{{$t('project_error')}}</div>
    <template v-else>
      <!-- 项目资产 -->
      <div class="container">
        <h3 class="title">{{project.title}}</h3>
        <p class="release-info">
          <span>{{$t('release_account')}}：{{project.creator}}</span>
          <i>{{$t('release_time')}}：{{project.createDate}}</i>
        </p>
        <div class="row">
          <section class="col-sm-8">
            <p
              class="pic"
              :style="{background: 'rgba(0,0,0,0.05) url(' + project.img +')no-repeat center/cover'}"
            ></p>
            <ul class="program-info clearfix" v-if="pool">
              <li>
                <h4 class="pro-value">{{pool.guarantee_pool?pool.guarantee_pool.split(' ')[0]:0}}</h4>
                <p class="pro-key">{{$t("mutual_aid_pool")}} ({{project.token}})</p>
              </li>
              <li>
                <h4 class="pro-value">{{pool.bonus_pool?pool.bonus_pool.split(' ')[0]:0}}</h4>
                <p class="pro-key">{{$t("dividend_pool")}} ({{project.token}})</p>
              </li>
              <li>
                <h4 class="pro-value">{{pool.guaranteed_accounts?pool.guaranteed_accounts:0}}</h4>
                <p class="pro-key">{{$t("people")}}</p>
              </li>
              <li>
                <h4 class="pro-value">{{pool.tatal_donate?pool.tatal_donate.split(' ')[0]:0}}</h4>
                <p class="pro-key">{{$t("claimed")}} ({{project.token}})</p>
              </li>
              <li>
                <h4 class="pro-value">{{pool.total_key?pool.total_key.split(' ')[0]:0}}</h4>
                <p class="pro-key">Key</p>
              </li>
              <li>
                <h4 class="pro-value">{{pool.total_skey?pool.total_skey.split(' ')[0]:0}}</h4>
                <p class="pro-key">SKey</p>
              </li>
            </ul>
          </section>
          <section class="col-sm-4">
            <article class="user-info" v-if="user">
              <template v-if="permission">
                <!-- 状态 -->
                <p class="wait" v-if="user.aidBalance<=0">{{$t('exited')}}</p>
                <p
                  v-else
                  :class="[{'main-color':remaining<=0},'wait']"
                >{{remaining>0?$t('waiting_period').replace('%d',remaining):$t('effectivity')}}</p>
              </template>
              <h4 class="pro-value">{{user.aidBalance}}</h4>
              <p class="pro-key">{{$t("mutual_aid_balance")}} ({{project.token}})</p>
              <h4 class="pro-value">{{user.Key}}</h4>
              <p class="pro-key">{{$t("my")}} Key</p>
              <h4 class="pro-value">{{user.SKey}}</h4>
              <p class="pro-key">{{$t("my")}} SKey</p>
            </article>
            <!-- 加入 -->
            <p class="btn btn-block supportBtn" @click="joinProject">{{$t('join')}}</p>

            <!-- 分享 -->
            <p v-if="project.referralRatio>0&&account">
              <a
                class="copy-btn share-btn"
                ref="copy"
                :data-clipboard-text="link"
                data-clipboard-action="copy"
                @click="copyVal"
              >
                {{$t('share')}}
                <i>{{$t('share_get_bonus').replace('%d',project.referralRatio+'%')}}</i>
              </a>
            </p>
            <p v-else>
              <a
                class="copy-btn btn"
                ref="copy"
                :data-clipboard-text="link"
                data-clipboard-action="copy"
                @click="copyVal"
              >{{$t('share')}}</a>
            </p>
          </section>
        </div>
      </div>
      <!-- 项目下半部分 -->
      <section class="detail-info">
        <article class="tab">
          <div class="container">
            <div class="row">
              <div class="col-sm-8">
                <a
                  v-for="(item,index) in tabs"
                  :key="index"
                  :class="{'active':activeTab==item}"
                  @click="activeTab=item"
                >{{$t(item)}}</a>
              </div>
              <div class="col-sm-4 hidden-xs">
                <p class="btn btn-block" @click="joinProject">{{$t('join')}}</p>
              </div>
            </div>
          </div>
        </article>
        <div class="container detail-info-container">
          <div class="row">
            <div class="col-sm-8">
              <!-- 项目详情 -->
              <section class="details" v-show="activeTab=='details'">
                <ul class="detail-list">
                  <li>
                    <span>{{$t('proportion_aid_pool')}}</span>
                    <p>{{project.mutualPercent}}%</p>
                  </li>
                  <li>
                    <span>{{$t('proportion_dividend_pool')}}</span>
                    <p>{{project.dividendPercent}}%</p>
                  </li>
                  <li>
                    <span>{{$t('referral_ratio')}}</span>
                    <p>{{project.referralRatio}}%</p>
                  </li>
                  <li>
                    <span>{{$t('token_aid')}}</span>
                    <p>{{project.token}}</p>
                  </li>
                  <li>
                    <span>{{$t('minimum_token_aid')}}</span>
                    <p>{{project.low}}</p>
                  </li>
                  <li>
                    <span>{{$t('maximum_token_aid')}}</span>
                    <p>{{project.high}}</p>
                  </li>
                  <li>
                    <span>{{$t('contract_waiting_period')}} ({{$t('days')}})</span>
                    <p>{{Math.ceil(project.waitingPeriod)}}</p>
                  </li>
                  <li>
                    <span>{{$t('voting_duration')}} ({{$t('days')}})</span>
                    <p>{{Math.ceil(project.window)}}</p>
                  </li>
                </ul>
                <article v-html="project.introduce"></article>
              </section>
              <!-- 互助公示 -->
              <section class="claims" v-show="activeTab=='claims'">
                <!-- 登录且加入该项目显示此项，但是过了等待期才能申请互助 -->
                <div class="submit-claim" v-if="account&&permission">
                  <p class="btn copy-btn" @click="submitClaim">{{$t('submit_new_claim')}}</p>
                </div>
                <ul v-if="claimsList&&claimsList.length>0">
                  <li
                    class="claim-list"
                    v-for="item in claimsList"
                    :key="item.ID"
                    :style="'backgroundImage:url(https://api.medishares.net/apiTools/getAddressHead?address='+item.proposer+'&v=1.0)'"
                  >
                    <h4 class="info-title">{{item.proposer}}</h4>
                    <article class="claim-info">
                      <!-- 申请文案 -->
                      <div :class="[{'line-limit':!item.hasReadAll},'claim-des']">
                        <p
                          ref="claimText"
                          class="claim-text"
                          v-html="webUtil.getFormatCode(item.story)"
                        ></p>
                        <a
                          class="read-more"
                          @click="item.hasReadAll=true"
                          v-show="!item.hasReadAll"
                        >
                          ...
                          <u>{{$t('read_more')}}</u>
                        </a>
                      </div>
                      <p
                        class="collapse-more"
                        @click="item.hasReadAll=false"
                        v-show="item.hasReadAll"
                      >
                        <u>{{$t('collapse')}}</u>
                      </p>
                      <!-- 申请图片 -->
                      <viewer :images="item.photo" class="clearfix">
                        <span class="pic-container" v-for="src in item.photo" :key="src">
                          <img :src="src" />
                        </span>
                      </viewer>
                    </article>
                    <!-- 投票信息 -->
                    <ul class="vote-info">
                      <li>
                        <!-- 投票状态 -->
                        <span class="label-name">{{$t('status')}}</span>
                        <div class="clearfix">
                          <p class="vote-select" v-if="item.status==1">{{$t('executed')}}</p>
                          <p
                            class="vote-select"
                            v-else-if="item.status=='pending'"
                          >{{$t('pending')}}</p>
                          <p
                            class="vote-select"
                            v-else-if="item.status=='refused'"
                          >{{$t('refused')}}</p>
                          <p class="vote-select" v-else>{{$t('voting')}}</p>
                          <a
                            v-if="item.status=='pending'"
                            class="btn"
                            @click="executeClaim(item)"
                          >{{$t('execute')}}</a>
                        </div>
                      </li>
                      <li>
                        <!-- 申请互助金额 -->
                        <span class="label-name">{{$t('application_amount')}}</span>
                        <p>{{item.amount}} {{project.token}}</p>
                      </li>
                      <li v-if="item.status=='1'">
                        <!-- 实际到账金额 -->
                        <span class="label-name">{{$t('claim_amount')}}</span>
                        <p>{{item.actualAmount?item.actualAmount:'--'}} {{project.token}}</p>
                      </li>
                      <li>
                        <!-- 申请时间 -->
                        <span class="label-name">{{$t('claim_time')}}</span>
                        <p>{{item.createDate}}</p>
                      </li>
                      <li>
                        <!-- 投票结束时间 -->
                        <span class="label-name">{{$t('voting_endtime')}}</span>
                        <p>{{item.endTime}}</p>
                      </li>
                      <li>
                        <span class="label-name">{{$t('vote_number')}}</span>
                        <div class="clearfix">
                          <!-- 同意票 -->
                          <p class="vote-select">{{$t('agree')}}: {{item.vote_yes}}</p>
                          <!-- 未过期case 才显示投票按钮 -->
                          <template v-if="item.status=='voting'">
                            <a
                              v-if="!item.isAgree"
                              class="btn"
                              @click="voteAgree(item)"
                            >{{$t('vote')}}</a>
                            <a
                              v-else
                              class="btn btn-grey"
                              @click="cancelAgreeVote(item)"
                            >{{$t('cancel')}}</a>
                          </template>
                        </div>
                        <div class="clearfix">
                          <!-- 反对票 -->
                          <p class="vote-select">{{$t('disagree')}}: {{item.vote_no}}</p>
                          <!-- 未过期case 才显示投票按钮 -->
                          <template v-if="item.status=='voting'">
                            <a
                              v-if="!item.isDisagree"
                              class="btn"
                              @click="voteDisagree(item)"
                            >{{$t('vote')}}</a>
                            <a
                              v-else
                              class="btn btn-grey"
                              @click="cancelDisagreeVote(item)"
                            >{{$t('cancel')}}</a>
                          </template>
                        </div>
                      </li>
                      <li>
                        <!-- 社区论坛 -->
                        <span class="label-name">{{$t('DAO_discussion')}}</span>
                        <router-link
                          class="discussion"
                          :to="'/discussion?id='+item.ID"
                        >http://mutualdao.org</router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
                <p v-else class="no-claim">{{$t('no_claim')}}</p>
              </section>
              <!-- 交易 -->
              <section class="trade" v-show="activeTab=='trade'">
                <!-- 卖出key -->
                <article class="clearfix">
                  <h4 class="info-title">
                    {{$t('exchange')}}
                    <span>1 Key ≈ {{keyPrice}} {{project.token}}</span>
                  </h4>
                  <div class="basic-group exchange">
                    <input
                      class="exchange-input"
                      v-model="sellKeyNumber"
                      type="number"
                      pattern="[0-9]*"
                      placeholder="0"
                      autocomplete="off"
                    />
                    <span class="target-token">Key</span>
                    <p class="pull-right">≈ {{sellKeyPrice}} {{project.token}}</p>
                    <p>{{$t('available')}} {{user?user.Key:0}} Key</p>
                  </div>
                  <a class="btn" @click="sellKey">{{$t('sell')}}</a>
                </article>
                <!-- 交换key 与 skey -->
                <article class="clearfix">
                  <h4 class="info-title">{{$t('swap')}}</h4>
                  <ul class="exchange clearfix">
                    <li class="basic-group">
                      <input
                        type="number"
                        pattern="[0-9]*"
                        v-model="swapNumber"
                        placeholder="0"
                        autocomplete="off"
                      />
                      <span class="target-token">{{swapFrom.name}}</span>
                      <p>{{$t('available')}} {{swapFrom.assets}} {{swapFrom.name}}</p>
                    </li>
                    <li class="swap-pic">
                      <!-- 两边交换位置 -->
                      <img class="hidden-xs" src="static/img/icon/swap.png" @click="swapPosition" />
                      <img
                        class="hidden-sm hidden-md hidden-lg"
                        src="static/img/icon/swap2.png"
                        @click="swapPosition"
                      />
                    </li>
                    <li class="basic-group">
                      <input
                        type="number"
                        pattern="[0-9]*"
                        v-model="swapNumber"
                        placeholder="0"
                        disabled
                      />
                      <span class="target-token">{{swapTo.name}}</span>
                    </li>
                  </ul>
                  <a class="btn" @click="swapConfirm">{{$t('swap')}}</a>
                </article>
                <!-- 历史记录 -->
                <ul>
                  <!-- tab -->
                  <li class="history-tab clearfix">
                    <a
                      :class="{'active':activeHistory=='share'}"
                      @click="activeHistory='share'"
                    >{{$t('share_history')}}</a>
                    <a
                      :class="{'active':activeHistory=='aid'}"
                      @click="activeHistory='aid'"
                    >{{$t('mutual_aid_history')}}</a>
                  </li>
                  <!-- 分享记录 -->
                  <li v-show="activeHistory=='share'">
                    <ul v-if="shareHistory&&shareHistory.length>0">
                      <li class="history-info" v-for="item in shareHistory" :key="item.ID">
                        <span class="pull-right">+ {{item.amount}} {{item.token}}</span>
                        <p class="address">{{item.joiner}}</p>
                        <time class="history-time">{{item.createDate}}</time>
                      </li>
                    </ul>
                    <p v-else class="no-info">{{$t('no_share_history')}}</p>
                  </li>
                  <!-- 互助记录 -->
                  <li v-show="activeHistory=='aid'">
                    <ul v-if="aidHistory&&aidHistory.length>0">
                      <li class="history-info" v-for="item in aidHistory" :key="item.ID">
                        <span class="pull-right">- {{item.quantity}} {{item.token}}</span>
                        <p class="address">{{item.from}}</p>
                        <time class="history-time">{{item.time}}</time>
                      </li>
                    </ul>
                    <p v-else class="no-info">{{$t('no_aid_history')}}</p>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>
      <!-- Modal -->
      <div class="modal" id="payment">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">{{$t('join')}}</h4>
            <span class="token-price">1 {{project.token}} ≈ {{joinKeyNumber(1)}} Key</span>
            <label>{{$t('number_assets')}}</label>
            <p class="basic-group">
              <input
                class="basic-input"
                type="number"
                v-model="join.amount"
                :placeholder="$t('number_assets_input')"
                autocomplete="off"
              />
              <span class="target-token">{{project.token}}</span>
              <span class="equal">≈ {{joinKeyNumber(join.amount)}} Key</span>
            </p>
            <label>{{$t('beneficiary_account')}}</label>
            <p class="basic-group">
              <input
                class="basic-input"
                v-model="join.account"
                :placeholder="$t('beneficiary_account')"
              />
              <a class="target-token" @click="join.account=''">{{$t('switch_beneficiary')}}</a>
            </p>
            <div class="confirm btn" @click="joinConfirm">{{$t('join')}}</div>
          </div>
        </div>
      </div>
      <!-- 交易成功弹窗 -->
      <successModal :title="successModalTitle" :info="successModalInfo" />
    </template>
    <foot></foot>
  </div>
</template>

<script>
import foot from "base/foot";
import successModal from "base/success-modal";
import Clipboard from "clipboard";
export default {
  props: ["id", "tab"],
  data() {
    return {
      project: {
        creator: "loading",
        title: "loading",
        introduce: "loading",
        img: "",
        mutualPercent: "0",
        dividendPercent: "0",
        referralRatio: "0",
        token: "loading",
        low: "0",
        high: "0",
        window: "0",
        waitingPeriod: "0",
        targetAccount: "loading",
        createDate: "loading"
      }, //项目详情
      pool: null, //链上项目信息
      user: null, //用户信息
      permission: false, //该登录用户是否加入该项目
      remaining: 9999, //剩余多少天可申请互助 未登录或者未加入返回9999
      tabs: ["details", "claims", "trade"],
      keyPrice: "1", //key的价格
      key_skey: "1", //key和skey兑换比例
      sellKeyNumber: "", //卖出key数量
      activeTab: "details", //选中tab
      activeHistory: "share", //选中的历史记录tab
      //互助申请列表
      claimsList: null,
      //分享记录
      shareHistory: null,
      //互助记录
      aidHistory: null,
      // key与skey之间转换
      swapFrom: {
        name: "Key",
        assets: 0
      },
      swapTo: {
        name: "SKey",
        assets: 0
      },
      swapNumber: "",
      // 分享按钮
      copyBtn: "",
      isNull: false,
      join: {
        amount: "", //支付金额
        account: "" //受益人
      },
      // 交易成功弹窗
      successModalTitle: "",
      successModalInfo: null,
      outdateInterval: null, //投票状态定时器
      sharer: "" //分享人
    };
  },
  computed: {
    sellKeyPrice() {
      let number = this.sellKeyNumber ? this.sellKeyNumber : 0;
      let assets = this.bigNumber(number)
        .multipliedBy(this.keyPrice)
        .toFixed(4);
      return assets;
    },
    // 分享链接
    link() {
      let link = window.location.origin + "/#/projectDetail?id=" + this.id;
      if (this.account) {
        return link + "&from=" + this.account.name;
      }
      return link;
    }
  },
  created() {
    // 获取分享人
    this.sharer = this.webUtil.getQueryString("from");
    this.activeTab =
      this.tab && this.tabs.includes(this.tab) ? this.tab : "details";
    // 初始化
    this.init();

    // 实时获取投票状态
    this.outdateInterval = setInterval(() => {
      if (this.claimsList && this.claimsList.length > 0) {
        this.claimsList.map(item => {
          if (item.status != 1) {
            item.status = this.getStatus(item);
          }
        });
      }
    }, 10000);
  },
  mounted() {
    this.copyBtn = new Clipboard(this.$refs.copy);

    // 支付按钮悬浮
    this.togglePayment();
    this.tabFix();
    $(window).scroll(() => {
      this.togglePayment();
      this.tabFix();
    });
  },
  beforeDestroy() {
    $(".header-nav").css("top", "0px");
    if (this.outdateInterval) {
      clearInterval(this.outdateInterval); //关闭
    }
  },
  methods: {
    // 样式js
    togglePayment() {
      if ($(".supportBtn")[0]) {
        if ($(window).scrollTop() > $(".supportBtn").offset().top) {
          $(".tab").addClass("scroll");
        } else {
          $(".tab").removeClass("scroll");
        }
      }
    },
    tabFix() {
      if ($(".tab")[0]) {
        let disY =
          $(window).scrollTop() -
          ($(".detail-info").offset().top - $(".mds-nav").outerHeight());
        if (disY > 0) {
          $(".header-nav").css("top", -disY + "px");
          if (disY >= 50) {
            $(".detail-info").addClass("fixed");
          } else {
            $(".detail-info").removeClass("fixed");
          }
        } else {
          $(".header-nav").css("top", "0px");
          $(".detail-info").removeClass("fixed");
        }
      }
    },
    // 复制粘贴
    copyVal() {
      // 复制粘贴
      if (!this.webUtil.browserVersions().android) {
        let clipboard = this.copyBtn;
        clipboard.on("success", e => {
          this.$toast(this.$t("copy_success"), {
            toastStyle: {
              backgroundImage: "url(static/img/icon/toast_yes.png)"
            }
          });
          clipboard.destroy();
          this.copyBtn = new Clipboard(this.$refs.copy);
        });
        clipboard.on("error", () => {
          this.$toast(this.$t("copy_error"));
          clipboard.destroy();
          this.copyBtn = new Clipboard(this.$refs.copy);
        });
      } else {
        let oInput = document.createElement("input");
        oInput.type = "text";
        oInput.value = this.link;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.parentNode.removeChild(oInput); //执行完之后删除该对象
        this.$toast(this.$t("copy_success"), {
          toastStyle: {
            backgroundImage: "url(static/img/icon/toast_yes.png)"
          }
        });
      }
    },
    // case 投票状态
    getStatus(item) {
      let status = "voting";
      // 过期
      let isOutdate =
        Date.now() - new Date(item.endTime.replace(/\-/g, "/")) >= 0;

      if (isOutdate) {
        status = item.vote_yes - 0 > item.vote_no ? "pending" : "refused";
      }

      return status;
    },
    // 加入弹窗key与EOS比例
    joinKeyNumber(amount) {
      // 获取分享人
      this.sharer = this.webUtil.getQueryString("from");
      let assets = amount ? amount : 0;
      let dividendPercent = this.project.dividendPercent;
      // 如果没有分享人并且他的分享奖励大于0则将分享奖励按比例进入保障池和治理池
      if (!this.sharer && this.project.referralRatio > 0) {
        dividendPercent = this.bigNumber(dividendPercent)
          .div(100 - this.project.referralRatio)
          .multipliedBy(this.project.referralRatio)
          .plus(dividendPercent)
          .toNumber();
      }

      let keyNumber = this.bigNumber(assets)
        .multipliedBy(dividendPercent)
        .div(100)
        .div(this.keyPrice)
        .toFixed(0, this.BigNumber.ROUND_FLOOR);

      return keyNumber;
    },
    init() {
      // loading
      this.setLoading(true);
      // 获取分享记录
      this.getShareHistory();
      // 获取互助记录
      this.getAidHistory();
      // 获取项目详情
      this.getProjectInfo();
    },
    // 获取项目详情
    getProjectInfo() {
      this.$http
        .get(
          this.domain +
            "apiDao/getProjectInfo?v=1.0&id=" +
            this.id +
            "&account=" +
            (this.account ? this.account.name : "")
        )
        .then(res => {
          this.setLoading(false);
          if (res.data.success) {
            let project = res.data.data;
            if (!project) {
              this.isNull = true;
              return false;
            }
            // 项目信息
            this.project = project.data;
            this.permission = project.permission;
            this.remaining = project.remaining;

            $(".details img").css({
              width: "100%",
              margin: "10px 0"
            });

            // 获取key价格
            this.getKeyPrice();

            // 获取互助申请列表
            this.getCases();

            // 从链上查项目详情
            this.$http
              .post(this.table_url, {
                json: true,
                code: this.project.targetAccount, //项目合约账户
                scope: this.project.targetAccount, //项目合约账户
                table: "global"
              })
              .then(result => {
                this.pool = result.data.rows[0];
              })
              .catch(err => {
                console.log(err);
              });

            // 从链上查用户详情
            if (this.account) {
              this.$http
                .post(this.table_url, {
                  json: true,
                  code: this.project.targetAccount, //项目合约账户
                  scope: this.project.targetAccount, //项目合约账户
                  limit: "1",
                  lower_bound: this.account.name,
                  table: "accounts"
                })
                .then(result => {
                  if (
                    result.data.rows[0] &&
                    result.data.rows[0].account == this.account.name
                  ) {
                    this.user = result.data.rows[0];
                    let asset = this.user.asset_list;
                    asset.map(val => {
                      let key = val.balance.split(" ")[1];
                      let value = val.balance.split(" ")[0];
                      this.user[key] = value;
                    });
                    this.user.aidBalance = this.user.EOS ? this.user.EOS : 0;
                    this.user.Key = this.user.KEY ? this.user.KEY : 0;
                    this.user.SKey = this.user.SKEY ? this.user.SKEY : 0;
                    // 初始化交换可用数据
                    this.swapFrom.assets = this.user.Key;
                    this.swapTo.assets = this.user.SKey;
                  } else {
                    this.user = null;
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              this.user = null;
            }
          } else {
            this.isNull = true;
          }
        })
        .catch(err => {
          console.log(err);
          this.setLoading(false);
        });
    },
    // 获取互助公示列表
    getCases() {
      this.$http
        .get(this.domain + "apiDao/getProjectCases?v=1.0&id=" + this.id)
        .then(res => {
          if (res.data.success) {
            this.claimsList = res.data.data;
            if (this.claimsList && this.claimsList.length > 0) {
              this.claimsList.map(item => {
                // 如果为已处理case，链上将其删除只能从数据库中拉取投票数
                if (item.status == 1) {
                  // 投票数
                  this.$set(item, "vote_yes", item.agree);
                  this.$set(item, "vote_no", item.disagree);
                } else {
                  // 投票数
                  this.$set(item, "vote_yes", 0);
                  this.$set(item, "vote_no", 0);
                  // 投票状态
                  item.status = this.getStatus(item);
                }

                //公示内容是否展开
                this.$set(item, "hasReadAll", false);
              });

              // 从链上获取投票详情
              this.$http
                .post(this.table_url, {
                  json: true,
                  code: this.project.targetAccount, //项目合约账户
                  scope: this.project.targetAccount, //项目合约账户
                  table: "cases"
                })
                .then(result => {
                  let voteArr = result.data.rows;
                  if (voteArr && voteArr.length > 0) {
                    for (let i = 0; i < voteArr.length; i++) {
                      for (let j = 0; j < this.claimsList.length; j++) {
                        let claim = this.claimsList[j];
                        // 找到相同的caseName 将投票数追加到case列表
                        if (
                          claim.status != 1 &&
                          voteArr[i].case_digest == claim.caseName
                        ) {
                          this.$set(
                            this.claimsList[j],
                            "case_id",
                            voteArr[i].case_id
                          );
                          this.claimsList[j].vote_no = voteArr[i].vote_no.split(
                            " "
                          )[0];
                          this.claimsList[j].vote_yes = voteArr[
                            i
                          ].vote_yes.split(" ")[0];

                          // 投票状态
                          this.claimsList[j].status = this.getStatus(
                            this.claimsList[j]
                          );
                          // 获取登录用户所投未过期case的票数
                          if (
                            this.getStatus(claim) == "voting" &&
                            this.user &&
                            this.user.vote_list &&
                            this.user.vote_list.length > 0
                          ) {
                            this.user.vote_list.map(user => {
                              if (user.case_id == this.claimsList[j].case_id) {
                                if (user.agreed) {
                                  this.$set(
                                    this.claimsList[j],
                                    "isAgree",
                                    true
                                  );
                                } else {
                                  this.$set(
                                    this.claimsList[j],
                                    "isDisagree",
                                    true
                                  );
                                }
                              }
                            });
                          }
                        }
                      }
                    }
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        });
    },
    // 获取历史记录
    getShareHistory() {
      if (this.account) {
        this.$http
          .get(
            this.domain +
              "apiDao/getProjectShares?v=1.0&id=" +
              this.id +
              "&sharer=" +
              this.account.name
          )
          .then(res => {
            if (res.data.success) {
              this.shareHistory = res.data.data;
            }
          });
      }
    },
    getAidHistory() {
      if (this.account) {
        this.$http
          .get(
            this.domain +
              "apiDao/getAidHistory?v=1.0&id=" +
              this.id +
              "&account=" +
              this.account.name
          )
          .then(res => {
            if (res.data.success) {
              this.aidHistory = res.data.data;
            }
          });
      }
    },
    // 申请互助
    submitClaim() {
      if (this.remaining <= 0) {
        this.$router.push({
          path: "/submitClaim",
          query: {
            id: this.id
          }
        });
      } else {
        this.$toast(
          this.$t("unable_submit_claim").replace(/\%d/g, this.remaining)
        );
      }
    },
    // 投票
    voteAgree(item) {
      if (!this.permission) {
        this.$toast(this.$t("vote_join_first"));
        return false;
      }

      this.getAccount().then(account => {
        // 可用余额不足
        if (!this.user || this.user.SKey <= 0) {
          this.$toast(this.$t("amount_less0"));
          return false;
        }
        this.setLoading(true);
        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: "approve", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //投票账户
                  case_id: item.case_id //case id
                }
              }
            ]
          })
          .then(
            res => {
              this.setLoading(false);
              this.successModalTitle = "vote_success";
              $("#successModal").modal("show");
              let _this = this;
              $("#successModal").on("hidden.bs.modal", function(e) {
                _this.$router.push({
                  path: "/projectDetail",
                  query: {
                    id: _this.id,
                    tab: "claims"
                  }
                });
                window.location.reload();
              });
            },
            error => {
              this.setLoading(false);
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("vote_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("vote_error"));
          });
      });
    },
    voteDisagree(item) {
      if (!this.permission) {
        this.$toast(this.$t("vote_join_first"));
        return false;
      }
      this.getAccount().then(account => {
        // 可用余额不足
        if (!this.user || this.user.SKey <= 0) {
          this.$toast(this.$t("amount_less0"));
          return false;
        }
        this.setLoading(true);
        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: "unapprove", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //投票账户
                  case_id: item.case_id //case id
                }
              }
            ]
          })
          .then(
            res => {
              this.setLoading(false);
              this.successModalTitle = "vote_success";
              $("#successModal").modal("show");
              let _this = this;
              $("#successModal").on("hidden.bs.modal", function(e) {
                _this.$router.push({
                  path: "/projectDetail",
                  query: {
                    id: _this.id,
                    tab: "claims"
                  }
                });
                window.location.reload();
              });
            },
            error => {
              this.setLoading(false);
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("vote_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("vote_error"));
          });
      });
    },
    cancelAgreeVote(item) {
      this.setLoading(true);
      this.getAccount().then(account => {
        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: "cancelvote", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //投票账户
                  case_id: item.case_id //case id
                }
              }
            ]
          })
          .then(
            res => {
              this.setLoading(false);
              this.successModalTitle = "cancelvote_success";
              $("#successModal").modal("show");
              let _this = this;
              $("#successModal").on("hidden.bs.modal", function(e) {
                _this.$router.push({
                  path: "/projectDetail",
                  query: {
                    id: _this.id,
                    tab: "claims"
                  }
                });
                window.location.reload();
              });
            },
            error => {
              this.setLoading(false);
              // 失败
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("exec_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("cancelvote_error"));
          });
      });
    },
    cancelDisagreeVote(item) {
      this.setLoading(true);
      this.getAccount().then(account => {
        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: "cancelvote", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //投票账户
                  case_id: item.case_id //case id
                }
              }
            ]
          })
          .then(
            res => {
              this.setLoading(false);
              this.successModalTitle = "cancelvote_success";
              $("#successModal").modal("show");
              let _this = this;
              $("#successModal").on("hidden.bs.modal", function(e) {
                _this.$router.push({
                  path: "/projectDetail",
                  query: {
                    id: _this.id,
                    tab: "claims"
                  }
                });
                window.location.reload();
              });
            },
            error => {
              this.setLoading(false);
              // 失败
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("exec_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("cancelvote_error"));
          });
      });
    },
    // 处理互助申请：拨款
    executeClaim(item) {
      this.setLoading(true);
      this.getAccount().then(account => {
        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: "execproposal", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //处理投票账户
                  case_id: item.case_id //case id
                }
              }
            ]
          })
          .then(
            res => {
              // 将数据提交到数据库
              this.$http
                .post(
                  this.domain + "apiDao/caseExecute?v=1.0",
                  {
                    id: item.ID, //数据库ID
                    case_id: item.case_id
                  },
                  {
                    emulateJSON: true
                  }
                )
                .then(result => {
                  this.setLoading(false);
                  if (result.data.success) {
                    this.successModalTitle = "exec_success";
                    this.successModalInfo =
                      this.$t("claim_amount") +
                      "：" +
                      result.data.data.transfer_fund +
                      " " +
                      this.project.token;
                    $("#successModal").modal("show");
                    let _this = this;
                    $("#successModal").on("hidden.bs.modal", function(e) {
                      _this.$router.push({
                        path: "/projectDetail",
                        query: {
                          id: _this.id,
                          tab: "claims"
                        }
                      });
                      window.location.reload();
                    });
                  } else {
                    this.$toast(result.data.message);
                  }
                })
                .catch(err => {
                  this.setLoading(false);
                  this.$toast(this.$t("exec_error"));
                  console.log(err);
                });
            },
            error => {
              this.setLoading(false);
              // 失败
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("exec_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.setLoading(false);
            console.log(error);
            this.$toast(this.$t("exec_error"));
          });
      });
    },
    // 卖key
    sellKey() {
      this.getAccount().then(account => {
        // 输入数值
        if (this.sellKeyNumber <= 0) {
          this.$toast(this.$t("amount_less0"));
          return false;
        }
        // 可用余额不足
        if (!this.user || this.sellKeyNumber - 0 > this.user.Key) {
          this.$toast(this.$t("more_available"));
          return false;
        }
        this.setLoading(true);
        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: "sellkey", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //转出账户
                  key_quantity: this.sellKeyNumber + " KEY" //key数量
                }
              }
            ]
          })
          .then(
            res => {
              this.setLoading(false);
              this.successModalTitle = "sell_success";
              this.successModalInfo =
                this.sellKeyNumber +
                " Key" +
                " ≈ " +
                this.bigNumber(this.sellKeyNumber)
                  .multipliedBy(this.keyPrice)
                  .toFixed(4) +
                " " +
                this.project.token;
              $("#successModal").modal("show");
              let _this = this;
              $("#successModal").on("hidden.bs.modal", function(e) {
                _this.$router.push({
                  path: "/projectDetail",
                  query: {
                    id: _this.id,
                    tab: "trade"
                  }
                });
                window.location.reload();
              });
            },
            error => {
              this.setLoading(false);
              // 失败
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("sell_error"));
              }
            }
          )
          .catch(error => {
            this.setLoading(false);
            // 失败
            console.log(error);
            this.$toast(this.$t("sell_error"));
          });
      });
    },
    // key 与 skey 兑换
    swapPosition() {
      this.swapNumber = "";
      let place = JSON.parse(JSON.stringify(this.swapFrom));
      this.swapFrom = JSON.parse(JSON.stringify(this.swapTo));
      this.swapTo = place;
    },
    swapConfirm() {
      // 登录
      this.getAccount().then(account => {
        // 输入数值
        if (this.swapNumber <= 0) {
          this.$toast(this.$t("amount_less0"));
          return false;
        }
        // 可用余额不足
        if (this.swapNumber - 0 > this.swapFrom.assets) {
          this.$toast(this.$t("more_available"));
          return false;
        }

        // 合约方法
        let actionName =
          this.swapFrom.name == "Key" ? "stakekey" : "unstakekey";

        this.setLoading(true);

        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.project.targetAccount, // 合约名
                name: actionName, // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  account: account.name, //转出账户
                  key_quantity:
                    this.swapNumber + " " + this.swapFrom.name.toUpperCase() //key数量
                }
              }
            ]
          })
          .then(
            res => {
              this.setLoading(false);
              this.successModalTitle = "swap_success";
              this.successModalInfo =
                this.swapNumber +
                " " +
                this.swapFrom.name +
                " = " +
                this.swapNumber +
                " " +
                this.swapTo.name;
              $("#successModal").modal("show");
              let _this = this;
              $("#successModal").on("hidden.bs.modal", function(e) {
                _this.$router.push({
                  path: "/projectDetail",
                  query: {
                    id: _this.id,
                    tab: "trade"
                  }
                });
                window.location.reload();
              });
            },
            error => {
              this.setLoading(false);
              // 失败
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content, { duration: 3000 });
              } else {
                this.$toast(this.$t("exec_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.setLoading(false);
            this.$toast(this.$t("swap_error"));
          });
      });
    },
    // 点击页面加入
    joinProject() {
      this.getAccount().then(res => {
        this.join.account = res.name;
        $("#payment").modal("show");
      });
    },
    // 点击弹窗加入
    joinConfirm() {
      // 获取分享人
      this.sharer = this.webUtil.getQueryString("from");
      // 登录
      this.getAccount().then(account => {
        // 判断金额
        // 换算1key需要多少eos
        let eosNumber = this.bigNumber(this.keyPrice)
          .multipliedBy(100)
          .div(this.project.dividendPercent)
          .toFixed(4);

        // 找出项目的最小限额和实际最少限额中的较大值设为加入项目最小额度
        let lowLimit =
          eosNumber - 0 > this.project.low ? eosNumber : this.project.low;

        // 加入金额小于最低限额则不可加入
        if (this.join.amount - 0 < lowLimit) {
          this.$toast(
            this.$t("join_low_error") + lowLimit + " " + this.project.token
          );
          return false;
        }

        if (this.join.amount - 0 > this.project.high) {
          this.$toast(
            this.$t("join_high_error") +
              this.project.high +
              " " +
              this.project.token
          );
          return false;
        }

        // 交易
        this.sctuser
          .getEos()
          .transaction({
            actions: [
              {
                account: this.contract[this.project.token], // 合约名
                name: "transfer", // 合约方法
                authorization: [
                  {
                    actor: account.name, // 当前登录账户
                    permission: account.authority
                  }
                ],
                data: {
                  from: account.name, //转出账户
                  to: this.project.targetAccount, //收钱账户
                  quantity:
                    parseFloat(this.join.amount).toFixed(4) +
                    " " +
                    this.project.token,
                  memo: this.sharer
                    ? '"buyfor":"' +
                      this.join.account +
                      '","ref":"' +
                      this.sharer +
                      '"'
                    : '"buyfor":"' + this.join.account + '"'
                }
              }
            ]
          })
          .then(
            result => {
              // 成功之后调用我们的log
              this.$http
                .post(
                  this.domain + "apiDao/joinProject?v=1.0",
                  {
                    hash: result.transaction_id,
                    projectID: this.project.ID,
                    beneficiaryAccount: this.join.account,
                    amount: this.join.amount,
                    buyer: this.account.name,
                    targetAccount: this.project.targetAccount,
                    balance:
                      this.user && this.user.aidBalance
                        ? this.user.aidBalance
                        : 0,
                    memo: this.sharer
                  },
                  { emulateJSON: true }
                )
                .then(res => {
                  $("#payment").modal("hide");
                  // 加入数据清空
                  this.join.amount = "";
                  this.join.account = "";

                  if (res.data.success) {
                    this.successModalTitle = "join_success";
                    $("#successModal").modal("show");
                    $("#successModal").on("hidden.bs.modal", function(e) {
                      window.location.reload();
                    });
                  } else {
                    this.$toast(res.data.message);
                  }
                })
                .catch(error => {
                  // 失败
                  console.log(error);
                  this.$toast(this.$t("join_error"));
                });
            },
            error => {
              if (JSON.parse(error)) {
                let content = JSON.parse(error).error.details[0].message;
                content = content.split("message:")[1]
                  ? content.split("message:")[1]
                  : content;
                this.$toast(content);
              } else {
                this.$toast(this.$t("join_error"));
              }
            }
          )
          .catch(error => {
            // 失败
            this.$toast(this.$t("join_error"));
          });
        // end 交易
      });
    },
    // 获取key价格
    getKeyPrice() {
      this.$http
        .post(this.table_url, {
          json: true,
          code: this.project.targetAccount, //项目合约账户
          scope: this.project.targetAccount, //项目合约账户
          table: "keymarket"
        })
        .then(result => {
          let row = result.data.rows[0];
          if (row) {
            let key = row.base.balance.split(" ")[0];
            let price = row.quote.balance.split(" ")[0];
            this.keyPrice = this.bigNumber(price)
              .div(key)
              .toFixed(4);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    // 切换账号时重新获取详情
    account(to) {
      this.init();
    },
    // 切换项目
    id(to) {
      this.init();
    },
    tab() {
      this.activeTab =
        this.tab && this.tabs.includes(this.tab) ? this.tab : "details";
    }
  },
  components: {
    foot,
    successModal
  }
};
</script>
<style scoped>
.project-detail {
  padding: 68px 0 0;
}

.project-detail .title {
  padding-bottom: 32px;
  line-height: 1;
  text-align: left;
}

.release-info {
  padding-bottom: 32px;
}

.release-info span {
  margin-right: 46px;
}

.project-detail .pic {
  width: 100%;
  height: 390px;
  border-radius: 4px 4px 0 0;
}

.program-info {
  background: #fff;
  padding: 24px 32px 0;
  border-radius: 0 0 4px 4px;
}

.program-info li {
  float: left;
  width: 50%;
}

.wait,
.effect {
  font: 500 14px/16px Gotham-Medium;
  margin-bottom: 32px;
}

.effect {
  color: var(--primaryColor);
}

.wait {
  color: var(--blueGrey);
}

.pro-value {
  font: 500 24px/28px Gotham-Medium;
  margin: 8px 0;
}

.pro-key {
  margin-bottom: 32px;
}

.supportBtn {
  margin-top: 16px;
}

.user-info + .supportBtn {
  margin: 0;
}

.copy-btn {
  display: block;
  text-align: center;
  background: transparent;
  border: 1px solid var(--primaryColor);
  color: var(--primaryColor);
  margin-top: 16px;
}

.share-btn {
  padding: 8px;
  border-radius: 4px;
  font: 500 14px/20px Gotham-Medium;
}

.copy-btn:hover {
  color: var(--primaryColor);
}

.share-btn i {
  display: block;
  font-size: 12px;
  line-height: 1;
}

.unJoin {
  opacity: 0.5;
}

.detail-info {
  background: #fff;
  margin-top: 64px;
}

/* tab */

.tab {
  border-bottom: 1px solid var(--very-light-blue);
  overflow: hidden;
}

.detail-info.fixed {
  padding-top: 80px;
}

.detail-info.fixed .tab {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1030;
  background: #fff;
}

.tab a {
  color: rgba(96, 125, 139, 0.5);
  font: 500 20px/78px Gotham-Medium;
  display: inline-block;
  width: 30%;
  max-width: 178px;
  position: relative;
  text-transform: capitalize;
  user-select: none;
}

.tab .active {
  color: var(--darkColor);
}

.tab .btn-block {
  margin: 0;
  transform: translateY(78px);
  transition: transform 0.5s;
}

.tab.scroll .btn-block {
  transform: translateY(13px);
}

/* 详情 */

.detail-info-container {
  padding: 48px 15px 64px;
}

.info-title {
  font: 500 20px/32px Gotham-Medium;
  color: var(--darkColor);
  padding-bottom: 16px;
}

.info-title span {
  font: 400 14px/20px Gotham-Book;
  margin-left: 10px;
}

.detail-list {
  padding: 16px 32px 32px;
  border: 1px solid #000;
  border-radius: 4px;
  margin-bottom: 48px;
}

.detail-list li {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  line-height: 16px;
}

.detail-list p {
  font: 500 14px/16px Gotham-Medium;
}

/* 公示 */

.submit-claim {
  padding-bottom: 46px;
  border-bottom: 1px solid var(--very-light-blue);
}

.claim-list {
  background: url(../../static/img/icon/web_icon_ID.png) no-repeat 8px 8px/32px;
  border-bottom: 1px solid var(--very-light-blue);
  padding: 0 0 48px 64px;
}

.submit-claim + ul > .claim-list:first-child,
.claim-list + .claim-list {
  padding-top: 48px;
  background-position: 8px 56px;
}

.claim-list .info-title {
  padding: 8px 0;
  margin-bottom: 8px;
}

.claim-info {
  background: var(--bgColor);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.claim-des {
  font-size: 20px;
  line-height: 28px;
  position: relative;
  overflow: hidden;
}

.claim-des.line-limit {
  max-height: 84px;
}

.claim-text {
  word-break: break-word;
}

.read-more,
.collapse-more {
  color: var(--darkColor) !important;
  background: var(--bgColor);
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
}

.read-more {
  position: absolute;
  padding-left: 4px;
  right: 0;
  bottom: 0;
}

.collapse-more {
  text-align: right;
}

.vote-select {
  float: left;
  width: 160px;
}

.vote-info .btn {
  padding: 0;
  width: 60px;
  text-align: center;
  font: 500 12px/20px Gotham-Medium;
  margin-bottom: 8px;
}

.vote-info .btn-grey {
  background: var(--blueGrey);
  opacity: 0.5;
}

.vote-info .discussion {
  text-decoration: underline;
  color: var(--blueGrey);
}

.no-claim {
  text-align: center;
  padding: 100px;
  font-size: 20px;
  color: var(--blueGrey);
}

/* 交易 */

.exchange {
  width: calc(100% - 164px);
  margin-bottom: 50px;
  float: left;
  margin-right: 24px;
}

.exchange input {
  width: 100%;
  background: var(--bgColor);
  padding: 16px 50px 16px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.trade .btn {
  width: 140px;
}

.exchange > li {
  float: left;
}

.exchange .basic-group {
  width: calc(50% - 28px);
}

.exchange img {
  margin: 0 16px;
  padding: 14px 0;
  width: 24px;
  cursor: pointer;
}

.target-token {
  line-height: 52px;
}

.history-tab {
  padding-bottom: 16px;
}

.history-tab a {
  margin-right: 48px;
  float: left;
  font: 500 20px/32px Gotham-Medium;
  user-select: none;
  color: rgba(96, 125, 139, 0.5);
}

.history-tab a:last-child {
  margin: 0;
}

.history-tab a.active {
  color: var(--darkColor);
}

.history-info {
  font-size: 14px;
  line-height: 16px;
  padding: 12px 0;
  overflow: hidden;
  border-bottom: 1px solid var(--very-light-blue);
}

.more {
  color: var(--darkColor);
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  display: block;
}

.history-time {
  display: block;
  margin-top: 8px;
  color: var(--blueGrey);
}

#payment .modal-content {
  padding: 24px;
}

.modal-title {
  margin: 8px 0 32px;
}

.token-price {
  float: right;
  margin-top: 32px;
}

.equal {
  display: block;
  text-align: right;
  color: #a9b9c1;
  margin-top: 4px;
}

.modal .target-token {
  color: var(--light-grey-blue);
}

@media (max-width: 767px) {
  .project-detail {
    padding: 32px 0 0;
  }
  .title,
  .release-info {
    padding-bottom: 24px;
  }
  .release-info span,
  .release-info i {
    display: block;
  }
  .pic {
    height: 188px;
  }
  .program-info {
    margin-bottom: 24px;
    padding: 24px 16px 0;
  }
  .program-info li {
    float: none;
    width: 100%;
  }
  .pro-value {
    font-size: 20px;
    margin: 0;
  }
  .pro-key {
    margin-bottom: 24px;
    font-size: 12px;
  }
  .copy-btn {
    margin-top: 12px;
  }
  .detail-info {
    margin-top: 24px;
  }
  .detail-info.fixed {
    padding-top: 60px;
  }
  .tab a {
    max-width: 114px;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
  }
  .detail-info-container {
    padding: 24px 15px 32px;
  }
  .detail-list {
    padding: 0 16px 16px;
    font-size: 12px;
    margin-bottom: 24px;
  }
  .detail-list span {
    max-width: 210px;
  }
  .detail-list p {
    font-size: 12px;
  }
  .submit-claim {
    padding-bottom: 24px;
  }
  .claim-list {
    background: transparent;
    padding: 0 0 24px 0;
    font-size: 12px;
  }
  .submit-claim + ul > .claim-list:first-child,
  .claim-list + .claim-list {
    padding-top: 24px;
  }
  .info-title {
    font-size: 16px;
    line-height: 20px;
  }
  .info-title span {
    font-size: 12px;
  }
  .claim-list .info-title {
    line-height: 32px;
    padding-left: 60px;
    background: url(../../static/img/icon/web_icon_ID.png) no-repeat left
      top/48px;
  }
  .claim-des {
    font-size: 14px;
    line-height: 24px;
  }
  .claim-des.line-limit {
    max-height: 72px;
  }
  .vote-select {
    width: calc(100% - 60px);
    max-width: 160px;
  }
  .exchange {
    float: none;
    width: 100%;
    margin: 0 0 32px;
  }
  .trade > article {
    padding-bottom: 32px;
    border-bottom: 1px solid var(--very-light-blue);
    margin-bottom: 32px;
  }
  .trade .btn {
    margin: 0 auto;
    display: block;
    width: 160px;
  }
  .exchange li {
    float: none;
  }
  .exchange .basic-group {
    width: 100%;
  }
  .exchange .swap-pic {
    position: relative;
    height: 16px;
  }
  .swap-pic img {
    position: absolute;
    right: 0;
    padding: 8px;
    margin: 0;
    bottom: 8px;
    width: 32px;
    height: 32px;
  }
  .history-tab a {
    font-size: 16px;
    margin-right: 24px;
  }
  .collapse-more {
    font-size: 14px;
    line-height: 24px;
  }
}
</style>