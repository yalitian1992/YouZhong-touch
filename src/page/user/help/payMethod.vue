<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('payMethod.title')"></topBar>
    <div class="content">
      <div class="help-explain">
        <p>{{$t('payMethod.methods')}}</p>
        <p>{{$t('payMethod.con1')}}</p>
        <p>{{$t('payMethod.con2')}}</p>
      </div>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../../components/topBar/topBar.vue'
  import navBar from '../../../components/navBar/navBar.vue'
  import i18n from '../../../config/i18n'
  export default {
    i18n,
    data() {
      return {
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    components: {
      topBar,
      navBar
    },
    mounted(){
      this.checkLogin(true);
    }
  }
</script>

<style scoped>
/* 样式在帮助首页 */
</style>
