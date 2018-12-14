<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('shoppingCart.title')">
    <div class="ctr" slot="c-con" @click="editCtr" v-show="carData.length">{{editTxt}}</div>
    </topBar>
    <div class="content">
        <!-- 购物车列表 -->
        <ul class="shopping-list" v-show="carData.length">
          <li v-for="(item,index) in carData" @click="goGoodsDetals(index)" :key="index" :class="{'active': item.sku.amount==0 || item.published==false}">
            <div class="img">
              <img :src="imgBaseUrl() + item.product.major_pic + '.promote.' + item.product.major_pic.split('.').reverse()[0]" alt="">
            </div>
            <div class="pro-info">
              <p class="pro-tit txt-cut">{{item.product.name}}</p>
              <p class="pro-num">{{$t('shoppingCart.num')}}{{item.product_id}}</p>
              <p class="pro-size">
                <span>{{item.sku.name}}</span>
                <span>{{item.product.color_name}}</span>
                <span class="pro-price">{{money + item.product.discount}}</span>
              </p>
            </div>
            <!-- 购物车商品赛选 -->
            <!-- <p class="bag_choose" v-show="true" :class="{'active': item.isChoiced}" @click.stop="choice(index)">
              <span class="icon-cancel"></span>
            </p> -->
            <!-- 删除商品筛选 -->
            <p class="bag_cancel" v-show="choiceIconShow" :class="{'active': item.isChoiced}" @click.stop="choice(index)">
              <span class="icon-cancel"></span>
            </p>
            <!-- 售完和失效 -->
            <span class="expired" v-if="item.sku.amount==0 || item.published==true">{{$t('shoppingCart.sellOut')}}</span>
            <span class="invalid" v-if="item.published==false">{{$t('shoppingCart.loseEfficacy')}}</span>
          </li>
        </ul>
        <!-- 去结算 -->
        <div class="bottom checkout" v-show="checkoutShow">
          <div class="bottom-box">
            <div class="left">
              <p>{{$t('shoppingCart.moneyTotal')}}<span class="total-price">{{money + toTal}}</span></p>
              <p class="quantity">{{$t('shoppingCart.total')}}{{carData.length}}{{$t('shoppingCart.unit')}}</p>
            </div>
            <div class="right">
              <button @click="checkout">{{$t('shoppingCart.checkout')}}</button>
            </div>
          </div>
        </div>
        <!-- 从购物车删除 -->
        <div class="bottom delete" v-show="choiceIconShow">
          <div class="bottom-box">
            <div class="left">
              <p class="have-chosen">{{$t('shoppingCart.selected')}}{{choicedId.length}}{{$t('shoppingCart.unit')}}</p>
            </div>
            <div class="right">
              <button @click="del" :class="{'active': choicedId.length}">{{$t('shoppingCart.del')}}</button>
            </div>
          </div>
        </div>

        <!-- 购物车无商品 -->
        <no-data :noGoodsShow="noGoodsShow" :prompt="$t('shoppingCart.noData')"></no-data>
    </div>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import {imgBaseUrl, money} from '../../config/config'
  import noData from '../../components/noData/noData.vue'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,            //图片域名
        loadingShow: true,//loading是否显示
        money,                 //钱的单位
        toTal: 0, //总价
        noGoodsShow: false,
        carData: [],  //购物车列表
        delData: [],  //删除购物车数据
        choicedId: [],  //已选商品ID列表
        choicedPrice: [], //已选商品价钱集合
        choiceIconShow: false,  //点选按钮是否显示
        id_Sku: [],  // 创建订单是参数用
        cart_id: [],  //购物车id集合，创建订单时参数用
        editTxt: this.$t('shoppingCart.edit'),//编辑按钮文字
        isChoiced: false,
        emptyShow: false, //畅销商品推荐是否显示
        cartShow: true, //购物车商品是否显示
        checkoutShow: false
      }
    },
    components: {
      topBar,
      noData,
      loading
    },
    methods: {
      goGoodsDetals: function(index){
        this.$router.push({name: 'goodsDetails', params:{goods_id: this.carData[index].product_id}})
      },
      editCtr: function(){
        if (this.choiceIconShow ==false ) {
          this.choiceIconShow = true;
          this.checkoutShow = false;
          this.editTxt = this.$t('shoppingCart.complete')
        }else {
          this.choiceIconShow = false;
          this.checkoutShow = true;
          this.editTxt = this.$t('shoppingCart.edit')
        };
      },
      choice: function(index){
        this.carData[index].isChoiced = !this.carData[index].isChoiced
        this.choicedId = []; //已选商品ID列表
        this.choicedPrice = []; //已选商品价格集合
        for(var i=0;i<this.carData.length;i++){
          if(this.carData[i].isChoiced == true){
            this.choicedId.push(this.carData[i].id)
            this.choicedPrice.push(this.carData[i].product.discount)
          }
        }
      },
      del: function(){
        // 如果未选中，提示未选中并结束执行
        if (this.choicedId == 0) {
          this.toast(this.$t('shoppingCart.noSelected'), 500)
          return false;
        };

        var ids = JSON.stringify(this.choicedId)
        ids = ids.replace('[','')
        ids = ids.replace(']','')
        var _this = this;
        this.deleteCart(window.sessionStorage.getItem('token'), {ids: ids}, function(data){
          _this.toast(_this.$t('shoppingCart.deleteSuccess'), 500)
          // 更新页面
          for(var i=0; i<_this.choicedId.length; i++){
            for(var j=0; j<_this.carData.length; j++){
              if(_this.carData[j].id == _this.choicedId[i]){
                _this.carData.splice(j,1);
                break;
              }
            }
          }
          //更新总价
          var currentPrice = eval(_this.choicedPrice.join("+"))  //被删除商品总价
          _this.toTal = _this.toTal-currentPrice
          //如果全部删除了，显示购物车无商品
          if(_this.carData.length == 0){
            _this.noGoodsShow = true;
            _this.choiceIconShow =false;
          }
        })
      },
      checkout: function(){
        // 存储清单商品id集合
        var cartIds = [];
        for(var i=0;i<this.carData.length;i++){
          // 失效商品和0库存商品不可用
          if (this.carData[i].sku.amount != 0 || this.carData[i].published == true) {
            var productsArr = {
                id: this.carData[i].product_id,
                sku_id: this.carData[i].sku_id
              }
            this.id_Sku.push(productsArr)
            this.cart_id.push(this.carData[i].id)
          };
        }
        cartIds = this.cart_id
        cartIds = JSON.stringify(cartIds)
        cartIds = cartIds.replace('[','')
        cartIds = cartIds.replace(']','')
        this.cart_id = []
        this.$router.push({path: '/confirmOrder', query:{id_Sku: JSON.stringify(this.id_Sku), cart_id: cartIds}})
      }
    },
    mounted(){
      let _this = this;
      // 购物车列表
      _this.checkLogin(false,function(){
        _this.cartList(window.sessionStorage.getItem('token'), function(data){
          var data =  data.data.retail_carts;
          for (var i=0;i<data.length;i++){
            data[i].isChoiced = false //是否选中标识
            _this.toTal += parseInt(data[i].product.discount)
          }
          _this.carData = data
          if(_this.carData.length != 0){
            _this.checkoutShow = true
          }else{
            //如果購物車商品為0， 顯示購物車無商品
            _this.noGoodsShow = true;
          }
          _this.loadingShow = false;
        })
      });
    }
  }
