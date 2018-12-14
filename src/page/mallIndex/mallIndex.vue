<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar>
      <div class="logo" slot="c-con"></div>
      <router-link to="/search" tag="div" class="search fr" slot="r-btn">
        <div></div>
      </router-link>
    </topBar>
    <div class="content">
      <!--轮播图-->
      <swiper class="show-imgs" :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in bannerList" :key="index">
          <div class="img-box" @click="bannerGo(item)">
            <img :src="imgBaseUrl() + item.pic" alt=""/>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <!--专题-->
      <div class="theme">
        <div class="title">{{$t('mallIndex.title')}}</div>
        <ul>
          <li v-for="(item, index) in themeList" :key="index"
              @click="themeGo(item)">
            <div class="img-box">
              <img :src="imgBaseUrl() + item.pic" alt="">
            </div>
            <div class="name">
              <div class="bigTitle">{{item.title}}</div>
              <div>{{item.subtitle}}</div>
            </div>
          </li>
        </ul>
      </div>
      <!--热门品牌-->
      <div class="hot-brand">
        <div class="title">{{$t('mallIndex.hot')}}
          <router-link to="/auction/brands" tag="div" class="arrow-r">
            <div></div>
          </router-link>
        </div>
        <ul class="brand-list clear ac">
          <router-link :to="{path: '/auction/products', query: {brand_id: item.id, from: 'brand'}}" tag="li" class="fl"
                       v-for="(item, index) in hotBrand" :key="index">
            <div class="one-txt-cut">{{item.name}}</div>
            <p>{{item.chinese}}</p>
          </router-link>
        </ul>
      </div>
      <footer class="ac">
        <a class="tel" href="tel:4008875699">{{$t('mallIndex.serverTel')}}：400-887-5699</a>
        <div class="flex">
          <div class="flex-1" @click="download">{{$t('mallIndex.down')}}</div>
          <router-link to="/helpIndex" tag="div" class="flex-1">{{$t('mallIndex.help')}}</router-link>
          <router-link to="/aboutIhaveu" tag="div" class="flex-1">{{$t('mallIndex.about')}}</router-link>
        </div>
        <div class="copyright">{{$t('mallIndex.copy')}}</div>
      </footer>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'
  import {imgBaseUrl, baseUrl} from '../../config/config'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,      //图片域名
        baseUrl,         //接口域名
        loadingShow: true,//loading是否显示
        bannerList: [],  //轮播图
        flashSale: [],   //闪购
        themeList: [],   //专题
        hotBrand: [],    //热门品牌
        swiperOption: {
          autoplay: 4500,
          autoplayDisableOnInteraction: false,
          pagination: ".swiper-pagination"
        },
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      /*跳转到商品列表*/
      searchGoods: function (title, search_params) {
        let params = {
          from: 'mallIndex',
          title: title,
          keyword: search_params.keyword || undefined,
          price_gt: search_params.where.price.gt || undefined,
          price_gteq: search_params.where.price.gteq || undefined,
          price_lt: search_params.where.price.lt || undefined,
          price_lteq: search_params.where.price.lteq || undefined,
          brand_id: search_params.where.brand_id || undefined,
          is_hot: search_params.where.is_hot || undefined,
          is_micro: search_params.where.is_micro || undefined,
          target: search_params.where.target || undefined,
          unsold_count_gt: search_params.where.unsold_count.gt || undefined,
          unsold_count_gteq: search_params.where.unsold_count.gteq || undefined,
          category1_id: search_params.where.category1_id || undefined,
          category2_id: search_params.where.category2_id || undefined,
          category3_id: search_params.where.category3_id || undefined,
          id: search_params.where.id || undefined,
          recommend: search_params.where.recommend || undefined,
        };
        this.$router.push({path: '/auction/products', query: params})
      },
      /*轮播图跳转*/
      bannerGo: function (item) {
        switch (item.link_type) {
          case 1:
            this.searchGoods(item.title, JSON.parse(item.auction_theme.search_params));
            break;
          case 2:
            this.$router.push({name: 'goodsDetails', params: {goods_id: item.link_url}})
            break;
          case 3:
            window.location.href = item.link_url;
            break;
        }
      },
      /*主题跳转*/
      themeGo: function (item) {
        if (item.link_url) {
          window.location.href = item.link_url;
        } else {
          this.searchGoods(item.title, JSON.parse(item.search_params));
        }
      },
      /*下载*/
      download: function () {
        this.clientType(function () {
          window.location.replace('http://m.ihaveu.com/cdn/android/ihaveu_latest.apk');
        }, function () {
          window.location.replace('https://itunes.apple.com/us/app/you-zhong/id506299184?mt=8&uo=4');
        })
      }
    },
    components: {
      topBar,
      swiper,
      swiperSlide,
      navBar,
      loading
    },
    mounted(){
      let _this = this;
      /*页面数据*/
      _this.getIndexData(function (data) {
        _this.loadingShow = false;
        _this.bannerList = data.data.auction_pic_ads;
        _this.flashSale = data.data.pc_flash_buy;
        _this.themeList = data.data.auction_themes;
      })
      /*品牌列表*/
      _this.brandList(function (data) {
        let brandList = data.data.auction_brands;
        window.localStorage.setItem('brandList', JSON.stringify(brandList));
        for (let i = 0, len = brandList.length; i < len; i++) {
          if (brandList[i].recommend == 'hot') {
            _this.hotBrand.push(brandList[i]);
            if (_this.hotBrand.length == 9) {
              break;
            }
          }
        }
      })
      _this.checkLogin(true);
    }
  }
