<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('specialReturnExplain.title')"></topBar>
    <div class="content">
      <div class="help-explain">
        <h2>1.&nbsp;{{$t('specialReturnExplain.con1')}}</h2>
        <p>{{$t('specialReturnExplain.con2')}}</p>
        <h2>2.&nbsp;{{$t('specialReturnExplain.con3')}}</h2>
        <p>{{$t('specialReturnExplain.con4')}}</p>
        <h2>3.&nbsp;{{$t('specialReturnExplain.con5')}}</h2>
        <p>{{$t('specialReturnExplain.con6')}}</p>
        <h2>4.&nbsp;{{$t('specialReturnExplain.con7')}}</h2>
        <p>{{$t('specialReturnExplain.con8')}}<br>
          {{$t('specialReturnExplain.con9')}}<br>
          {{$t('specialReturnExplain.con10')}}<br>
          {{$t('specialReturnExplain.con11')}}
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

