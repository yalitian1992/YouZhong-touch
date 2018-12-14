<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('qualityGoodsEnsure.title')"></topBar>
    <div class="content">
      <div class="help-explain">
        <p>{{$t('qualityGoodsEnsure.con1')}}</p>
        <h2>{{$t('qualityGoodsEnsure.con2')}}</h2>
        <p>{{$t('qualityGoodsEnsure.con3')}}</p>
        <h2>{{$t('qualityGoodsEnsure.con4')}}</h2>
        <p>{{$t('qualityGoodsEnsure.con5')}}</p>
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
