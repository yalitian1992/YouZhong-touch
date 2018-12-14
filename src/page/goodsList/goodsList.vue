<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" v-if="!noGoodsShow">
      <div class="sort" slot="c-con">
        <div class="brand-sort ac" @click="cLShow = true">
          <div class="brand one-txt-cut">{{topBarTitle}}</div>
          <div class="specific-st" :class="{open: cLShow}">
            <div>{{sortWayList[sortIndex].way}}<span></span></div>
          </div>
        </div>
        <div class="classify-list-1" v-show="cLShow" @click.self="cLShow = false">
          <ul>
            <li :class="{active: sortIndex == index}" v-for="(item, index) in sortWayList" :key="index"
                @click="goodsSort(item.params, index)">{{item.way}}
            </li>
            <span></span>
          </ul>
        </div>
      </div>
      <div class="r-btn clear" slot="r-btn">
        <div class="toggle fl" @click="isHor = !isHor;">
          <div :class="{hor: isHor}"></div>
        </div>
        <div class="filter fl" @click="openFilter = true;setSlide(0)">
          <div></div>
        </div>
      </div>
    </topBar>
    <topBar backShow="true" titleShow="true" :title="topBarTitle" v-else></topBar>
    <div class="content">
      <div class="brand-info" v-if="$route.query.from == 'brand'">
        <div class="name">{{brandInfo.title}}</div>
        <div class="keywords"><span>{{$t('goodsList.keyword')}}</span>{{brandInfo.keywords}}
          <div v-show="sessionToken" class="collect-icon" :class="{alCollect: isCollection}" @click="collection">
            <div></div>
          </div>
        </div>
        <div class="cradle" v-if="brandInfo.country"><span>{{$t('goodsList.cradle')}}</span>{{brandInfo.country.name}}
        </div>
        <div class="year"><span>{{$t('goodsList.year')}}</span>{{brandInfo.year}}</div>
        <div class="more ac" @click="introShow = !introShow">{{$t('goodsList.more')}}</div>
        <div class="intro" v-show="introShow">
          <div></div>
          {{brandInfo.description}}
        </div>
      </div>
      <ul class="goods-list clear ac" :class="{hor: isHor, haveData: !noGoodsShow}">
        <router-link :to="{name: 'goodsDetails', params: {goods_id: item.id}}" tag="li" class="fl"
                     v-for="(item, index) in goodsList" :key="index">
          <img :src="imgBaseUrl() + item.major_pic + '.moderate.' + item.major_pic.split('.').reverse()[0]" alt="">
          <div class="name one-txt-cut">{{item.product_name}}</div>
          <div class="price">{{money + item.discount}}</div>
          <div class="tips">{{item.label ? '【' + item.label + '】' : ''}}</div>
        </router-link>
      </ul>
      <no-data :noGoodsShow="noGoodsShow" :prompt="$t('goodsList.noData')"></no-data>
      <div class="filter-list" :class="{'open-filter': openFilter}">
        <div class="title hb ac">
          <div class="clean" :class="{notHave: isNotHave}" @click="clearFilter">{{$t('goodsList.clear')}}</div>
          <div class="con">{{$t('goodsList.filter')}}</div>
          <div class="finish" @click="openFilter = false;setSlide()">{{$t('goodsList.complete')}}</div>
        </div>
        <div class="filter-choose hb">
          <ul class="selected">
            <li class="hb" v-for="(item, index) in selectedList" :key="index">
              <div>{{item.way}}</div>
              <div class="one-txt-cut flex-1">{{item.name}}</div>
              <div class="ac" @click="deleteFilter(item, index)">×</div>
            </li>
          </ul>
          <ul class="filter-way">
            <li v-for="(item, index) in filterList" v-if="item.isShow" :key="index">
              <div class="filter-title hb" @click="openFilterWay(item)">
                <div>{{item.way}}</div>
                <div><span :class="{spread: item.spread}"></span></div>
              </div>
              <ul v-show="item.spread">
                <li class="hb" v-for="(listItem, listIndex) in item.list" :key="listIndex"
                    @click="chooseFilter(item, listItem)">
                  <div v-if="item.params == 'price'">{{listItem.value.join('~')}}</div>
                  <div v-else-if="item.params == 'target'">{{listItem.value}}</div>
                  <div class="one-txt-cut" v-else>{{listItem.name}}</div>
                  <div>{{listItem.count + $t('goodsList.unit')}}</div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import {imgBaseUrl, money} from '../../config/config'
  import noData from '../../components/noData/noData.vue'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,            //图片域名
        loadingShow: true,     //loading是否显示
        money,                 //钱的单位
        isHor: false,          //是否是横排
        cLShow: false,         //排序列表是否显示
        introShow: false,      //详情是否显示
        isNotHave: true,       //是否没有筛选
        goodsList: [],         //商品列表
        noGoodsShow: false,    //无商品是否显示
        brandInfo: '',         //品牌详情
        topBarTitle: '',       //页面头部标题
        openFilter: false,     //筛选框是否显示
        params: {},            //商品筛选请求参数
        sortWayList: [         //排序方式
          {way: this.$t('goodsList.default'), params: {}},
          {way: this.$t('goodsList.priceAsc'), params: {price: 'asc'}},
          {way: this.$t('goodsList.priceDesc'), params: {price: 'desc'}},
          {way: this.$t('goodsList.readingsCount'), params: {readings_count: 'desc'}},
          {way: this.$t('goodsList.scarcity'), params: {scarcity: 'desc'}},
          {way: this.$t('goodsList.percent'), params: {percent: 'asc'}},
          {way: this.$t('goodsList.arrivedAt'), params: {arrived_at: 'desc'}}
        ],
        sortIndex: 0,          //选中排序方式的下标
        filterList: [          //筛选方式列表
          {
            way: this.$t('goodsList.brand'),
            params: 'brand_id',
            list: [],
            isShow: false,
            spread: false
          },
          {
            way: this.$t('goodsList.classify'),
            params: 'category1_id',
            list: [],
            isShow: false,
            spread: false
          },
          {
            way: this.$t('goodsList.classify'),
            params: 'category2_id',
            list: [],
            isShow: false,
            spread: false
          },
          {
            way: this.$t('goodsList.classify'),
            params: 'category3_id',
            list: [],
            isShow: false,
            spread: false
          },
          {
            way: this.$t('goodsList.price'),
            params: 'price',
            list: [],
            isShow: false,
            spread: false
          },
          {
            way: this.$t('goodsList.sex'),
            params: 'target',
            list: [],
            isShow: false,
            spread: false
          }
        ],
        selectedList: [],      //选择的筛选方式
        isCollection: false,   //是否被收藏
        isHttp: true,          //是否能请求
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      /*展开筛选方式*/
      openFilterWay: function (item) {
        if (item.spread) {
          item.spread = false;
        } else {
          for (let i = 0; i < 6; i++) {
            this.filterList[i].spread = false;
          }
          item.spread = true;
        }
      },
      /*选择具体筛选方式*/
      chooseFilter: function (item, listItem) {
        this.isNotHave = false;
        let selected = {way: item.way, params: item.params, id: listItem.value, name: listItem.name || listItem.value};
        if (selected.params === 'price') {
          selected.name = selected.name.join('~');
        }
        this.selectedList.push(selected);
        for (let i = 0, len = this.selectedList.length; i < len; i++) {
          if (this.selectedList[i].params === 'brand_id') {
            this.params.where.brand_id = this.selectedList[i].id;
          }
          if (this.selectedList[i].params === 'category1_id') {
            this.params.where.category1_id = this.selectedList[i].id;
          }
          if (this.selectedList[i].params === 'category2_id') {
            this.params.where.category2_id = this.selectedList[i].id;
          }
          if (this.selectedList[i].params === 'category3_id') {
            this.params.where.category3_id = this.selectedList[i].id;
          }
          if (this.selectedList[i].params === 'price') {
            this.params.where.price.gteq = this.selectedList[i].id[0];
            this.params.where.price.lteq = this.selectedList[i].id[1];
          }
          if (this.selectedList[i].params === 'target') {
            this.params.where.target = this.selectedList[i].id;
          }
        }
        this.isHttp = true;
        this.params.per_page = 40;
        this.goodsHttp();
      },
      /*删除筛选条件*/
      deleteFilter: function (item, index) {
        this.selectedList.splice(index, 1);
        if (this.selectedList.length === 0) {
          this.isNotHave = true;
        }
        if (item.params === 'brand_id') {
          this.params.where.brand_id = undefined;
        }
        if (item.params === 'category1_id') {
          this.params.where.category1_id = undefined;
        }
        if (item.params === 'category2_id') {
          this.params.where.category2_id = undefined;
        }
        if (item.params === 'category3_id') {
          this.params.where.category3_id = undefined;
        }
        if (item.params === 'price') {
          this.params.where.price.gteq = undefined;
          this.params.where.price.lteq = undefined;
        }
        if (item.params === 'target') {
          this.params.where.target = undefined;
        }
        this.isHttp = true;
        this.params.per_page = 40;
        this.goodsHttp();
      },
      /*清除所有筛选条件*/
      clearFilter: function () {
        this.isNotHave = true;
        for (let i = 0, len = this.selectedList.length; i < len; i++) {
          if (this.selectedList[i].params === 'brand_id') {
            this.params.where.brand_id = undefined;
          }
          if (this.selectedList[i].params === 'category1_id') {
            this.params.where.category1_id = undefined;
          }
          if (this.selectedList[i].params === 'category2_id') {
            this.params.where.category2_id = undefined;
          }
          if (this.selectedList[i].params === 'category3_id') {
            this.params.where.category3_id = undefined;
          }
          if (this.selectedList[i].params === 'price') {
            this.params.where.price.gteq = undefined;
            this.params.where.price.lteq = undefined;
          }
          if (this.selectedList[i].params === 'target') {
            this.params.where.target = undefined;
          }
        }
        this.isHttp = true;
        this.params.per_page = 40;
        this.goodsHttp();
        this.selectedList = [];
      },
      /*收藏/删除收藏*/
      collection: function () {
        let _this = this;
        if (_this.isCollection) {
          _this.deleteBrand(_this.sessionToken, _this.params.where.brand_id, function () {
            _this.toast(_this.$t('goodsList.delete'));
            _this.isCollection = false;
          })
        } else {
          _this.addBrand(_this.sessionToken, {brand_id: _this.params.where.brand_id}, function () {
            _this.toast(_this.$t('goodsList.add'));
            _this.isCollection = true;
          })
        }
      },
      /*请求数据*/
      goodsHttp: function () {
        let _this = this;
        if (_this.isHttp) {
          _this.isHttp = false;
          _this.getGoodsList(_this.params, function (data) {
            _this.goodsList = data.data.products;
            if (_this.goodsList.length == 0) {
              _this.noGoodsShow = true;
            }
            _this.loadingShow = false;
            _this.isHttp = true;
            if (_this.goodsList.length < _this.params.per_page) {
              _this.isHttp = false;
            }
            _this.params.per_page += 40;

            let productsFacet = data.data.products_facet;
            _this.filterList[0].list = productsFacet.brand_id || [];
            for (let i = 1; i < 4; i++) {
              _this.filterList[i].list = productsFacet['category' + i + '_id'] || [];
            }
            _this.filterList[4].list = productsFacet.price || [];
            _this.filterList[5].list = productsFacet.target || [];
            for (let i = 0; i < 6; i++) {
              _this.filterList[i].isShow = false;
              if (_this.filterList[i].list.length !== 0) {
                _this.filterList[i].isShow = true;
              }
            }
            if (_this.filterList[1].list.length !== 0) {
              _this.filterList[2].isShow = false;
              _this.filterList[3].isShow = false;
            } else if (_this.filterList[2].list.length !== 0) {
              _this.filterList[3].isShow = false;
            }
          })
        }
      },
      /*商品列表排序*/
      goodsSort: function (sortWay, index) {
        this.params.order = sortWay;
        this.sortIndex = index;
        this.isHttp = true;
        this.params.per_page = 40;
        this.goodsHttp();
        this.cLShow = false;
      }
    },
    components: {
      topBar,
      navBar,
      noData,
      loading
    },
    watch: {
      sessionToken: function (val) {
        if (val) {
          /*判断商品是否被收藏*/
          let _this = this;
          _this.isAddBrand(_this.sessionToken, _this.params.where.brand_id, function (data) {
            if (data.data.data) {
              _this.isCollection = true;
            }
          })
        }
      }
    },
    mounted(){
      let _this = this;
      _this.params = {
        keyword: _this.$route.query.keyword || undefined,              //关键字
        per_page: 40,                                                  //每页数量
        page: 1,                                                       //页数
        where: {                                                       //筛选条件
          price: {                                                     //价格
            gt: _this.$route.query.price_gt || undefined,              //大于
            gteq: _this.$route.query.price_gteq || undefined,          //大于等于
            lt: _this.$route.query.price_lt || undefined,              //小于
            lteq: _this.$route.query.price_lteq || undefined           //小于等于
          },
          brand_id: _this.$route.query.brand_id || undefined,          //品牌ID
          is_hot: _this.$route.query.is_hot || undefined,              //热门商品
          is_micro: _this.$route.query.is_micro || undefined,          //微集分特惠商品
          target: _this.$route.query.target || undefined,              //性别
          unsold_count: {                                              //库存
            gt: _this.$route.query.unsold_count_gt || undefined,       //大于
            gteq: _this.$route.query.unsold_count_gteq || undefined    //大于等于
          },
          category1_id: _this.$route.query.category1_id || undefined,  //一级分类ID
          category2_id: _this.$route.query.category2_id || undefined,  //二级分类ID
          category3_id: _this.$route.query.category3_id || undefined,  //三级分类ID
          id: _this.$route.query.id || undefined,                      //返回id列表中的商品数据
          recommend: _this.$route.query.recommend || undefined         //最新、精选、热门
        },
        order: {}                                                      //排序
      };
      _this.goodsHttp();
      _this.scrollMore(function () {
        _this.goodsHttp();
      })
      if (_this.$route.query.from == 'brand') {
        _this.brandDetails(_this.params.where.brand_id, function (data) {
          _this.brandInfo = data.data.auction_brands;
          _this.topBarTitle = _this.brandInfo.name;
        })
      } else if (_this.$route.query.from == 'mallIndex' || _this.$route.query.from == 'classify') {
        _this.topBarTitle = _this.$route.query.title;
      } else if (_this.$route.query.from == 'search') {
        _this.topBarTitle = _this.$t('navBar.search') + '"' + _this.$route.query.keyword + '"';
      } else {
        _this.topBarTitle = _this.$t('goodsList.allGoods');
      }
      _this.checkLogin(true);
    }
  }
