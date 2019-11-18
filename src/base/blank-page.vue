<template>
  <div class="blank-page">
    <p>{{isApplied?$t("no_claim"):$t('no_project')}}</p>
    <router-link v-if="!isApplied" to="/submitProject">{{$t("to_publish_projects")}}</router-link>
    <router-link v-else to="submitClaim">{{$t("to_submit_claims")}}</router-link>
  </div>
</template>

<script>
export default {
  props: ["isApplied"]
};
</script>

<style>
.blank-page {
  margin: 80px 0 100px;
  color: var(--blueGrey);
  font-size: 16px;
  text-align: center;
}

.blank-page > a {
  color: var(--blueColor) !important;
  padding: 8px 0;
  display: block;
}
</style>
