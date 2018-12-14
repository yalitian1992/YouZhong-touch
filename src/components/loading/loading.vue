<template>
  <div class="loading-mask" v-show="loadingShow">
    <div class="loading-img"></div>
  </div>
</template>

<script>
  export default {
    props: ['loadingShow'],
    data () {
      return {}
    },
    mounted: function () {
    }
  }
</script>
<style scoped>
  .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1100;
    background: rgba(0, 0, 0, .5);
  }

  /*.loading-mask > div {
    position: absolute;
    width: 1.98rem;
    height: 1.98rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, .8);
    border-radius: .15rem;
  }*/

  .loading-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: .6rem;
    height: .6rem;
    background: url(../../assets/timg.gif) no-repeat center/contain;
  }
</style>
