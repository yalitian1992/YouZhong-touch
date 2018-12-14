<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('userIndex.title')"></topBar>
    <div class="content">
      <div class="user-detail">
        <p class="user-name">{{userData.name || userData.phone}}</p>
        <ul class="user-lever">
          <li>{{$t('userIndex.level')}} {{userData.level.name}}{{$t('userIndex.user')}}</li>
        </ul>
        <span class="right logout_ico" data-href="/logout" @click="loginOutHttp">
          <span class="sprites"></span>
        </span>
      </div>
      <ul class="user-wrapper">
        <router-link :to="{ path: '/orderManage'}">
          <li>{{$t('userIndex.orderManage')}}<span class="icon-amount" v-show="countTradesShow">{{userData.count_trades}}</span><span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/orderManage', query: {from: 'logistics'}}">
          <li>{{$t('userIndex.logistics')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/myVoucher'}">
          <li>{{$t('userIndex.myVoucher')}}<span class="icon-amount" v-show="countVouchersShow">{{userData.count_vouchers}}</span><span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/goodsCollection'}">
          <li>{{$t('userIndex.goodsCollection')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/brandCollection'}">
          <li>{{$t('userIndex.brandCollection')}}<span class="enter_ico"></span></li>
        </router-link>
      </ul>
      <ul class="user-wrapper">
        <router-link :to="{ path: '/helpIndex'}">
          <li>{{$t('userIndex.helpIndex')}}<span class="enter_ico"></span></li>
        </router-link>
        <router-link :to="{ path: '/aboutIhaveu'}">
          <li>{{$t('userIndex.aboutIhaveu')}}<span class="enter_ico"></span></li>
        </router-link>
      </ul>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        loadingShow: true,//loading是否显示
        userData: {
          name: '',
          level: {
            name: ''
          }
        },
        countTradesShow: false, //订单数目显示
        countVouchersShow: false, //优惠券数目显示
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    components: {
      topBar,
      navBar,
      loading
    },
    methods: {
      userDetailsHttp: function(){
        var _this = this;
        _this.userDetails(this.sessionToken, function(data){
          _this.userData = data.data.auction_users;
          if (_this.userData.count_trades > 0) {
              _this.countTradesShow = true;
          }
          if (_this.userData.count_vouchers > 0) {
            _this.countVouchersShow = true;
          }
          _this.loadingShow = false;
        })
      },
      loginOutHttp: function(){
        var _this = this;
        _this.loginOut(_this.sessionToken, function(data){
          window.sessionStorage.removeItem('token');
          window.localStorage.removeItem('loginInfo');
          _this.goToLogin();
        })
      }
    },
    mounted(){
      this.checkLogin(true,this.userDetailsHttp);
    }
  }
</script>

<style scoped>
.user-detail {
  position: relative;
  color: #fff;
  height: .95rem;
  background: url(../../assets/center_bg.jpg) no-repeat center/100%;
}
.user-name {
    font-size: .2rem;
    color: #fefefe;
    text-align: left;
    padding-top: .25rem;
    margin-left: 5%;
    width: 75%;
}
ul.user-lever {
  font-size: .13rem;
  margin: 0 5%;
  overflow: hidden;
  padding-top: .05rem;
}
ul.user-lever li {
  float: left;
}
.logout_ico {
    display: block;
    position: absolute;
    right: 5%;
    top: .25rem;
    padding: .12rem;
}
.logout_ico span {
    width: .22rem;
    height: .25rem;
    display: block;
    background: url(../../assets/sprites.png) no-repeat -.01rem -.52rem/3rem 1.8rem;
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
    background: url(../../assets/sprites.png) no-repeat -2.69rem -.29rem/3rem 1.8rem;
}
.icon-amount {
  display: inline-block;
  margin-left: .1rem;
  width: .16rem;
  height: .16rem;
  color: #fff;
  text-align: center;
  font-size: .13rem;
  line-height: .16rem;
  border-radius: .16rem;
  background: #911573;
  position: relative;
  top: -.02rem;
}
</style>
