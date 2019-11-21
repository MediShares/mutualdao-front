<template>
  <div class="blank-page">
    <p>{{isApplied?$t("no_claim"):$t('no_project')}}</p>
    <router-link v-if="!isProject" to="/project">{{$t("to_view_others")}}</router-link>
  </div>
</template>

<script>
export default {
  props: ["isApplied", "isProject"]
};
</script>

<style>
.blank-page {
  padding: 80px 0 100px;
  color: var(--blueGrey);
  font-size: 16px;
  text-align: center;
  min-height: calc(100vh - 926px);
}

.blank-page > a {
  color: var(--blueColor) !important;
  padding: 8px 0;
  display: block;
}
</style>
