<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true">
      <div class="name ac vc ha" slot="c-con">
        <div class="txt-cut">{{goodsDetails.name}}</div>
      </div>
    </topBar>
    <div class="content">
      <!--提示-->
      <div class="tips ac" v-if="tipShow">【{{goodsDetails.label}}】</div>
      <!--轮播图-->
      <swiper class="show-img" :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in goodsImgs" :key="index">
          <div class="img-box">
            <img :src="imgBaseUrl()+item.large" alt=""/>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <!--颜色、尺码-->
      <div class="sku-color ac" v-if="skuColorShow">
        <div class="heading">
          <div class="color" :class="{open: colorShow, 'two-choose': colorList != ''}" v-if="colorList != ''"
               @click="openChoose('color')">{{$t('goodsDetails.color')}}
            <div class="arrow" v-show="colorShow"></div>
          </div>
          <div class="sku" :class="{open: skuShow}" @click="openChoose('sku')">{{$t('goodsDetails.size')}}<span
            v-show="selectedSku">{{selectedSku}}</span>
            <div class="arrow" v-show="skuShow"></div>
          </div>
        </div>
        <div class="con hb" v-if="colorList != ''" v-show="colorShow">
          <ul class="color-list clear">
            <li class="fl" :class="{active: item.id == $route.params.goods_id}" v-for="(item, index) in colorList"
                @click="goNextGoods(item.id)" :key="index"><img
              :src="imgBaseUrl() + item.color_pic + '.m220.' + item.color_pic.split('.').reverse()[0]"
              alt=""></li>
          </ul>
        </div>
        <div class="con hb" v-show="skuShow">
          <ul class="sku-list clear">
            <li class="fl" :class="{active: index === skuIndex, 'no-amount': item.amount == 0}"
                v-for="(item, index) in skuList"
                @click="chooseSku(index)" :key="index">{{item.name}}<span v-show="item.amount == 0"></span>
            </li>
          </ul>
          <div class="text vc" @click="goSkuIntro">
            <div>
              <div class="icon"></div>
              <div class="txt">{{$t('goodsDetails.sizeIntro')}}</div>
            </div>
          </div>
        </div>
      </div>
      <!--描述-->
      <div class="details-info">
        <div>
          <div class="details-title" :class="{alCollect: isCollection}">{{$t('goodsDetails.disc')}}
            <div v-show="sessionToken" @click="collection"><span></span></div>
          </div>
          <div class="details-con">{{goodsDetails.description}}</div>
        </div>
        <div>
          <div class="details-title">{{$t('brandList.title')}}</div>
          <div class="details-con">{{brandInfo.description}}</div>
        </div>
        <div v-for="(item, index) in valueList" :key="index">
          <div class="details-title">{{item.attribute_name}}</div>
          <div class="details-con">{{item.content}}</div>
        </div>
        <div v-if="skuImgShow">
          <div class="details-title sku-intro">{{$t('goodsDetails.sizeIntro')}}</div>
          <div class="details-con"><img :src="imgBaseUrl() + goodsDetails.spec_pic" alt=""></div>
        </div>
      </div>
      <!--相关推荐-->
      <div class="recommend" v-if="recommendShow">
        <div class="heading">{{$t('goodsDetails.recommend')}}</div>
        <ul class="recommend-list clear ac">
          <li class="fl" v-for="(item, index) in recommendGoods" :key="index" @click="goNextGoods(item.id)">
            <img :src="imgBaseUrl() + item.major_pic + '.moderate.' + item.major_pic.split('.').reverse()[0]" alt="">
            <div class="one-txt-cut">{{item.name}}</div>
            <p>{{money + item.discount}}</p>
          </li>
        </ul>
      </div>
      <!--底部购买-->
      <div class="mall-bar hb">
        <div class="mall-info flex-1">
          <div class="price"><span class="re-price">{{money + goodsDetails.discount}}</span><span
            class="discount">{{money + goodsDetails.price}}</span></div>
          <div class="name one-txt-cut">{{brandInfo.name}}</div>
        </div>
        <div class="btn ac no-amount" v-if="isNoAmount">{{$t('goodsDetails.sellOut')}}</div>
        <template v-else>
          <div class="btn ac" v-show="!isJoinCart" @click="buy"><span class="icon"></span><span
            class="text">{{$t('goodsDetails.buy')}}</span></div>
          <div class="btn ac" v-show="isJoinCart" @click="buy">{{$t('goodsDetails.settleAccounts')}}</div>
        </template>
      </div>
    </div>
    <navBar :sessionToken="sessionToken" :num="num"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'
  import {imgBaseUrl, money} from '../../config/config'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,         //图片域名
        loadingShow: true,  //loading是否显示
        money,              //钱的单位
        swiperOption: {
          autoplay: 4500,
          autoplayDisableOnInteraction: false,
          pagination: ".swiper-pagination"
        },
        goodsDetails: '',   //商品详情
        goodsImgs: [],      //轮播图图片
        tipShow: false,     //轮播图上方的提示是否显示
        skuColorShow: false,//颜色尺码信息是否显示
        colorList: [],      //颜色信息
        colorShow: false,   //颜色选择是否显示
        skuList: [],        //尺码信息
        skuShow: false,     //尺码选择是否显示
        selectedSku: '',    //选中的尺码信息
        skuIndex: '',       //选中sku下标
        brandInfo: '',      //品牌信息
        valueList: [],      //属性类别
        skuImgShow: false,  //尺码说明图片是否显示
        recommendGoods: [], //相关商品
        recommendShow: false,//相关商品是否显示
        isJoinCart: false,  //是否已经加入购物车
        isCollection: false,//是否被收藏
        isNoAmount: false,  //是否售完
        sessionToken: '',   //sessionStorage中保存的token
        num: 0              //表示变化的一个数字
      }
    },
    methods: {
      /*颜色、尺码显示隐藏*/
      openChoose: function (type) {
        if (type === 'color') {
          if (this.colorShow) {
            this.colorShow = false;
          } else {
            this.colorShow = true;
            if (this.skuShow) {
              this.skuShow = false;
            }
          }
        }
        if (type === 'sku') {
          if (this.skuShow) {
            this.skuShow = false;
          } else {
            this.skuShow = true;
            if (this.colorShow) {
              this.colorShow = false;
            }
          }
        }
      },
      /*下一个商品*/
      goNextGoods: function (id) {
        this.$router.replace({name: 'goodsDetails', params: {goods_id: id}});
        this.$router.go(0);
      },
      /*选择尺码信息*/
      chooseSku: function (index) {
        if (this.skuList[index].amount > 0) {
          this.skuIndex = index;
          this.selectedSku = this.skuList[index].name;
        }
      },
      /*收藏/删除收藏*/
      collection: function () {
        let _this = this;
        if (_this.isCollection) {
          _this.deleteGoods(_this.sessionToken, _this.goodsDetails.id, function () {
            _this.toast(_this.$t('goodsDetails.delete'));
            _this.isCollection = false;
          })
        } else {
          _this.addGoods(_this.sessionToken, {product_id: _this.goodsDetails.id}, function () {
            _this.toast(_this.$t('goodsDetails.add'));
            _this.isCollection = true;
          })
        }
      },
      /*滑到尺码说明*/
      goSkuIntro: function () {
        let top = document.getElementsByClassName('sku-intro')[0].offsetTop,
          height = document.getElementsByClassName('top-bar')[0].offsetHeight;
        window.scroll(0, top - height);
      },
      /*购买*/
      buy: function () {
        let _this = this;
        if (_this.isJoinCart) {
          _this.$router.push('/shoppingCart');
        } else {
          if (_this.skuIndex === '') {
            let top = document.getElementsByClassName('sku-color')[0].offsetTop,
              height = document.getElementsByClassName('top-bar')[0].offsetHeight;
            _this.skuShow = true;
            _this.toast(_this.$t('goodsDetails.chooseSize'));
            window.scroll(0, top - height);
          } else {
            let params = {
              retail_cart: {
                product_id: _this.goodsDetails.id,
                sku_id: _this.skuList[_this.skuIndex].id,
                client: 'touch'
              }
            };
            _this.addCart(_this.sessionToken, params, function () {
              _this.toast(_this.$t('goodsDetails.addCart'));
              _this.isJoinCart = true;
              _this.num++;
            })
          }
        }
      },
      /*数据请求*/
      detailsHttp: function () {
        let _this = this;
        _this.getGoodsDetails(_this.$route.params.goods_id, function (data) {
          /*商品信息*/
          _this.goodsDetails = data.data.auction_product;
          if (_this.goodsDetails.images) {
            _this.goodsImgs = _this.goodsDetails.images;
          } else {
            _this.goodsImgs.push({large: _this.goodsDetails.major_pic});
          }
          if (_this.goodsDetails.label) {
            _this.tipShow = true;
          }
          if (_this.goodsDetails.spec_pic) {
            _this.skuImgShow = true;
          }
          /*颜色和sku*/
          _this.colorList = data.data.relate_products || '';
          _this.skuList = data.data.skus;
          let isNoAmount = true;//是否售完
          for (let i = 0, len = _this.skuList.length; i < len; i++) {
            if (_this.skuList[i].amount > 0) {
              isNoAmount = false;
              break;
            }
          }
          _this.isNoAmount = isNoAmount;
          _this.skuColorShow = true;
          /*品牌信息*/
          _this.brandInfo = data.data.brand;
          /*属性信息*/
          let valueList = [];
          for (let i = 0, list = data.data.auction_values, len = list.length; i < len; i++) {
            let isPush = true;
            for (let j = 0, leng = valueList.length; j < leng; j++) {
              if (valueList[j].attribute_name == list[i].attribute_name) {
                valueList[j].content = valueList[j].content + '，' + list[i].content;
                isPush = false;
                break;
              }
            }
            if (isPush) {
              valueList.push({attribute_name: list[i].attribute_name, content: list[i].content});
            }
          }
          _this.valueList = valueList;
          /*相关推荐*/
          _this.recommendGoods = data.data.match_products || '';
          if (_this.recommendGoods) {
            _this.recommendShow = true;
          }
          _this.loadingShow = false;
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
    watch: {
      sessionToken: function (val) {
        if (val) {
          /*判断商品是否被收藏*/
          let _this = this;
          _this.isAddGoods(_this.sessionToken, _this.$route.params.goods_id, function (data) {
            if (data.data.data) {
              _this.isCollection = true;
            }
          })
        }
      },
      skuShow: function (val) {
        if (val) {
          this.$nextTick(function () {
            let li = document.getElementsByClassName('sku-list')[0].getElementsByTagName('li');
            for (let i = 0, len = li.length; i < len; i++) {
              let width = li[i].offsetWidth,
                height = li[i].offsetHeight,
                span = li[i].getElementsByTagName('span')[0],
                spanWidth = Math.sqrt((width - 2) * (width - 2) + (height - 2) * (height - 2));
              span.style.width = spanWidth + 'px';
              span.style.top = height / 2 - 3 + 'px';
              span.style.marginLeft = '-' + spanWidth / 2 + 'px';
              span.style.transform = 'rotate(-' + Math.atan(height / width) * 360 / 2 / Math.PI + 'deg)';
            }
          })
        }
      }
    },
    mounted(){
      this.detailsHttp();
      this.checkLogin(true);
    }
  }
</script>

<style scoped>
  /*头部*/
  .top-bar .name {
    height: 100%;
    font-size: .12rem;
  }

  .top-bar .name > div {
    width: 60%;
    max-height: .36rem;
    line-height: 1.5;
  }

  .content {
    padding-bottom: .5rem;
  }

  /*提示*/
  .tips {
    height: .28rem;
    line-height: .28rem;
    font-size: .15rem;
    font-weight: bold;
  }

  /*轮播图*/
  .show-img {
    height: 3.28rem;
  }

  .show-img .img-box img {
    width: 3.1rem;
    height: 3.1rem;
    margin: 0 auto;
  }

  /*尺码*/
  .sku-color .heading {
    font-size: .17rem;
    color: #8e8e8e;
    margin-top: .16rem;
  }

  .sku-color .heading > div {
    display: inline-block;
    height: .24rem;
    line-height: .22rem;
    border-bottom: 1px solid #8e8e8e;
    position: relative;
  }

  .sku-color .heading .two-choose {
    margin-right: .9rem;
  }

  .sku-color .heading > div.open {
    color: #000;
    border-color: #000;
  }

  .sku-color .heading > div span {
    padding-left: .15rem;
  }

  .sku-color .heading > div div {
    position: absolute;
    top: .18rem;
    left: 50%;
    margin-left: -.1rem;
    border: .1rem solid transparent;
    border-bottom-color: #f5f3f1;
  }

  .sku-color .con {
    background: #f5f3f1;
    padding: .07rem 0 .07rem .2rem;
    margin-top: .14rem;
  }

  .sku-color li {
    height: .4rem;
    line-height: .36rem;
    font-size: .14rem;
    background: #fff;
    border: 2px solid #bdbdbd;
    margin: .07rem .18rem .07rem 0;
    position: relative;
  }

  .sku-color .color-list li {
    width: .4rem;
  }

  .sku-color .sku-list li {
    min-width: .4rem;
    padding: 0 .05rem;
  }

  .sku-color li.no-amount {
    background: #f5f3f1;
  }

  .sku-color li.active {
    border-color: #000;
  }

  .sku-color .sku-list li span {
    position: absolute;
    left: 50%;
    height: 2px;
    border-top: 2px solid #bdbdbd;
  }

  .sku-color .text {
    padding: 0 .2rem 0 .15rem;
    border-left: 1px dashed #8e8e8e;
  }

  .sku-color .text .icon {
    width: .28rem;
    height: .18rem;
    margin-bottom: .03rem;
    background: url("../../assets/sprites.png") no-repeat -1.4rem -1.31rem/3rem 1.8rem;
  }

  .sku-color .text .txt {
    width: .28rem;
    height: .28rem;
    font-size: .12rem;
    line-height: .14rem;
    color: #8e8e8e;
    font-weight: bold;
  }

  /*各种详情*/
  .details-info {
    padding: 0 .2rem;
    margin-bottom: .2rem;
  }

  .details-info > div {
    margin-top: .18rem;
  }

  .details-title {
    font-size: .17rem;
    font-weight: bold;
    height: .45rem;
    line-height: .45rem;
    position: relative;
  }

  .details-title div {
    position: absolute;
    width: .45rem;
    height: .45rem;
    top: -.02rem;
    right: -.1rem;
  }

  .details-title span {
    display: block;
    width: .25rem;
    height: .25rem;
    margin: .1rem;
    background: url("../../assets/sprites.png") no-repeat -2.4rem -.28rem/3rem 1.8rem;
  }

  .details-title.alCollect span {
    background-position: -2.13rem -.28rem;
  }

  .details-con {
    font-size: .14rem;
    color: #87847f;
    line-height: .22rem;
  }

  .details-con > img {
    filter: invert();
  }

  /*相关推荐*/
  .recommend .heading {
    font-size: .17rem;
    color: #fffefe;
    background: #8e8e8e;
    padding: 0 .2rem;
    height: .3rem;
    line-height: .3rem;
  }

  .recommend-list {
    padding-top: .25rem;
  }

  .recommend-list li {
    width: 50%;
    margin-bottom: .25rem;
  }

  .recommend-list li img, .recommend-list li div {
    width: 1.42rem;
    margin: 0 auto;
  }

  .recommend-list li img {
    height: 1.42rem;
    margin-bottom: .09rem;
  }

  .recommend-list li div {
    font-size: .12rem;
    color: #8e8e8e;
    margin-bottom: .05rem;
  }

  .recommend-list li p {
    font-size: .14rem;
  }

  /*底部购买*/
  .mall-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: .5rem;
    background: #fff;
    padding: .06rem .2rem;
    font-size: .18rem;
  }

  .mall-bar .price span {
    display: inline-block;
    line-height: .18rem;
    vertical-align: middle;
  }

  .mall-bar .re-price {
    color: #911573;
    font-weight: bold;
    padding-right: .04rem;
  }

  .mall-bar .discount {
    font-size: .12rem;
    color: #8e8e8e;
    padding-left: .04rem;
    border-left: 1px solid #8e8e8e;
    text-decoration: line-through;
  }

  .mall-bar .name {
    font-size: .14rem;
    margin-top: .03rem;
    width: 2.4rem;
    line-height: 1.2;
  }

  .mall-bar .btn {
    width: 1.2rem;
    height: .38rem;
    line-height: .38rem;
    color: #fff;
    background: #911573;
    border-radius: .05rem;
  }

  .mall-bar .btn .icon {
    padding-left: .23rem;
    background: url("../../assets/sprites.png") no-repeat -.01rem -.29rem/3rem 1.8rem;
  }

  .mall-bar .btn .text {
    padding-left: .08rem;
  }

  .mall-bar .btn.no-amount {
    background: #8e8e8e;
  }
</style>
<style>
  /*轮播图*/
  .show-img.swiper-container-horizontal > .swiper-pagination-bullets {
    font-size: 0;
    bottom: .03rem;
  }

  .show-img.swiper-container-horizontal .swiper-pagination-bullet {
    width: .06rem;
    height: .06rem;
    background: #cacaca;
    opacity: 1;
  }

  .show-img.swiper-container-horizontal .swiper-pagination-bullet-active {
    background: #000;
  }
</style>
