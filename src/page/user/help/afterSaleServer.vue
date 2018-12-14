<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('afterSaleServer.title')"></topBar>
    <div class="content">
      <div class="help-explain">
        <h2>1.&nbsp;{{$t('afterSaleServer.term')}}</h2>
        <p>{{$t('afterSaleServer.termCon')}}</p>
        <h2>2.&nbsp;{{$t('afterSaleServer.con')}}</h2>
        <p>{{$t('afterSaleServer.con1')}}<br/>{{$t('afterSaleServer.con2')}}<br>
          {{$t('afterSaleServer.con3')}}<br>
          {{$t('afterSaleServer.con4')}}<br>
          {{$t('afterSaleServer.con5')}}<br>
          {{$t('afterSaleServer.con6')}}<br>
          {{$t('afterSaleServer.con7')}}<br>
          {{$t('afterSaleServer.con8')}}
        </p>
        <h2>3.&nbsp;{{$t('afterSaleServer.noServer')}}</h2>
        <p>{{$t('afterSaleServer.noServer1')}}<br>
          {{$t('afterSaleServer.noServer2')}}<br>
          {{$t('afterSaleServer.noServer3')}}<br>
          {{$t('afterSaleServer.noServer4')}}<br>
        </p>
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