</script>

<style scoped>
  /*头部排序*/
  .brand-sort {
    width: 40%;
    margin: 0 auto;
  }

  .sort .brand {
    font-size: .18rem;
    line-height: .22rem;
    font-weight: bold;
    margin: .05rem 0 .02rem;
  }

  .specific-st {
    position: relative;
  }

  .specific-st > div {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: .16rem;
    line-height: .16rem;
    font-size: .14rem;
    color: #010101;
    padding-right: .15rem;
  }

  .specific-st > div span {
    position: absolute;
    border-width: .07rem .05rem;
    border-style: solid;
    border-color: #86847F transparent transparent transparent;
    top: .05rem;
    right: 0;
  }

  .specific-st.open > div span {
    top: -.01rem;
    border-color: transparent transparent #86847F transparent;
  }

  /*头部右侧按钮*/
  .r-btn {
    position: absolute;
    top: 0;
    right: .07rem;
  }

  .r-btn > div {
    width: .5rem;
    height: .5rem;
  }

  .r-btn > div > div {
    width: .24rem;
    height: .24rem;
    margin: .13rem auto;
    background: url("../../assets/sprites.png") no-repeat -.89rem -.27rem/3rem 1.8rem;
  }

  .r-btn .toggle div {
    background-position: -2.2rem 0;
  }

  .r-btn .toggle div.hor {
    background-position: -2.5rem 0;
  }

  .r-btn .filter div {
    background-position: -2.77rem 0;
  }

  /*品牌介绍*/
  .brand-info > div {
    margin-left: .2rem;
  }

  .brand-info .name {
    font-size: .17rem;
    font-weight: bold;
    line-height: 1.5;
    padding: .18rem .2rem .15rem 0;
  }

  .keywords, .cradle, .year {
    max-width: 3.2rem;
    font-size: .14rem;
    line-height: .19rem;
    color: #8e8e8e;
    margin-bottom: .08rem;
    position: relative;
  }

  .brand-info > div span {
    display: inline-block;
    color: #2f2f2f;
    width: .68rem;
    padding-right: .14rem;
  }

  .brand-info > div.more {
    width: .6rem;
    font-size: .14rem;
    line-height: .2rem;
    border-bottom: 1px solid #000;
  }

  .brand-info > div.intro {
    font-size: .14rem;
    color: #666;
    text-align: justify;
    line-height: .21rem;
    margin: .14rem 0 0 0;
    padding: .16rem .2rem;
    background: #eee;
    position: relative;
  }

  .brand-info > div.intro div {
    position: absolute;
    top: -.2rem;
    left: .38rem;
    border: .1rem solid transparent;
    border-bottom-color: #eee;
  }

  .brand-info .collect-icon {
    width: .45rem;
    height: .45rem;
    position: absolute;
    top: -.15rem;
    right: -.63rem;
  }

  .brand-info .collect-icon div {
    width: .25rem;
    height: .25rem;
    margin: .1rem;
    background: url("../../assets/sprites.png") no-repeat -2.4rem -.28rem/3rem 1.8rem;
  }

  .brand-info .collect-icon.alCollect div {
    background-position: -2.13rem -.28rem;
  }

  /*商品列表*/
  .goods-list.haveData {
    padding-top: .25rem;
  }

  .goods-list li {
    width: 50%;
    margin-bottom: .25rem;
    padding: 0 .2rem;
  }

  .goods-list.hor li {
    width: 100%;
  }

  .goods-list li img {
    width: 1.42rem;
    height: 1.42rem;
    margin: 0 auto .09rem;
  }

  .goods-list.hor li img {
    width: 3.1rem;
    height: 3.1rem;
  }

  .goods-list li > div {
    height: .15rem;
    line-height: .15rem;
  }

  .goods-list li .name {
    font-size: .12rem;
    color: #8e8e8e;
  }

  .goods-list li .price {
    font-size: .14rem;
  }

  .goods-list li .tips {
    font-size: .12rem;
    color: #2f2f2f;
    font-weight: bold;
  }

  /*筛选*/
  .filter-list, .filter-list .title {
    top: 0;
    left: 0;
    right: 0;
    z-index: 110;
  }

  .filter-list {
    position: fixed;
    bottom: 0;
    background: #fff;
    transform: translate3d(0, 100%, 0);
    transition: transform .4s;
  }

  .filter-list.open-filter {
    transform: translate3d(0, 0, 0);
  }

  .filter-list .title {
    position: absolute;
    height: .5rem;
    background: #f7f6f6;
    font-size: .18rem;
    padding: 0 .1rem;
    border-bottom: 1px solid #C8C7CC;
  }

  .filter-list .title > div {
    padding: 0 .1rem;
    line-height: .5rem;
    color: #8e8e8e;
  }

  .filter-list .title .clean.notHave {
    color: #E4E4E4;
  }

  .filter-list .title .con {
    color: #000;
    font-size: .2rem;
    font-weight: bold;
    line-height: .48rem;
  }

  .filter-list .filter-choose {
    font-size: .14rem;
    color: #252121;
    height: 100%;
  }

  .filter-choose > ul {
    height: 100%;
    padding-top: .5rem;
  }

  .selected {
    width: 40%;
    color: #BB1E7B;
    border-right: 1px solid #C8C7CC;
  }

  .selected li {
    margin: .1rem .05rem;
    border: 1px dashed #BB1E7B;
  }

  .selected li div {
    line-height: .3rem;
    padding: 0 .05rem;
  }

  .selected li .one-txt-cut {
    border-left: 1px dashed #BB1E7B;
    border-right: 1px dashed #BB1E7B;
  }

  .selected li div:last-child {
    width: .3rem;
    font-size: .24rem;
    line-height: .28rem;
  }

  .filter-way {
    width: 60%;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .filter-way .filter-title {
    padding: 0 .24rem 0 .2rem;
    border-bottom: 1px solid #C8C7CC;
  }

  .filter-way .filter-title > div {
    line-height: .49rem;
    font-size: .16rem;
  }

  .filter-way .filter-title span {
    display: inline-block;
    vertical-align: top;
    height: .15rem;
    margin: .18rem 0 0 .08rem;
    width: .08rem;
    background: url("../../assets/sprites.png") no-repeat -2.69rem -.29rem/3rem 1.8rem;
    transform: rotate(90deg);
  }

  .filter-way .filter-title span.spread {
    transform: rotate(270deg);
  }

  .filter-way li.hb {
    margin-left: .1rem;
    padding: 0 .2rem;
    border-bottom: 1px solid #C8C7CC;
  }

  .filter-way li.hb:active {
    background: #f5f3f1;
  }

  .filter-way li.hb > div {
    line-height: .39rem;
  }

  .filter-way li.hb > div:first-child {
    width: 1.3rem;
  }

  .filter-way li.hb > div:last-child {
    color: #8e8e8e;
  }
</style>
