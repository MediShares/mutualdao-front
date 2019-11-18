<template>
  <div class="myproject-list">
    <!-- 我申请的互助 -->
    <router-link :to="{path: '/projectDetail',query: {id: info.project.ID}}" v-if="isApplied">
      <div class="list-pic" :style="{backgroundImage: 'url(' + info.project.img +')'}"></div>
      <div class="info">
        <h4>{{info.project.title}}</h4>
        <ul class="time">
          <li>{{$t('status')}}：{{info.flagDeleted==1?$t('deleted'):(info.status==0?$t('voting'):$t('executed'))}}</li>
          <li>{{$t('claim_time')}}：{{info.createDate}}</li>
          <li>{{$t('claim_amount')}}：{{info.amount}} {{info.project.token}}</li>
        </ul>
        <p class="btn-box">
          <span>{{$t('view')}}</span>
          <span
            v-if="info.flagDeleted==0"
            class="delete"
            @click.prevent="deleteProject"
          >{{$t('delete')}}</span>
        </p>
      </div>
    </router-link>
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
            <span
              :class="{'main-color':info.remaining<=0}"
            >{{info.remaining>0?$t('waiting_period').replace('%d',info.remaining):$t('effectivity')}}</span>
          </li>
          <li>{{$t('join_time')}}：{{info.createDate}}</li>
          <li>{{$t('mutual_aid_balance')}}：{{info.amount}} {{info.project.token}}</li>
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
  props: ["index", "isJoined", "isApplied", "flagDeleted", "info"],
  methods: {
    deleteProject() {
      this.$emit(
        "deleteItem",
        this.index,
        this.info.ID,
        this.info.project.targetAccount
      );
    }
  }
};
</script>

<style scoped>
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