</script>

<style scoped>
  /*头部*/
  .logo {
    width: .71rem;
    height: .25rem;
    background: url("../../assets/sprites.png") no-repeat -1.19rem -.54rem/3rem 1.8rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.12rem 0 0 -.36rem;
  }

  .search {
    width: .57rem;
    height: .5rem;
  }

  .search > div {
    width: .25rem;
    height: .25rem;
    margin: .13rem 0 0 .12rem;
    background: url("../../assets/sprites.png") no-repeat -.89rem -.27rem/3rem 1.8rem;
  }

  /*轮播图*/
  .show-imgs, .theme, .hot-brand {
    border-bottom: 1px solid #C8C7CC;
    margin-bottom: .14rem;
  }

  .show-imgs .img-box {
    padding-top: 50%;
    position: relative;
  }

  .show-imgs .img-box img, .theme img {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
  }

  .theme, .hot-brand {
    border-top: 1px solid #C8C7CC;
  }

  .theme .title, .hot-brand .title {
    height: .42rem;
    line-height: .42rem;
    position: relative;
    font-size: .18rem;
    padding: 0 .2rem;
  }

  .title .arrow-r {
    position: absolute;
    top: 0;
    bottom: 0;
    right: .11rem;
    width: .42rem;
  }

  .arrow-r > div {
    width: .23rem;
    height: .23rem;
    margin: .09rem auto 0;
    background: url("../../assets/sprites.png") no-repeat -.28rem -.53rem/3rem 1.8rem;
  }

  .theme ul {
    padding: 0 .2rem;
  }

  .theme .name {
    height: .42rem;
    color: #2f2f2f;
    font-size: .13rem;
  }

  .name .bigTitle {
    font-size: .16rem;
    padding: .04rem 0;
  }

  .theme .img-box {
    padding-top: 60%;
    position: relative;
  }

  /*热门品牌*/
  .brand-list li {
    width: 33.33%;
    height: .76rem;
    font-size: .13rem;
    padding: .23rem .1rem 0;
    border-top: 1px solid #EFEFEE;
  }

  .brand-list li div, .brand-list li p {
    line-height: .15rem;
  }

  .brand-list li p {
    font-size: .12rem;
    color: #8e8e8e;
  }

  /*底部*/
  footer {
    padding: .17rem 0 .25rem;
    font-size: .12rem;
    color: #888;
  }

  footer .tel {
    display: inline-block;
    color: #2f2f2f;
    font-size: .14rem;
    line-height: .30rem;
  }

  footer .flex {
    padding: 0 .3rem;
    margin-bottom: .08rem;
  }

  footer .flex > div, footer .copyright {
    line-height: .15rem;
  }

  footer .flex > div {
    padding: .07rem 0;
  }
</style>
<style>
  /*轮播图*/
  .show-imgs.swiper-container-horizontal > .swiper-pagination-bullets {
    font-size: 0;
    bottom: .1rem;
  }

  .show-imgs.swiper-container-horizontal .swiper-pagination-bullet {
    width: .05rem;
    height: .05rem;
    box-shadow: 0 0 1px rgba(0, 0, 0, .5);
    background: rgba(255, 255, 255, .45);
    opacity: 1;
  }

  .show-imgs.swiper-container-horizontal .swiper-pagination-bullet-active {
    background: #fff;
  }
</style>
