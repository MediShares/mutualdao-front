<template>
  <div class="modal" id="successModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content text-center">
        <button type="button" class="close" data-dismiss="modal">
          <span aria-hidden="true">&times;</span>
        </button>
        <img src="static/img/icon/web_icon_success.png" width="92" />
        <h4 class="modal-title">{{$t(title)}}</h4>
        <p class="info" v-if="info">{{info}}</p>
        <router-link
          v-if="link"
          :to="link"
          data-dismiss="modal"
          class="modal-close"
        >{{$t('confirm')}}</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "info", "link"]
};
</script>
<style scoped>
#successModal .modal-title {
  margin-bottom: 32px;
}
.modal .info {
  color: var(--blueGrey);
  font-size: 16px;
  line-height: 24px;
  margin: -26px 0 40px;
}
</style>