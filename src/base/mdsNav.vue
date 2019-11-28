<template>
  <div :class="[{ishome:isHome},'mds-nav']">
    <nav class="header-nav">
      <div class="container">
        <router-link to="/" class="navbar-brand">MutualDAO</router-link>
        <div v-show="!account" class="login pull-right" @click="login">{{$t("login")}}</div>
        <div v-if="account" class="dropdown personal pull-right">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button">
            <span class="currentAccount">{{account.name}}</span>
            <span class="tri"></span>
          </a>
          <ul class="dropdown-menu">
            <li>
              <router-link to="/myProject">{{$t("created_projects")}}</router-link>
            </li>
            <li>
              <router-link to="/projectJoined">{{$t("joined_projects")}}</router-link>
            </li>
            <li>
              <router-link to="/projectApplied">{{$t("apply_projects")}}</router-link>
            </li>
            <li>
              <a href="javascript:;" @click="logoutByScatter">{{$t("logout")}}</a>
            </li>
          </ul>
        </div>
        <div class="dropdown lang pull-right">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button">
            {{$t("lang")}}
            <span class="tri"></span>
          </a>
          <ul class="dropdown-menu">
            <li @click="setLang('cn')">中文</li>
            <li @click="setLang('en')">English</li>
            <li @click="setLang('ko')">한국어</li>
          </ul>
        </div>
      </div>
    </nav>
    <login-modal></login-modal>
  </div>
</template>

<script>
import loginModal from "base/login-modal";
import { mapActions } from "vuex";
export default {
  name: "mdsNav",
  data() {
    return {
      isHome: false
    };
  },
  mounted() {
    this.isHomePage();
    // 导航固定
    this.navFix();
    $(window).scroll(() => {
      this.navFix();
    });
  },
  methods: {
    ...mapActions(["setLang", "logout"]),
    isHomePage() {
      if (this.$route.path == "/") {
        this.isHome = true;
      } else {
        this.isHome = false;
      }
    },
    login() {
      $("#login").modal("show");
    },
    logoutByScatter() {
      this.sctuser.logout().then(
        res => {
          this.logout();
        },
        err => {
          this.$toast(this.$t("connect_scatter"));
        }
      );
    },
    navFix() {
      if (
        $(window).scrollTop() >=
        $(".mds-top").outerHeight() - $(".header-nav").outerHeight()
      ) {
        $(".header-nav").addClass("scroll-nav");
      } else {
        $(".header-nav").removeClass("scroll-nav");
      }
    }
  },
  watch: {
    $route(to, from) {
      if (this.$route.path == "/") {
        this.isHome = true;
      } else {
        this.isHome = false;
      }
    }
  },
  components: {
    loginModal
  }
};
</script>

<style scoped>
.mds-nav {
  height: 50px;
}

.mds-nav.ishome {
  height: 0;
}

.header-nav {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  text-align: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.ishome .header-nav {
  background: transparent;
  box-shadow: none;
  position: absolute;
}

.ishome .scroll-nav {
  background: #020308;
  position: fixed;
  color: #fff;
}

.header-nav a {
  color: var(--darkColor);
  text-transform: capitalize;
}

.ishome a {
  color: #fff !important;
}

.navbar-brand {
  font-size: 20px;
  padding: 15px 0;
}

.header-nav a:hover,
.header-nav a:focus,
nav .open > a {
  background: transparent !important;
}
.dropdown > a {
  display: inline-block;
  padding: 15px;
}
.lang li {
  padding: 6px 16px;
}
.personal > a {
  text-transform: none;
}
.header-nav .dropdown-menu {
  min-width: auto;
  text-align: center;
  border: none;
}
.dropdown-menu li,
.dropdown-menu a {
  color: var(--darkColor) !important;
  cursor: pointer;
  user-select: none;
}

.personal .dropdown-menu {
  width: 300px;
  padding: 0;
}
.personal .dropdown-menu > li > a {
  padding: 24px 0;
  border-bottom: 1px solid var(--bgColor);
  font-family: Gotham-Medium;
  font-weight: 500;
}
.personal .dropdown-menu > li:last-of-type > a {
  border: none;
}
.login {
  padding: 6px 10px;
  border: 1px solidvar(--darkColor);
  border-radius: 4px;
  margin: 8px 10px;
  text-transform: capitalize;
  cursor: pointer;
}
.ishome .login {
  border: 1px solid #fff;
  color: #fff;
}
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 14px;
  }
  .dropdown > a {
    padding: 15px 0 15px 10px;
  }
  .lang > a {
    padding-left: 0;
  }
  .personal .dropdown-menu {
    width: calc(100vw - 30px);
  }
}
</style>
