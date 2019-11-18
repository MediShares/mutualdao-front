<template>
<!-- 底部 -->
<footer class="foot">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-4 medi-shares">
        <img src="static/img/icon/foot_logo@2x.png">
      </div>
        <div class="col-xs-12 col-sm-4">
          <ul class="contact-list">
            <li class="col-xs-6 col-sm-12">
              <a :href="$t('telegram_link')" target="_blank">
              <span class="contact-icon"><img src="static/img/foot/sns_icon_telegram@2x.png"></span>
              <span>Telegram</span>
            </a>
            </li>
            <li class="col-xs-6 col-sm-12">
              <a href="https://github.com/MediShares" target="_blank">
              <span class="contact-icon"><img src="static/img/foot/sns_icon_github@2x.png"></span>
              <span>GitHub</span>
            </a>
            </li>
            <li class="col-xs-6 col-sm-12">
              <a :href="$t('twitter_link')" target="_blank">
              <span class="contact-icon"><img src="static/img/foot/sns_icon_twitter@2x.png"></span>
              <span>Twitter</span>
            </a>
            </li>
            <li class="col-xs-6 col-sm-12">
              <a :href="$t('weibo_kakao_link')" target="_blank">
              <span class="contact-icon"><img :src="$t('weibo_kakao_icon')"></span>
              <span>{{$t('weibo_kakao')}}</span>
            </a>
            </li>
            <li class="col-xs-6 col-sm-12">
              <a href="mailto:hello@medishares.org">
              <span class="contact-icon"><img src="static/img/foot/sns_icon_email@2x.png"></span>
              <span>{{$t('email')}}</span>
            </a>
            </li>
            <li class="col-xs-6 col-sm-12">
              <a :href="$t('blog_link')" target="_blank">
              <span class="contact-icon"><img src="static/img/foot/sns_icon_blog@2x.png"></span>
              <span>{{$t('blog')}}</span>
              </a>
            </li>
            <li class="col-xs-6 col-sm-12">
              <a href="javascript:;" class="qq" @mouseover="qrcodeShow" @mouseout="qrcodeHide">
              <span class="contact-icon"><img :src="$t('qq_kakao_icon')"></span>
              <span>{{$t('qq_kakao')}}</span>
              <div class="qq-code" v-show='isShow_qq'><img :src="$t('qq_kakao_code')" width="100%"></div>
            </a>
            </li>
          </ul>
        </div>
        <div class="col-xs-8 col-sm-2 code-img">
          <img :src="$t('group_icon')" width="100%">
          <div class="code-tip">{{$t('join_group')}}</div>
        </div>
      </div>
      <div class="center-align copyright">© 2017 MediShares Foundation Ltd. All rights reserved. <a style="color:var(--blueGrey);text-decoration: underline;" href="http://medishares.oss-cn-hongkong.aliyuncs.com/media/MDS_media_kit.zip">Download Media Kit</a></div>
    </div>
</footer>
</template>

<script>
export default {
  data() {
    return {
      isShow_qq: false
    }
  },
  methods: {
    qrcodeShow() {
      this.isShow_qq = true
    },
    qrcodeHide() {
      this.isShow_qq = false
    }
  }
}
</script>

<style scoped>
footer {
  background-color: var(--darkColor);
  padding: 120px 0 48px;
}

footer .row {
  padding-bottom: 120px;
}

footer .medi-shares {
  margin: 0;
}

footer .medi-shares>img {
  height: 40px;
}

footer .contact-list>li {
  margin-top: 24px;
  position: relative;
}

footer .contact-list .qq-code {
  position: absolute;
  left: 15px;
  bottom: 50px;
  width: 200px;
}

footer .contact-list>li:first-of-type {
  margin-top: 0;
}

footer .contact-list a {
  display: block;
}

footer .contact-icon {
  width: 40px;
  height: 40px;
  -moz-border-radius: 50%;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  margin-right: 16px;
  vertical-align: middle;
  overflow: hidden;
}

footer .contact-icon>img {
  width: 100%;
}

footer .contact-icon+span {
  font-family: Gotham-Medium;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.25;
  color: var(--blueGrey);
  vertical-align: middle;
}

.code-tip {
  font-family: Gotham-Medium;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.33;
  color: var(--blueGrey);
  margin-top: 24px;
  white-space: nowrap;
}

.copyright {
  font-size: 14px;
  line-height: 1.43;
  color: var(--blueGrey);
  text-align: center;
}

@media (max-width: 767px) {
  footer {
    padding: 80px 15px 40px;
  }

  footer .medi-shares {
    margin-bottom: 60px;
  }

  footer .contact-list>li {
    padding: 0;
  }

  footer .contact-list>li:nth-of-type(2) {
    margin-top: 0;
  }

  footer .contact-icon {
    margin-right: 12px;
  }

  footer .code-img {
    margin-top: 80px;
  }

  footer .code-tip {
    margin-top: 16px;
  }

  footer .row {
    padding-bottom: 80px;
  }

  footer .contact-list .qq-code {
    left: 0;
    width: 150px;
  }
}

/*小于等于360px屏幕*/

@media (max-width: 360px) {
  footer .contact-icon {
    margin-right: 3px;
  }

  footer .contact-icon+span {
    font-size: 14px;
  }
}
</style>