</script>

<style scoped>
.ctr {
  position: fixed;
  top: .15rem;
  right: 5%;
  font-size: .18rem;
  color: #8e8e8e;
}
/* 购物车列表 */
.shopping-list {
  font-size: .17rem;
  padding-bottom: .5rem;
}
.shopping-list li {
  position: relative;
  overflow: hidden;
  padding: .17rem 5%;
  border-bottom: 1px solid #ddd;
}
.shopping-list li:first-child {
  border-top: 1px solid #ddd;
}
.shopping-list li .expired {
    display: none;
}
.shopping-list li.active {
  opacity: .5;
}
.shopping-list li.active .expired {
    display: block;
    background: #999;
    position: absolute;
    right: -.3rem;
    font-size: .12rem;
    top: .05rem;
    padding: .03rem .3rem;
    color: #fff;
    transform: rotate(45deg);
}
.shopping-list li.active .invalid {
    display: block;
    background: #999;
    position: absolute;
    right: -.3rem;
    font-size: .12rem;
    top: .05rem;
    padding: .03rem .3rem;
    color: #fff;
    transform: rotate(45deg);
}
.bag_choose {
    position: absolute;
    left: 5%;
    top: .05rem;
    margin-right: -.1rem;
    padding: .1rem;
}
.bag_cancel {
    position: absolute;
    right: 5%;
    top: .05rem;
    margin-right: -.1rem;
    padding: .1rem;
}
.bag_cancel.active .icon-cancel {
    background: url(../../assets/sprites.png) no-repeat -1.72rem -1.33rem/3rem 1.8rem;
}
.icon-cancel {
  display: block;
      width: .23rem;
    height: .23rem;
    background: url(../../assets/sprites.png) no-repeat -1.73rem -1.06rem/3rem 1.8rem;
}
.shopping-list .img {
  float: left;
  width: 1.15rem;
  height: 1.15rem;
}
.shopping-list .img img {
  width: 100%;
}
.shopping-list .pro-info {
  width: 63%;
  height: 1.15rem;
  float: right;
  position: relative;
}
.shopping-list .pro-info p {
  width: 100%;
}
.shopping-list .pro-info p.pro-tit {
  width: 89%;
  font-size: .14rem;
  line-height: .16rem;
  margin-bottom: .05rem;
}
.pro-num {
  font-size: .13rem;
  color: #c8c7cc;
}
.pro-size {
  position: absolute;
  bottom: 0;
  font-size: .14rem;
  line-height: .14rem;
}
.pro-size span {
  float: left;
  color: #8e8e8e;
  border-right: 1px solid #8e8e8e;
  padding: 0 .06rem;
}
.pro-size span:first-child {
  padding-left: 0;
}
.pro-size span:nth-last-child(1) {
  float: right;
  color: #911573;
  border-right: none;
  padding: 0;
}
.pro-size span:nth-last-child(2) {
  border-right: none;
}
.bottom {
  font-size: .18rem;
  height: .5rem;
  border-top: 1px solid #ddd;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.bottom-box {
  margin: 0 5%;
}
.bottom .left {
  float: left;
  padding-top: .04rem;
}
.bottom .total-price {
  font-weight: bold;
  color: #911573;
}
.bottom .quantity {
  font-size: .13rem;
  padding-top: .04rem;
}
.bottom .right {
  float: right;
  color: #fff;
  padding-top: .04rem;
}
.bottom .have-chosen {
  padding-top: .12rem;
}
button {
  width: 1.20rem;
  height: .4rem;
  background: #911573;
  border-radius: .05rem;
  color: #fff;
  font-size: .18rem;
}
.delete button {
  background: #8e8e8e;
}
.delete button.active {
  background: #000;
}
</style>
