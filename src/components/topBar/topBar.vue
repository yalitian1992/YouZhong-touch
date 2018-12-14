<template>
  <div class="top-bar">
    <div class="back-icon" v-if="backShow" @click="$router.back()">
      <div></div>
    </div>
    <div class="title ac one-txt-cut" v-if="titleShow">{{title}}</div>
    <slot name='c-con'></slot>
    <slot name='r-btn'></slot>
  </div>
</template>

<script>
  export default {
    props: ['backShow', 'title', 'titleShow']
  }
</script>

<style scoped>
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: .5rem;
    background: #f7f6f6;
    border-bottom: 1px solid #C8C7CC;
  }

  .top-bar .back-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: .52rem;
    height: .5rem;
  }

  .top-bar .back-icon > div {
    width: .12rem;
    height: .22rem;
    margin: .14rem auto;
    background: url("../../assets/sprites.png") no-repeat -2.83rem -.38rem/3rem 1.8rem;
  }

  .top-bar .title {
    font-size: .2rem;
    color: #000;
    line-height: .48rem;
    font-weight: bold;
    margin: 0 .6rem;
  }
</style>
