<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('confirmOrder.title')"></topBar>
    <div class="content">
      <router-link :to="{ path: '/choiceAddress'}" tag="div">
        <div class="container">
          <h6>{{$t('confirmOrder.receiveInfo')}}</h6>
          <div class="receive-detail">
            <p class="p1"><span class="receive-name">{{addressData.name}}</span>{{addressData.phone}}</p>
            <p>{{addressData.province}}{{addressData.city}}{{addressData.town}}{{addressData.address}}</p>
            <span class="icon-Arrow"></span>
          </div>
        </div>
      </router-link>
      <!-- 订单商品列表 -->
      <div class="goods-container">
        <h6>{{$t('confirmOrder.goodsList')}}</h6>
        <ul class="shopping-list">
          <li v-for="(item, index) in goodsData" @click.stop="goGoodsDetals(index)">
            <div class="img">
                <img :src="imgBaseUrl() + item.product_pic + '.promote.' + item.product_pic.split('.').reverse()[0]" alt="">
            </div>
            <div class="pro-info">
              <p class="pro-tit txt-cut">{{item.major_pic}}</p>
              <p class="pro-tit txt-cut">{{item.product_name}}</p>
              <p class="pro-size">
                <span>{{item.sku.name}}</span>
                <span>{{item.product_color}}</span>
                <span class="pro-price" :class="{active: item.hasAbleVoucher == true || item.level.percent != ''}">{{money + item.discount}}</span>
              </p>
              <!-- 无可用优惠 -->
              <div class="discount-selector active" v-if="item.hasAbleVoucher == false && item.level.percent == ''" @click.stop>
                <span class="icon-plus"></span>
                <select class="discount-selector" name="" disabled="disabled">
                  <option :value="$t('confirmOrder.noPreferential')">{{$t('confirmOrder.noPreferential')}}</option>
                </select>
              </div>
              <!-- 有可用优惠 -->
              <div class="discount-selector" v-if="item.hasAbleVoucher == true || item.level.percent != ''" @click.stop>
                <span class="icon-plus"></span>
                <select class="discount-selector" name="" @change="change(index)" v-model="voucherSelected[index]">
                  <option :value="$t('confirmOrder.percent1')">{{$t('confirmOrder.percent1')}}</option>
                  <option v-if="isVipShow[index]" :value="item.level.percent">{{$t('confirmOrder.percent2')}}{{item.level.percent + "%"}}</option>
                  <option v-if="optionItem.isselected==false" v-for="(optionItem, optionIndex) in item.voucher" :value="optionItem.id">{{optionItem.name}}</option>
                </select>
                <span class="discount-price">{{money + item.activePrice}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 订单详情底部 -->
    <div class="bottom checkout">
      <div class="bottom-box">
        <div class="left">
          <p><span class="total-price">{{money + toTal}}</span></p>
          <p class="quantity">{{$t('confirmOrder.COD')}}<span>{{$t('confirmOrder.freightFree')}}</span></p>
        </div>
        <!-- 结算 -->
        <div class="right">
          <button @click="submit">{{$t('confirmOrder.submit')}}</button>
        </div>
        <!-- 已取消 -->
        <!-- <div class="right status">
          已取消
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import {imgBaseUrl, money} from '../../config/config'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,         //图片域名
        loadingShow: true,//loading是否显示
        money,              //钱的单位
        id_Sku: [],  //商品id
        toTal: 0, //
        voucherSelected: [],  //被选中的优惠券id集合
        currentArr: [], //上一次被选中的优惠券id集合
        voucher: [],  //优惠券
        unit: [], //商品优惠信息清单（创建订单传参用）
        cart_id: [],
        goodsData: [], //清单商品
        addressData: {  //默认收货地址
          "name": this.$t('confirmOrder.noSet'),
          "phone": "",
          "address": this.$t('confirmOrder.noAdd')
        },
        isVipShow: [], //vip折扣是否显示
      }
    },
    methods: {
      goGoodsDetals: function(index){
        this.$router.push({name: 'goodsDetails', params:{goods_id: this.goodsData[index].product_id}})
      },
      change: function(index){
        // this.unit = [];
        // 把总价清零重新计算
        this.toTal = 0
        var selectId = this.voucherSelected[index] //选中的优惠券id

        // 两次循环便利到每一个优惠券
        for (var i=0;i<this.goodsData.length;i++){
          // unit提交订单时候用
          // this.unit.push({
          //       product_id: this.goodsData[i].product_id, //商品id
          //       voucher_id: selectId, //优惠券ID
          //       level_percent: '',  //折扣
          //       multibuy_id: '',  //连拍ID
          //       amount: '1',  //
          //       sku_id: this.goodsData[i].sku.id,  //skuid
          //       sku_name: this.goodsData[i].sku.name  //XL
          //     })

            // 如果有优惠券则继续循环
          if(this.goodsData[i].voucher.length!=0){

            var sign = false; //作为判断判断是否还有可选优惠券的标记
            for(var j=0;j<this.goodsData[i].voucher.length;j++){
              /*如果选择的是请选择折扣*/
              if(selectId == this.$t('confirmOrder.percent1')){
                // 上一次被选中的优惠券设为可用
                if(this.goodsData[i].voucher[j].id == this.currentArr[index]){
                  this.goodsData[i].voucher[j].isselected = false;
                }
                // 重新计划被选产品的优惠后价格
                this.goodsData[index].activePrice = this.goodsData[index].discount;

              /*如果选择的是使用vip折扣*/
              }else if(selectId == this.goodsData[i].level.percent){
                // 上一次被选中的优惠券设为可用
                if(this.goodsData[i].voucher[j].id == this.currentArr[index]){
                  this.goodsData[i].voucher[j].isselected = false;
                }
                // 重新计划被选产品的优惠后价格
                this.goodsData[index].activePrice = this.twoInt(this.goodsData[index].discount * (1-this.goodsData[index].level.percent * 1/100))
                // 重新設置VIP折扣（傳參用）
                this.unit[index].voucher_id = '';
                this.unit[index].level_percent=selectId

              /*如果选择的是优惠券*/
              }else{

                // 上一次被选中的优惠券设为可用
                if(this.goodsData[i].voucher[j].id == this.currentArr[index]){
                  this.goodsData[i].voucher[j].isselected = false;
                }
                //新选中的优惠券设为不可用
                if(this.goodsData[i].voucher[j].id == selectId){
                  // 重新计算被选产品的优惠后价格
                  this.goodsData[i].voucher[j].isselected = true;
                  if (i == index) {
                    this.goodsData[index].activePrice = this.goodsData[index].discount-this.goodsData[index].voucher[j].amount;
                    this.goodsData[index].voucher[j].isselected = false;
                  };
                }
                // 重新紀錄優惠id（傳參數用）
                this.unit[index].level_percent='';
                this.unit[index].voucher_id=selectId
              }

              //如果这个商品的优惠券全部为不可选，则select变无可用优惠
              if(this.goodsData[i].voucher[j].isselected == false){
                sign = true;
                this.goodsData[i].hasAbleVoucher = true;
              }else{
                if (sign == false) {
                  this.goodsData[i].hasAbleVoucher = false;
                };
              }

            }
          //没有优惠券有vip折扣
          }else if(i == index){
            // 如果选择的折扣
            if(selectId == this.goodsData[i].level.percent){
              this.unit[index].level_percent=selectId;
              // 重新计划被选产品的优惠后价格
              this.goodsData[index].activePrice = this.twoInt(this.goodsData[index].discount * (1-this.goodsData[index].level.percent * 1/100))
              console.log(this.goodsData[index].activePrice)
              console.log(i)
            }else {
              this.unit[index].level_percent='';
              console.log(i)
              this.goodsData[index].activePrice = this.twoInt(this.goodsData[index].discount)
            }
          }
          // 总价钱
          this.toTal += parseInt(this.goodsData[i].activePrice)
          // console.log(this.unit[index].voucher_id)
          // if(i==index){
          //   this.unit[index].voucher_id = this.voucherSelected[index]
          // }
        }
        // console.log(this.goodsData)
        console.log(this.unit)
        this.currentArr[index] = this.voucherSelected[index]
        // console.log(this.currentArr)
      },
      submit: function(){
        var _this = this
        if (this.addressData.id != undefined){
          var crateParams = {
            cart_id: this.cart_id,
            contact_id: this.addressData.id,  //地址id
            delivery_time: "all", //送货时间
            delivery_phone: this.addressData.phone, //确认订单及发货通知使用
            comment: '',
            units: JSON.stringify(this.unit)
          }
          this.crateOrder(window.sessionStorage.getItem('token'), crateParams,function(data){
          _this.toast(_this.$t('confirmOrder.createOrder'))
          var orderId = data.data.id
          // 订单创建成功后跳到订单详情页面,
          _this.$router.replace({path:'/orderDetail', query:{orderId: orderId}})

          })
        }else{
          _this.toast(_this.$t('confirmOrder.noAdd'))
        }
      },
      // 获取默认地址
      defaultAddHttp: function(){
        var _this = this
        _this.getDefAddress(window.sessionStorage.getItem('token'), function(data){
          if(data.data.auction_contacts != undefined){
            _this.addressData = data.data.auction_contacts
          }
        })
      }
    },
    mounted(){
      let _this = this;
      _this.checkLogin(false,function(){
        // 获取默认地址
        _this.defaultAddHttp();

        //获取清单商品id;
        _this.id_Sku={
          user_id: '',
          products: _this.$route.query.id_Sku
        }

        //获取购物车id集合，创建订单参数用
        _this.cart_id = _this.$route.query.cart_id

        //获取清单商品
        _this.confirmOrder(window.sessionStorage.getItem('token'), _this.id_Sku, function(data){
          _this.goodsData = data.data;
          //存放已默认的优惠券id
          // var switchId=[111];
          //存放默认选中的产品和优惠券id,
          // var defaultArr = []

          for (var i=0;i<_this.goodsData.length;i++){
            _this.voucherSelected.push(_this.$t('confirmOrder.percent1'))
            _this.unit.push({
              product_id: _this.goodsData[i].product_id, //商品id
              voucher_id: '', //优惠券ID
              level_percent: '',  //折扣
              multibuy_id: '',  //连拍ID
              amount: '1',  //
              sku_id: _this.goodsData[i].sku.id,  //skuid
              sku_name: _this.goodsData[i].sku.name  //XL
            })


            //给所有产品添加自定义属性存放优惠后的价格，默认为原价
            _this.goodsData[i].activePrice = _this.goodsData[i].discount;
            // 给所有优惠券添加自定义属性isselected
            if(_this.goodsData[i].voucher.length!=0){
              //添加自定义属性是否还有可选优惠券
              _this.goodsData[i].hasAbleVoucher = true;
              for(var j=0;j<_this.goodsData[i].voucher.length;j++){
                //单个优惠券是否被选中
                _this.goodsData[i].voucher[j].isselected = false;
              }
            }else {
              //添加自定义属性是否还有可选优惠券
              _this.goodsData[i].hasAbleVoucher = false;
            }

            // 如果商品价格低于vip折扣最低限额， 则把此vip折扣设为零
            if(_this.goodsData[i].discount <= _this.goodsData[i].level.limitation){
              _this.goodsData[i].level.percent = 0;
              _this.isVipShow[i] = false;
            }
            // _this.goodsData[i].level.percent = 2
            // 如果有等级优惠，则取出优惠百分比，并改变优惠后价钱
            if(_this.goodsData[i].level.percent != ""){
              _this.isVipShow[i] = true;
              //如果没有等级优惠，有优惠券，则取出优惠券为默认选项
            }else if(_this.goodsData[i].level.percent == "" && _this.goodsData[i].voucher.length!=0){

            }
            //总价钱
            _this.toTal += parseInt(_this.goodsData[i].activePrice)
          }
          _this.loadingShow = false;
        })
      });
    },
    components: {
      topBar,
      loading
    }
  }
