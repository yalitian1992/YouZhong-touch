<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('watchAfterSaleServer.title')"></topBar>
    <div class="content">
      <div class="help-explain">
        <h2>1.&nbsp;{{$t('watchAfterSaleServer.con1')}}</h2>
        <p>{{$t('watchAfterSaleServer.con2')}}<br>
          {{$t('watchAfterSaleServer.con3')}}<br>
          {{$t('watchAfterSaleServer.con4')}}<br>
          {{$t('watchAfterSaleServer.con5')}}<br>
          {{$t('watchAfterSaleServer.con6')}}<br>
          {{$t('watchAfterSaleServer.con7')}}<br>
          {{$t('watchAfterSaleServer.con8')}}
        </p>
        <h2>2.&nbsp;{{$t('watchAfterSaleServer.con9')}}</h2>
        <p>{{$t('watchAfterSaleServer.con10')}}<br>
          {{$t('watchAfterSaleServer.con11')}}
        </p>
        <h2>3.&nbsp;{{$t('watchAfterSaleServer.con12')}}</h2>
        <p>{{$t('watchAfterSaleServer.con13')}}<br>
          {{$t('watchAfterSaleServer.con14')}}<br>
          {{$t('watchAfterSaleServer.con15')}}<br>
          {{$t('watchAfterSaleServer.con16')}}<br>
          {{$t('watchAfterSaleServer.con17')}}<br>
          {{$t('watchAfterSaleServer.con18')}}
        </p>
        <h2>4.&nbsp;{{$t('watchAfterSaleServer.con19')}}</h2>
        <p>{{$t('watchAfterSaleServer.con20')}}<br>
          {{$t('watchAfterSaleServer.con21')}}<br>
          {{$t('watchAfterSaleServer.con22')}}<br>
          {{$t('watchAfterSaleServer.con23')}}<br>
          {{$t('watchAfterSaleServer.con24')}}<br>
          {{$t('watchAfterSaleServer.con25')}}
        </p>
        <h2>5.&nbsp;{{$t('watchAfterSaleServer.con26')}}</h2>
        <p>{{$t('watchAfterSaleServer.con27')}}<br>
          {{$t('watchAfterSaleServer.con28')}}<br>
          {{$t('watchAfterSaleServer.con29')}}<br>
          {{$t('watchAfterSaleServer.con30')}}<br>
          {{$t('watchAfterSaleServer.con31')}}<br>
          {{$t('watchAfterSaleServer.con32')}}<br>
          {{$t('watchAfterSaleServer.con33')}}<br>
          {{$t('watchAfterSaleServer.con34')}}<br>
          {{$t('watchAfterSaleServer.con35')}}
        </p>
        <h2>6.&nbsp;{{$t('watchAfterSaleServer.con36')}}</h2>
        <p>{{$t('watchAfterSaleServer.con37')}}<br>
          {{$t('watchAfterSaleServer.con38')}}<br>
          {{$t('watchAfterSaleServer.con39')}}<br>
          {{$t('watchAfterSaleServer.con40')}}<br>
          {{$t('watchAfterSaleServer.con41')}}
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
