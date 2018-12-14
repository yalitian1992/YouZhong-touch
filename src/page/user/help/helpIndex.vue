<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('helpIndex.title')"></topBar>
    <div class="content">
      <div class="tel">
        <p class="num fl">{{$t('helpIndex.serverTel')}}400-887-5699</p>
        <div class="phone fr">
          <span class="icon-phone"></span>
        </div>
      </div>
      <ul class="user-wrapper">
        <router-link :to="{ path: '/payMethod'}">
          <li>{{$t('helpIndex.payMethod')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/returnExplain'}">
          <li>{{$t('helpIndex.returnExplain')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/specialReturnExplain'}">
          <li>{{$t('helpIndex.specialReturnExplain')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/afterSaleServer'}">
          <li>{{$t('helpIndex.afterSaleServer')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/watchAfterSaleServer'}">
          <li>{{$t('helpIndex.watchAfterSaleServer')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/qualityGoodsEnsure'}">
          <li>{{$t('helpIndex.qualityGoodsEnsure')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/packagedGoods'}">
          <li>{{$t('helpIndex.packagedGoods')}}<span class="enter_ico"></span></li>
        </router-link>
      </ul>
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
  .tel {
    height: .65rem;
    line-height: .64rem;
    font-size: .17rem;
    padding: 0 5%;
  }

  .tel .num {
    line-height: .64rem;
  }

  .phone {
    position: absolute;
    right: 5%;
    margin-right: -.1rem;
    top: .1rem;
    padding: .1rem;
  }

  .icon-phone {
    width: .24rem;
    height: .24rem;
    display: block;
    background: url(../../../assets/sprites.png) no-repeat -1.97rem -1.2rem/3rem 1.8rem;

  }

  .user-wrapper {
    font-size: .17rem;
    padding-left: 5%;
    border-top: 1px solid #EFEFEF;
    border-bottom: 1px solid #EFEFEF;
    margin-bottom: .2rem;
  }

  .user-wrapper li {
    position: relative;
    height: .45rem;
    line-height: .45rem;
    border-bottom: 1px solid #EFEFEF;
    color: #000;
  }

  .user-wrapper li:last-child {
    border: none;
  }

  .enter_ico {
    display: block;
    position: absolute;
    right: 5%;
    top: .15rem;
    width: .08rem;
    height: .15rem;
    background: url(../../../assets/sprites.png) no-repeat -2.69rem -.29rem/3rem 1.8rem;
  }
</style>
