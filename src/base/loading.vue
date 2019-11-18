<template>
<div class="loading">
  <div class="content">
    <div class="loader-circle">MDS</div>
    <div class="loader-line-mask">
      <div class="loader-line"></div>
    </div>
  </div>
</div>
</template>

<script>
export default {

}
</script>

<style>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.loading .content {
  position: absolute;
  width: 120px;
  height: 120px;
  padding: 20px;
  line-height: 80px;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff
}

.loader-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  color: #000;
}

.loader-line-mask {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 40px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  overflow: hidden;
  transform-origin: 100% 50%;
  -webkit-mask-image: -webkit-linear-gradient(top, #000000, rgba(0, 0, 0, 0));
  animation: rotate 1.2s infinite linear;
}

.loader-line-mask .loader-line {
  width: 200%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.5);
}

@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@media(max-width: 768px) {

  .loading .content {
    width: 96px;
    height: 96px;
    padding: 16px;
    line-height: 64px;
    font-size: 14px;
  }

  .loader-line-mask {
    width: 32px;
    height: 64px;
    margin-left: -32px;
    margin-top: -32px;
  }
}
</style>
