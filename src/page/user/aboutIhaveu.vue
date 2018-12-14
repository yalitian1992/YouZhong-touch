<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('aboutIhaveu.title')"></topBar>
    <div class="content">
      <div class="about-tit"><span class="icon-phone icon"></span>{{$t('aboutIhaveu.aboutTit')}}</div>
      <div class="app-download clearfix">
        <div class="left"></div>
        <div class="right">
          <p class="ext">{{$t('aboutIhaveu.code')}}<br>APP2016</p>
          <p class="red-bag">
            <span>{{$t('aboutIhaveu.receive')}}</span>
            <span class="span1">1888</span>
            <span>{{$t('aboutIhaveu.redPacket')}}</span>
            <span class="span2"></span>
          </p>
          <button><span class="icon icon-android"></span>{{$t('aboutIhaveu.adr')}}</button>
          <button><span class="icon icon-ios"></span>{{$t('aboutIhaveu.ios')}}</button>
        </div>
      </div>
      <div class="about-tit">
        <span class="icon-diamond icon"></span>{{$t('aboutIhaveu.title1')}}<span class="gold_bag"> | {{$t('aboutIhaveu.con')}}</span>
      </div>
      <div class="step step1">
        <span class="icon-step">01</span>
      </div>
      <div class="step step2">
        <span class="icon-step">02</span>
      </div>
      <div class="step step3">
        <span class="icon-step">03</span>
      </div>
      <div class="step step4">
        <span class="icon-step">04</span>
      </div>
      <div class="step step5">
        <span class="icon-step">05</span>
      </div>
      <div class="step step6">
        <span class="icon-step">06</span>
      </div>
      <div class="step step7">
        <span class="icon-step">07</span>
      </div>
      <div class="step step8">
        <span class="icon-step">08</span>
      </div>
      <div class="step step9">
        <span class="icon-step">09</span>
      </div>
      <div class="step step10">
        <span class="icon-step">10</span>
      </div>
      <div class="mot"></div>
      <p class="hot-tel">{{$t('aboutIhaveu.tel')}}<span>400-887-5699</span></p>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import i18n from '../../config/i18n'
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
.about-tit {
  position: relative;
  height: .45rem;
  font-size: .17rem;line-height: .45rem;
  background: #eee;
  border: 1px solid #E3E3E3;
  padding-left: 5%;
}
.icon {
  display: inline-block;
  position: relative;

}
.icon-phone {
  height: .17rem;
  width: .12rem;
  top: .03rem;
  margin-right: .05rem;
  background: red;
  background: url(../../assets/sprites.png) no-repeat -.73rem -1.42rem/3rem 1.8rem;
}
.icon-diamond {
  height: .20rem;
  width: .22rem;
  top: .05rem;
  margin-right: .03rem;
  background: red;
  background: url(../../assets/sprites.png) no-repeat -.26rem -1.40rem/3rem 1.8rem;
}
.icon-android {
  width: .17rem;
  height: .19rem;
  position: relative;
  top: .05rem;
  display: inline-block;
  margin-right: .05rem;
  background: red;
  background: url(../../assets/sprites.png) no-repeat -.53rem -.27rem/3rem 1.8rem;
}
.icon-ios {
  width: .14rem;
  height: .19rem;
  position: relative;
  top: .03rem;
  display: inline-block;
  margin-right: .05rem;
  background: red;
  background: url(../../assets/sprites.png) no-repeat -.72rem -.26rem/3rem 1.8rem;
}
.app-download {
  color: #2f2f2f;
  font-size: .14rem;
  height: 2.34rem;
  padding-top: .2rem;
  margin-bottom: .2rem;
  padding-right: 2.5%;
  background-image: -webkit-linear-gradient(90deg,#ede8da,#f3f1eb);
}
.app-download .left {
  float: left;
  width: 1.62rem;
  height: 2.14rem;
  background: url(../../assets/iphone_nexus@2x.png) no-repeat center/contain;
  margin: 0 -.1rem 0 2.8%;
}
.app-download .right {
  text-align: center;
  float: right;
  width: 1.62rem;
  height: 2.14rem;
  padding-top: .06rem;
}
p.ext {
  line-height: .21rem;
}
.red-bag {
  color: #cc1e91;
  margin-top: -.1rem;
}
.red-bag .span1 {
  font-size: .24rem;
  margin-left: -.05rem;
  margin-right: -.03rem;
  display: inline-block;
}
.red-bag .span2 {
  position: relative;
  top: .1rem;
  background: url(../../assets/download_bounus.png) center no-repeat;
  background-size: contain;
  margin-left: -.05rem;
  width: .28rem;
  height: .33rem;
  display: inline-block;
}
span.gold_bag {
  color: #8e8e8e;
  font-size: .15rem;
}
button {
  color: #fff;
  width: 1.42rem;
    height: .3rem;
    line-height: .3rem;
    font-size: .13rem;
    font-weight: bold;
    text-align: left;
    margin-top: .15rem;
    padding-left: .1rem;
    background: #000;
    border-radius: .05rem;
}
.step {
  width: 100%;
  height: 2.36rem;
  background: pink;
}
.step.step1 {
  background: url(../../assets/one@2x.png) no-repeat center/3.2rem 2.36rem;
}
.step.step2 {
  background: url(../../assets/two.png) no-repeat center/3.2rem 2.36rem;
}
.step.step3 {
  background: url(../../assets/three.png) no-repeat center/3.2rem 2.36rem;
}
.step.step4 {
  background: url(../../assets/four.png) no-repeat center/3.2rem 2.36rem;
}
.step.step5 {
  background: url(../../assets/five.png) no-repeat center/3.2rem 2.36rem;
}
.step.step6 {
  background: url(../../assets/six.png) no-repeat center/3.2rem 2.36rem;
}
.step.step7 {
  background: url(../../assets/seven.png) no-repeat center/3.2rem 2.36rem;
}
.step.step8 {
  background: url(../../assets/eight.png) no-repeat center/3.2rem 2.36rem;
}
.step.step9 {
  background: url(../../assets/nine.png) no-repeat center/3.2rem 2.36rem;
}
.step.step10 {
  background: url(../../assets/ten.png) no-repeat center/3.2rem 2.36rem;
}
.icon-step {
  float: right;
  right: 5%;
  display: inline-block;
  padding-top: .01rem;
  width: .25rem;
  height: .25rem;
  position: relative;
  top: .16rem;
  line-height: .22rem;
  text-align: center;
  font-size: .12rem;
  color: #fff;
  background: url(../../assets/sprites.png) no-repeat -1.58rem -1.69rem/3.3rem 1.98rem;
}
.mot {
  width: 2.4rem;
  height: .42rem;
  margin: .48rem auto 0;
  background: url(../../assets/slogan@2x.png) no-repeat center/2.4rem .42rem;
}
.hot-tel {
  font-size: .14rem;
  color: #2f2f2f;
  margin: .27rem 0 .5rem;
  text-align: center;
}
.hot-tel span {
  color: #010101;
  display: inline-block;
  margin-left: .07rem;
}
</style>
