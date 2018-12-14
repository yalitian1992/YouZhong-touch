<template>
  <div class="nav-bar">
    <div class="nav-btn" :style="{top: top + 'px', left: left + 'px'}" v-show="isBtnShow" @click="openNav"
         @touchmove.prevent="move"></div>
    <div class="mask" v-show="isNavShow" :class="{'open': isOpen}" @click.self="closeNav">
      <ul class="bar">
        <li></li>
        <router-link to="/mallIndex" class="nav-home" tag="li">
          <div>
            <div class="icon-border">
              <div class="icon"></div>
            </div>
            <div class="txt">{{$t('navBar.index')}}</div>
          </div>
        </router-link>
        <router-link to="/classify" class="nav-classify" tag="li">
          <div>
            <div class="icon-border">
              <div class="icon"></div>
            </div>
            <div class="txt">{{$t('navBar.classify')}}</div>
          </div>
        </router-link>
        <router-link to="/auction/brands" class="nav-brand" tag="li">
          <div>
            <div class="icon-border">
              <div class="icon"></div>
            </div>
            <div class="txt">{{$t('navBar.brand')}}</div>
          </div>
        </router-link>
        <router-link to="/shoppingCart" class="nav-cart" tag="li">
          <div>
            <div class="icon-border">
              <div class="icon"></div>
              <div class="num ac" v-show="cartNumShow">{{cartNum}}</div>
            </div>
            <div class="txt">{{$t('navBar.cart')}}</div>
          </div>
        </router-link>
        <router-link to="/userIndex" class="nav-user" tag="li">
          <div>
            <div class="icon-border">
              <div class="icon"></div>
            </div>
            <div class="txt">{{$t('navBar.user')}}</div>
          </div>
        </router-link>
        <router-link to="/search" class="nav-search" tag="li">
          <div>
            <div class="icon-border">
              <div class="icon"></div>
            </div>
            <div class="txt">{{$t('navBar.search')}}</div>
          </div>
        </router-link>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import i18n from '../../config/i18n'
  export default {
    i18n,
    data(){
      return {
        isBtnShow: true,  //打开导航按钮是否显示
        isNavShow: false, //导航是否显示
        isOpen: false,    //是否打开导航
        cartNumShow: false,//购物车物品数量是否显示
        cartNum: 0,       //购物车物品数量
        viewportW: 0,     //视口宽度
        viewportH: 0,     //视口高度
        top: 0,           //打开导航按钮距离视口顶部的距离
        left: 0,          //打开导航按钮距离视口左边的距离
      }
    },
    props: ['sessionToken', 'num'],//sessionStorage中保存的token
    methods: {
      /*打开导航*/
      openNav: function () {
        var _this = this;
        _this.isNavShow = true;
        _this.isBtnShow = false;
        setTimeout(function () {
          _this.isOpen = true;
        }, 10)
      },
      /*关闭导航*/
      closeNav: function () {
        var _this = this;
        _this.isOpen = false;
        setTimeout(function () {
          _this.isNavShow = false;
          _this.isBtnShow = true;
        }, 300)
      },
      /*移动按钮*/
      move: function (e) {
        let w = e.target.offsetWidth;
        this.top = e.touches[0].clientY - w / 2;
        if (this.top <= 0) {
          this.top = 0;
        } else if (this.top >= this.viewportH - w) {
          this.top = this.viewportH - w;
        }
        this.left = e.touches[0].clientX - w / 2;
        if (this.left <= 0) {
          this.left = 0;
        } else if (this.left >= this.viewportW - w) {
          this.left = this.viewportW - w;
        }
        window.sessionStorage.setItem('position', JSON.stringify({top: this.top, left: this.left}));
      }
    },
    watch: {
      sessionToken: function (val) {
        let _this = this;
        if (val) {
          _this.cartNumShow = true;
          _this.cartList(val, function (data) {
            _this.cartNum = data.data.retail_carts.length;
            if (_this.cartNum == 0) {
              _this.cartNumShow = false;
            }
          })
        } else {
          _this.cartNumShow = false;
          _this.cartNum = 0;
        }
      },
      num: function () {
        let _this = this;
        _this.cartList(_this.sessionToken, function (data) {
          _this.cartNumShow = true;
          _this.cartNum = data.data.retail_carts.length;
        })
      }
    },
    mounted(){
      this.viewportW = window.screen.width;
      this.viewportH = window.screen.height;
      this.top = this.viewportH - 200;
      this.left = this.viewportW / 40;
      let position = window.sessionStorage.getItem('position');
      if (position) {
        position = JSON.parse(position);
        this.top = position.top;
        this.left = position.left;
      }
      /*横竖屏切换初始化按钮位置*/
      let _this = this;
      window.addEventListener("orientationchange", function () {
        _this.viewportW = window.screen.width;
        _this.viewportH = window.screen.height;
        _this.top = _this.viewportH - 200;
        _this.left = _this.viewportW / 40;
        window.sessionStorage.removeItem('position');
      }, false);
    }
  }
</script>

<style scoped>
  .nav-bar .nav-btn {
    position: fixed;
    z-index: 100;
    width: .51rem;
    height: .51rem;
    background: url("../../assets/sprites.png") no-repeat -1.6rem -.01rem/3rem 1.8rem;
  }

  .nav-bar .mask {
    position: fixed;
    top: 0;
    left: -1rem;
    right: 0;
    bottom: 0;
    z-index: 100;
    transition: left .3s;
  }

  .nav-bar .mask.open {
    left: 0;
  }

  .nav-bar .bar {
    width: 1rem;
    height: 100%;
    background: rgba(0, 0, 0, .6);
  }

  .nav-bar .bar li {
    height: 12.5%;
    position: relative;
  }

  .nav-bar .bar li > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .icon-border {
    width: .4rem;
    height: .4rem;
    border: 1px solid #fff;
    border-radius: 50%;
    margin-bottom: .04rem;
    position: relative;
  }

  .icon-border .icon {
    width: .25rem;
    height: .25rem;
    margin: .06rem auto 0;
    background: url("../../assets/sprites.png") no-repeat -.01rem -.01rem/3rem 1.8rem;
  }

  .nav-classify .icon {
    background-position: -.28rem 0;
  }

  .nav-brand .icon {
    margin: .07rem 0 0 .05rem;
    background-position: -.54rem 0;
  }

  .nav-cart .icon {
    background-position: -1.34rem 0;
  }

  .nav-cart .num {
    position: absolute;
    top: -.06rem;
    right: -.08rem;
    min-width: .2rem;
    height: .2rem;
    line-height: .2rem;
    background: #99307d;
    border-radius: .1rem;
    font-size: .12rem;
    color: #fff;
    padding: 0 .03rem;
  }

  .nav-user .icon {
    background-position: -1.07rem -.02rem;
  }

  .nav-search .icon {
    background-position: -.81rem -.01rem;
  }

  .nav-bar .txt {
    font-size: .11rem;
    color: #fff;
    text-align: center;
  }
</style>
