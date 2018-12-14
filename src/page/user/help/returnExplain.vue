<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('returnExplain.title')"></topBar>
    <div class="content">
      <div class="help-explain">
        <h2>1.&nbsp;{{$t('returnExplain.con1')}}</h2>
        <p>{{$t('returnExplain.con2')}}</p>
        <h2>2.&nbsp;{{$t('returnExplain.con3')}}</h2>
        <p>{{$t('returnExplain.con4')}}<br>
           {{$t('returnExplain.con5')}}<br>
           {{$t('returnExplain.con6')}}<br>
           {{$t('returnExplain.con7')}}
        </p>
        <h2>3.&nbsp;{{$t('returnExplain.con8')}}</h2>
        <p>{{$t('returnExplain.con9')}}<br>
          {{$t('returnExplain.con10')}}</p>
        <h2>4.&nbsp;{{$t('returnExplain.con11')}}</h2>
        <p>{{$t('returnExplain.con12')}}<br>
          {{$t('returnExplain.con13')}}<br>
          {{$t('returnExplain.con14')}}<br>
          {{$t('returnExplain.con15')}}<br>
          {{$t('returnExplain.con16')}}<br>
          {{$t('returnExplain.con17')}}<br>
          {{$t('returnExplain.con18')}}<br>
          {{$t('returnExplain.con19')}}<br>
          {{$t('returnExplain.con20')}}</p>
      </div>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../../components/topBar/topBar.vue'
  import navBar from '../../../components/navBar/navBar.vue'
  import i18n  from '../../../config/i18n'
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

