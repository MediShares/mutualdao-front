<template>
<!-- 联系我们 -->
<div class="contact">
  <a href="mailto:hello@medishares.org" class="container">
    <div class="icon">👏</div>
    <div class="contact-info">
      <h4>{{$t('contact_title')}}</h4>
      <p>{{$t('contact_info')}} <span>hello@medishares.org</span></p>
    </div>
  </a>
</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.contact {
  background: var(--primaryColor);
  padding: 32px 0;
}

.contact a {
  color: #fff;
  display: block;
  position: relative;
  padding-left: 85px;
  max-width: 800px;
}

.contact .icon {
  width: 54px;
  height: 54px;
  font-size: 32px;
  padding: 10px 0 0 10px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
}

h4 {
  font-size: 20px;
  padding-bottom: 8px;
  font-family: Gotham-Medium;
  font-weight: 500;
}

.contact span {
  text-decoration: underline;
}

@media(max-width: 768px) {
  .contact {
    padding: 24px 0;
  }
}
</style>