</script>

<style scoped>
.select-box {
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  opacity: 0;
  transition: all .5s;
}
.select-box.open {
  opacity: 1;
}
.pay-choice {
  padding-top: .2rem;
  font-size: .14rem;
  color: #911573;
  text-align: center;
  position: absolute;
  right: -65%;
  top: 0;
  width: 65%;
  height: 100%;
  background: #fff;
  transition: all .5s;
}
.pay-choice .pay {
  margin: .22rem auto 0;
  width: 1.01rem;
  height: .34rem;
  line-height: .3rem;
  text-indent: .23rem;
  border: 2px solid #bdbdbd;
}
.pay-choice .pay.active {
  border: 2px solid #911573;
}
.pay-choice .pay.zhaoshang {
  background: url(../../assets/banks@2x.png) no-repeat -.03rem 0rem/1.06rem 1.06rem;
}
.pay-choice .pay.ali {
  background: url(../../assets/icon-ali.png) no-repeat center/1.01rem .34rem;
}
.pay-choice .pay.wechat {
  color: #000;
  background: url(../../assets/icon-weChat.png) no-repeat center/1.01rem .34rem;
}
.pay-choice.open {
  right: 0;
}
.container {
  padding: .15rem 5%;
  border: 1px solid #eee;

}
h6 {
  font-size: .18rem;
  font-weight: normal;
}
.receive-detail {
  position: relative;
  color: #8e8e8e;
  padding-top: .15rem;
}
.receive-detail p {
  font-size: .14rem;
  line-height: .2rem;
  padding-right: .4rem;
}
.receive-detail p.p1 {
  font-size: .17rem;
}
.receive-detail p .receive-name {
  margin-right: .2rem;
}
.icon-Arrow {
  width: .08rem;
  height: .15rem;
  right: 5%;
  top: .25rem;
  display: block;
  position: absolute;
    background: url(../../assets/sprites.png) no-repeat -2.69rem -.29rem/3rem 1.8rem;
}
.icon-car, .icon-card {
  position: relative;
  display: inline-block;
  top: .04rem;
  width: .23rem;
  height: .17rem;
    margin-right: .03rem;
}
.icon-car {
    background: url(../../assets/sprites.png) no-repeat -.28rem -1.61rem/3rem 1.8rem;
}
.icon-card {
    background: url(../../assets/sprites.png) no-repeat -.01rem -1.62rem/3rem 1.8rem;
}
ul.pay-method {
  overflow: hidden;
  padding-top: .16rem;
}
ul.pay-method li {
  font-size: .14rem;
  line-height: .34rem;
  text-align: center;
  width: 1.01rem;
  float: left;
  margin-right: 5.5%;
  border: 2px solid #bdbdbd;
}
ul.pay-method li.active {
  border: 2px solid #eee;
}
.goods-container {
  padding-top: .17rem;
}
.goods-container h6{
  padding-left: 5%;
}
.shopping-list {
  padding: .17rem 0;
  font-size: .17rem;
  padding-bottom: .5rem;
}
.shopping-list li {
  position: relative;
  overflow: hidden;
  padding: .17rem 5%;
  border-bottom: 1px solid #eee;
}
.shopping-list li:first-child {
  border-top: 1px solid #eee;
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
  /* width: 89%; */
  font-size: .14rem;
  line-height: .16rem;
  margin-bottom: .05rem;
}
.pro-num {
  font-size: .13rem;
  color: #c8c7cc;
}
.pro-size {
/*   position: absolute;
  bottom: 0;
  line-height: .14rem; */
  font-size: .14rem;
}
.pro-price.active {
  color: #8e8e8e !important;
  text-decoration : line-through;
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
.discount-selector {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.discount-selector select {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #911573;
  padding-left: .2rem;
  background-color:transparent;
  font-size: .16rem;
}
.discount-selector.active select {
  color: #ccc;
}
.discount-price {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: .14rem;
  color: #911573;
}
.icon-plus {
  position: absolute;
  content: "";
  width: .17rem;
  height: .17rem;
  background: red;
  display: block;
  left: 0;
  bottom: 0;
  background: url(../../assets/sprites.png) no-repeat -.58rem -.58rem/3rem 1.8rem;
}
.discount-selector.active .icon-plus {
  background: url(../../assets/sprites.png) no-repeat -.76rem -.58rem/3rem 1.8rem;
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
}
.bottom .quantity {
  font-size: .13rem;
  padding-top: .04rem;
}
.bottom .quantity span {
  color: #911573;
}
.bottom .right {
  float: right;
  color: #fff;
  padding-top: .04rem;
}
.bottom .right.status {
  color: #000;
  line-height: .4rem;
}
.bottom .have-chosen {
  padding-top: .12rem;
}
button {
  width: 1.2rem;
  height: .4rem;
  background: #911573;
  border-radius: .05rem;
  color: #fff;
  font-size: .18rem;
}
</style>
