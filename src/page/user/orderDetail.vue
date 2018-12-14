<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('orderDetail.title')"></topBar>
    <div class="content">
      <div class="trade-info">
        <div class="trade-time">
          <span class="fl">{{$t('orderDetail.time')}}</span>
          <p class="fr">{{detailData.created_at}}</p>
        </div>
        <div class="trade-num">
          <span class="fl">{{$t('orderDetail.num')}}</span>
          <p class="fr">{{detailData.supplier_trade_identifier || detailData.identifier}}</p>
        </div>
        <div class="trade-detail">
          <span class="fl">{{$t('orderDetail.receiveInfo')}}</span>
          <p class="fr"><span class="trade-name">{{detailData.address.name}}</span><span>{{detailData.address.phone}}</span></P>
          <p class="fr trade-addr">{{detailData.address.address}}</p>
        </div>
      </div>
      <!-- 商品清单列表 -->
      <ul class="shopping-list">
        <li v-for="(item, index) in detailData.units" @click="goGoodsDetail(index)">
          <div class="img">
            <img :src="imgBaseUrl() + item.major_pic + '.promote.' + item.major_pic.split('.').reverse()[0]" alt="">
          </div>
          <div class="pro-info">
            <p class="pro-tit txt-cut">{{item.name}}</p>
            <p class="pro-size">
              <span v-if="item.sku_name!='null'">{{item.sku_name}}</span>
              <span>{{item.sku_color}}</span>
              <span class="pro-price">{{money + item.discount}}</span>
            </p>
          </div>
          <p>
            <span class="icon-cancel"></span>
          </p>
          <div class="return-goods" v-if="detailData.status=='complete'">
            <span class="return-equest" v-if="detailData.units[index].status == undefined" @click.stop="returnAction(index)">{{$t('orderDetail.status1')}}</span>
            <span class="return-status" v-if="detailData.units[index].status == 'audit'" @click.stop="gouReturnDetail(index)">{{$t('orderDetail.status2')}}</span>
            <span class="return-status" v-if="detailData.units[index].status == 'transfer'" @click.stop="gouReturnDetail(index)">{{$t('orderDetail.status3')}}</span>
            <span class="return-status" v-if="detailData.units[index].status == 'complete'" @click.stop="gouReturnDetail(index)">{{$t('orderDetail.status4')}}</span>
            <span class="return-status" v-if="detailData.units[index].status == 'freezed'" @click.stop="gouReturnDetail(index)">{{$t('orderDetail.status5')}}</span>
            <span class="return-status" v-if="detailData.units[index].status == 'receive'" @click.stop="gouReturnDetail(index)">{{$t('orderDetail.status10')}}</span>
          </div>
        </li>
      </ul>
      <!-- 选择支付方式选择框 -->
      <div class="select-box" :class="{'open': isOpen}" v-show="isSelectShow" @click.self="closeChoice()">
        <!-- 选择支付方式 -->
        <div class="pay-choice" :class="{'open': isOpen}">
          <div class="pay-container">
            <!-- <ul class="pay-method">
              <li v-for="(item, index) in paymentData" v-if="item.payment_service=='express'" :class="{'active': item.isselected}" @click="ChangePayMethod(index)"><span class="icon-car"></span>{{item.name}}</li>
              <li :class="{'active': false}" @click="openChoice"><span class="icon-card"></span>{{methodTxt}}</li>
            </ul> -->
          </div>
          <!-- 線上付款 -->
          <h6>{{$t('orderDetail.onlinePay')}}</h6>
          <div v-for="(item, index) in paymentData.payment_services" class="pay" :class="{'active': item.isselected, 'wechat': item.payment_service=='wechat', 'paypal': item.payment_service=='paypal', 'ali': item.payment_service=='alipay'}" @click="ChangePayMethod(index)" v-if="item.payment_service!='express'"><span :class="{'icon-car': item.payment_service=='express',}"></span>{{item.name}}</div>
          <!-- 貨到付款 -->
          <h6 class="daofu">{{$t('orderDetail.COD')}}</h6>
          <div v-for="(item, index) in paymentData.payment_services" class="pay" :class="{'active': item.isselected, 'wechat': item.payment_service=='wechat', 'ali': item.payment_service=='alipay'}" @click="ChangePayMethod(index)" v-if="item.payment_service=='express'"><span :class="{'icon-car': item.payment_service=='express',}"></span>{{item.name}}</div>
          <div class="no-express-Prompt" v-if="paymentData.is_express == false">此订单不支持货到付款</div>
          <p class="warning" v-if="payMethod!='express'&&payMethod!=''">{{$t('orderDetail.payTime')}}</p>
          <div class="gopay">
            <div class="gopay-content">
              <p class="p1" v-if="payMethod!=''">{{$t('orderDetail.selected')}} {{payName}} <span class="gopay-price">{{money + detailData.payment_price}}</span></p>
              <div v-if="payMethod!='express'&&payMethod!=''">
                <p class="p2">{{$t('orderDetail.goNew')}}</p>
                <button @click="goPay">{{$t('orderDetail.surePay')}}</button>
              </div>
              <div v-if="payMethod=='express'">
                <button @click="goPay">{{$t('orderDetail.sure')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 订单详情底部 -->
      <div class="bottom checkout">
        <div class="bottom-box">
          <div class="left">
            <p>{{$t('orderDetail.total')}}<span class="total-price">{{money + detailData.payment_price}}</span></p>
            <p class="quantity">{{$t('orderDetail.freightFree')}}</p>
          </div>
          <!--代付款-->
          <div class="right">
            <button v-if="detailData.status=='pay'" class="btn-cancel" @click="cancelHttp">{{$t('orderDetail.cancel')}}</button>
            <button v-if="detailData.status=='pay'" @click="openChoice">{{$t('orderDetail.pay')}}</button>
            <button v-if="detailData.status=='receive'" class="btn-cancel" @click="getLogistics">{{$t('orderDetail.logistics')}}</button>
            <button v-if="detailData.status=='receive'" @click="ReceiveHttp(detailData.supplier_trade_id)">{{$t('orderDetail.receive')}}</button>
            <span v-if="detailData.status=='audit' || detailData.status=='ship'">{{$t('orderDetail.status6')}}</span>
            <span v-if="detailData.status=='cancel'">{{$t('orderDetail.status7')}}</span>
            <span v-if="detailData.status=='complete'">{{$t('orderDetail.status8')}}</span>
            <span v-if="detailData.status=='freezed'">{{$t('orderDetail.status9')}}</span>
          </div>
        </div>
      </div>
      <!-- 退货信息填写表 -->
      <div class="return-info" v-if="returnInfoShow">
        <p class="note">{{$t('orderDetail.returnTip')}}</p>
        <div class="content">
            <div class="address">
              <div class="read-in" v-if="detailData.payment_service == 'express'">
                <span>{{$t('orderDetail.name')}}</span>
                <input type="text" maxlength=6 :placeholder="$t('orderDetail.nameTip')" v-model="returnInfo.return_name">
                <em class="ok-icon" v-show="true"></em>
              </div>
              <div class="read-in">
                <span>{{$t('orderDetail.tel')}}</span>
                <input class="" type="tel" maxlength=11 :placeholder="$t('orderDetail.telTip')" v-model="returnInfo.return_phone">
                <em class="ok-icon"></em>
              </div>
              <div class="read-in" v-if="detailData.payment_service == 'express'">
                <span>{{$t('orderDetail.province')}}</span>
                <select class="provinces" v-model="addAddressData.province" @change="provinceSelect">
                  <option v-for="(item, index) in ChinaArea" :value="item.name">{{item.name}}</option>
                </select>
                <em class="ok-icon"></em>
              </div>
              <div class="read-in" v-if="detailData.payment_service == 'express'">
                <span>{{$t('orderDetail.city')}}</span>
                <select class="city" v-model="addAddressData.city">
                  <option v-for="(item, index) in ChinaArea[cityIndex].cities" :value="item.name">{{item.name}}</option>
                </select>
                <em class="ok-icon"></em>
              </div>
              <div class="read-in" v-if="detailData.payment_service == 'express'">
                <span>{{$t('orderDetail.bank')}}</span>
                <input class="" type="tel" maxlength=18 :placeholder="$t('orderDetail.bankTip')" v-model="returnInfo.return_branch">
                <em class="ok-icon"></em>
              </div>
              <div class="read-in" v-if="detailData.payment_service == 'express'">
                <span>{{$t('orderDetail.code')}}</span>
                <input class="" type="tel" :placeholder="$t('orderDetail.codeTip')" v-model="returnInfo.return_account">
                <em class="ok-icon"></em>
              </div>
            </div>
            <div class="address">
              <!-- <div class="read-in">
                <span>联系电话</span>
                <input class="" type="tel" maxlength=11 placeholder="有效的手机号码">
                <em class="ok-icon"></em>
              </div> -->
            </div>
            <button @click="sureRturn">{{$t('orderDetail.sure')}}</button>
            <button @click="cancelRturn">{{$t('orderDetail.cancel')}}</button>
        </div>
      </div>
      <!-- 退貨信息详情 -->
      <div class="return-detail return-info" v-if="returnDetailShow">
        <p class="note">{{$t('orderDetail.returnDetail')}}</p>
        <div class="content">
          <div class="address">
            <div class="read-in" v-if="detailData.payment_service == 'express'">
              <span>{{$t('orderDetail.name')}}  {{returnDetailData.return_name}}</span>
            </div>
            <div class="read-in">
              <span>{{$t('orderDetail.tel')}} {{returnDetailData.return_phone}}</span>
            </div>
            <div class="read-in" v-if="detailData.payment_service == 'express'">
              <span>{{$t('orderDetail.province')}} {{returnDetailData.return_province}}</span>
            </div>
            <div class="read-in" v-if="detailData.payment_service == 'express'">
              <span>{{$t('orderDetail.city')}} {{returnDetailData.return_city}}</span>
            </div>
            <div class="read-in" v-if="detailData.payment_service == 'express'">
              <span>{{$t('orderDetail.bank')}} {{returnDetailData.return_branch}}</span>
            </div>
            <div class="read-in" v-if="detailData.payment_service == 'express'">
              <span>{{$t('orderDetail.code')}} {{returnDetailData.return_account}}</span>
            </div>
            <button @click="closeReturnDetail">{{$t('orderDetail.goBack')}}</button>
          </div>
        </div>
      </div>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import loading from '../../components/loading/loading.vue'
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import {imgBaseUrl, money} from '../../config/config'
  import wx from 'weixin-js-sdk'
  import i18n from '../../config/i18n'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,         //图片域名
        money,              //钱的单位
        returnDetailData: {}, //退货详情
        returnDetailShow: false, //
        ChinaArea: [{
          name: this.$t('orderDetail.bj'),
          cities: [{
            name: this.$t('orderDetail.bj'),
            towns: [{
              name: this.$t('orderDetail.dc'),
            }]
          }]
        }],
        cityIndex: '0',
        townIndex: '0',
        addAddressData: {   //添加地址数据
          province: this.$t('orderDetail.bj'),
          city: this.$t('orderDetail.bj'),
          town: this.$t('orderDetail.dc')
        },
        detailData: { //详情数据
          created_at: "",
          delivery_time: "",
          identifier:"",
          address: {
            name: "",
            address: "" ,
            phone: ""
          }
        },
        returnInfo: {
          id: 1,  //#units表id
          supplier_trade_id: '',   //#供应商订单ID
          return_name: '',    //#退款人
          return_phone: '',   //#退款电话
          return_province: this.$t('orderDetail.bj'),   //,#退款省份
          return_city: this.$t('orderDetail.bj'),   //#退款城市
          return_branch: '',    //#退款支行
          return_account: '',   //#退款帐号
          payment_service: ''    //#支付类型
        }, //退货信息
        payMethod: '', //已选的支付方式（传参用）
        payName: '',  //已选的支付方式名字
        goodsData: [],  //清单列表
        paymentData: [], //支付列表
        methodTxt: "在线支付",
        choiceIndex: '',  //被点商品索引值
        isOpen: false,
        isSelectShow: false,
        aliShow: true,  //阿里支付显示
        wechatShow: true,  //微信支付显示
        returnInfoShow: false,  //退货信息提示框显示
        orderId: '',  // 订单id
        supplierOrderId: '',  // 供应商id
        paymentStatus: true, //支付状态显示
        paramsSencend: {}, //二次支付参数
        sessionToken: '', //sessionStorage中保存的token
        loadingShow: true // loading
      }
    },
    methods: {
      inputverify: function(){
        var userData;
        userData=this.returnInfo;
        var reg=/^\d{6}$/;
        var regs=/^1(3|4|5|7|8)[0-9]\d{8}/
        //如果是货到付款判断的多
        if(this.detailData.payment_service == 'express'){
          if(!userData.return_name){
            this.toast(this.$t('addAddress.inputName'))
            return false;
          }

          if(!userData.return_phone){
            this.toast(this.$t('addAddress.inputTel'))
            return false;
          }else if(!regs.test(userData.return_phone)){
            this.toast(this.$t('addAddress.telError'));
            return false
          }

          if(!userData.return_branch){
            this.toast(this.$t('addAddress.inputBranch'))
            return false;
          }

          if(!userData.return_account){
            this.toast(this.$t('addAddress.inputAccount'))
          }
        // 如果是线上支付只判断手机号
        }else {
          if(!userData.return_phone){
            this.toast(this.$t('addAddress.inputTel'))
            return false;
          }else if(!regs.test(userData.return_phone)){
            this.toast(this.$t('addAddress.telError'));
            return false
          }
        }
        return userData;
      },
      ChangePayMethod: function(index){
        for(var i=0;i<this.paymentData.payment_services.length;i++){
          this.paymentData.payment_services[i].isselected=false;
        }
        this.paymentData.payment_services[index].isselected=true;
        this.payMethod = this.paymentData.payment_services[index].payment_service
        this.payName = this.paymentData.payment_services[index].name
        console.log(this.payMethod)
      },
      openChoice: function(){
        var _this = this;
        _this.isSelectShow = true;
        setTimeout(function () {
          _this.isOpen = true;
        }, 0)
      },
      closeChoice: function(){
        var _this = this;
          _this.isOpen = false;
        setTimeout(function () {
        _this.isSelectShow = false;
        }, 500)
        // this.ChangePayMethod(methodId)
      },
      goGoodsDetail: function(index){
        var unitsArr = this.detailData.units
        this.$router.push({name: 'goodsDetails', params:{goods_id: unitsArr[index].product_id}})
      },
      goPay: function(){
        var _this = this

        //支付宝支付
        if(this.payMethod == "alipay"){
          var url = window.location.href
          url = url.replace('#/','')
          var aliParams = {
            trade_id: this.orderId, //订单id
            return_url: url  //支付完成后返回到前端的地址
          }
          this.aliPay(this.sessionToken, aliParams, function(data){
            window.location.href=data.data.url;
          })

        //微信支付http://test-api-server.ihaveu.com
        }else if(this.payMethod == "wechat"){
            window.location.replace("/api/pay/wechats/mobile_wx_pay?trade_id=" + this.orderId + "&return_url=" + window.location.href);

        //PayPal支付
        }else if(this.payMethod == "paypal") {
          this.loadingShow = true;
          var paramsFirst = {
            trade_id: this.orderId,
            return_url: window.location.href
          }
          this.paypalFirst(this.sessionToken, paramsFirst, function(data){
            var url = data.data.url
            window.location.href=data.data.url;
            var trade_id = _this.$route.query.trade_id
          })

        //货到付款
        }else if(this.payMethod == "express"){
          var cashParams = {
            trade_id: this.orderId
          }
          this.cashOnDelivery(this.sessionToken, cashParams, function(data){
            _this.detailData.status = "audit"
          })
        }
        _this.closeChoice()
      },
      //确认收货
      ReceiveHttp: function(id){
        var message=confirm(this.$t('orderDetail.sureReceive'));
        if(message == true){
          var _this = this;
          var params = {
            supplier_trade_id: id
          }
          _this.sureReceive(this.sessionToken, params, function(data){
            _this.toast(_this.$t('orderDetail.receiveSuccess'))
            _this.detailData.status = "complete"
          })
        }
      },
      //取消订单
      cancelHttp: function(){
        var message=confirm(this.$t('orderDetail.cancelOrder'));
        if(message == true){
          var _this = this;
          _this.cancelOrder(this.sessionToken, this.orderId, function(data){
            _this.toast(_this.$t('orderDetail.cancelSuccess'))
            _this.detailData.status = "cancel"

          })
        }
      },
      //查看物流
      getLogistics: function(){
        //物流查询所需参数
        var logisticsParams = {
          supplier_trade_id: this.detailData.supplier_trade_id,  //"子订单id",
          identifier: this.detailData.identifier, //#供应商订单号
          delivery_service: this.detailData.delivery_service,  //'快递服务商',
          delivery_identifier: this.detailData.delivery_identifier, //'快递单号'
          orderId: this.orderId,
        }
        console.log(logisticsParams)
        this.$router.push({path: '/logistics', query: {logisticsParams: JSON.stringify(logisticsParams)}})
      },
      provinceSelect: function(){
        var provinces =  this.ChinaArea
        for(var i=0; i<provinces.length; i++){
          if(provinces[i].name == this.addAddressData.province){
            console.log(provinces[i].cities[0].name)
            this.addAddressData.city = provinces[i].cities[0].name
            this.cityIndex = i;
          }
        }
      },
      //退货操作
      returnAction: function(index){
        console.log(this.choiceIndex)
        this.choiceIndex = index
        var _this = this;
        _this.returnInfoShow = true;
        _this.returnInfo.id = _this.detailData.units[index].unit_id;
        _this.areaHttp();
      },
      //确认退货
      sureRturn: function(){
        var _this = this;
        // 如果是货到付款订单
        if(_this.detailData.payment_service == 'express'){
          var params = this.inputverify();
          if(params){
            _this.returnGoods(this.sessionToken, params, function(data){
              _this.toast(_this.$t('orderDetail.returnSuccess'))
              _this.returnInfoShow = false;
              // 退货成功后更新页面状态
              _this.detailData.units[_this.choiceIndex].status = "audit"
            })
          }
        // 如果是在线支付订单
        }else{
          var params = this.inputverify();
          if(params){
            params = {
              id: _this.returnInfo.id,  //#units表id
              supplier_trade_id: _this.returnInfo.supplier_trade_id,   //#供应商订单ID
              return_phone: _this.returnInfo.return_phone
            }
            _this.returnGoods(this.sessionToken, params, function(data){
              _this.toast(_this.$t('orderDetail.returnSuccess'))
              _this.returnInfoShow = false;
              // 退货成功后更新页面状态
              _this.detailData.units[_this.choiceIndex].status = "audit"
            })
          }
        }
      },
      //取消退货
      cancelRturn: function(){
        this.returnInfoShow = false;
      },
      // 待审核按钮
      gouReturnDetail: function(index){
        this.returnDetailShow = true;
        var _this = this
        var params = {
          unit_id: _this.detailData.units[index].unit_id
        }
        this.returnDetail(_this.sessionToken, params, function(data){
          var data = data.data
          _this.returnDetailData = data
        })
      },
      // 关闭退货详情
      closeReturnDetail: function(){
        this.returnDetailShow = false;
      },
      //获取支付列表
      paymentListHttp: function(){
        var _this = this
        // 获取支付列表
        this.paymentList(this.sessionToken, {trade_id: _this.orderId}, function(data){
          var data = data.data
          for(var i=0;i<data.payment_services.length;i++){
            data.payment_services[i].isselected=false;
          }
          _this.paymentData = data
        })
      },
      //网络地址请求
      areaHttp: function(){
        var _this = this;
        _this.provincesCities(_this.sessionToken, function(data){
          var data = data.data.auction_contacts.countries[0].provinces
          _this.ChinaArea = data
          _this.cityIndex = '4';
          _this.townIndex =  '0';
        })
      }

    },
    mounted(){
      var _this = this;
      _this.checkLogin(true,function(){
            // 订单id
        _this.orderId = _this.$route.query.orderId || '';
        // 供应商id
        _this.supplierOrderId = _this.$route.query.supplierOrderId || '';
        _this.returnInfo.supplier_trade_id = _this.supplierOrderId

        // 获取支付列表
        _this.paymentListHttp();

        // 订单详情数据
        _this.orderDetail(_this.sessionToken, {supplier_trade_id: _this.supplierOrderId}, _this.orderId ,function(data){
          var data = data.data;
          _this.detailData = data;
          //paypal支付状态验证
          //获取二次支付参数
          _this.paramsSencend = {
            paymentId: _this.$route.query.paymentId,
            token: _this.$route.query.token,
            PayerID: _this.$route.query.PayerID
          }
          if(_this.detailData.status != "audit") {
            if (_this.paramsSencend.paymentId != undefined){
              _this.loadingShow = true;
              _this.paypalSencond(_this.sessionToken, _this.paramsSencend, function(data){
                _this.detailData.status = "audit"
              _this.loadingShow = false;
              })
            }
          }
          _this.loadingShow = false;
        })
      });
    },
    components: {
      topBar,
      navBar,
      loading
    }
  }
</script>

<style scoped>
.trade-info {
  padding: .15rem 5%;
  font-size: .18rem;
}
.trade-info p {
  line-height: .20rem;
  width: 69%;
  color: #8e8e8e;
}
.trade-info>div {
  overflow: hidden;
  padding-top: .15rem;
}
.trade-name {
  margin-right: .1rem;
}
.trade-addr {
  margin-top: .05rem;
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
  border-bottom: 1px solid #ddd;
}
.shopping-list li:first-child {
  border-top: 1px solid #ddd;
}
.shopping-list .img {
  float: left;
  width: .77rem;
  height: .77rem;
}
.shopping-list .img img {
  width: 100%;
}
.shopping-list .pro-info {
  width: 63%;
  height: .77rem;
  float: right;
  position: relative;
}
.shopping-list .pro-info p {
  width: 100%;
}
.shopping-list .pro-info p.pro-tit {
  width: 89%;
  font-size: .14rem;
  line-height: .18rem;
}
.shopping-list .return-goods {
  color: #666;
  clear: both;
  padding-top: .2rem;
  font-size: .14rem;
}
.shopping-list .return-goods span {
  margin-left: .3rem;
  float: right;
  text-decoration: underline;
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
  color: #911573;
}
.bottom .right {
  height: .5rem;
  line-height: .5rem;
  float: right;
  color: #000;
}
.bottom .right.status {
  color: #000;
  line-height: .4rem;
}
.bottom .have-chosen {
  padding-top: .12rem;
}
button {
  width: .8rem;
  height: .4rem;
  background: #911573;
  border-radius: .05rem;
  color: #fff;
  font-size: .18rem;
}
button.btn-cancel {
  background: #fff;
  color: #000;
  border: 1px solid #000;
  margin-right: .2rem;
}
/* .gopay {
  position: ;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
} */
.gopay .gopay-content {
  position: absolute;
  bottom: 0;
  height: 1.94rem;
  width: 70%;
  background: #fff;
}
.gopay p {
  font-size: .14rem;
  text-align: center;
  color: #8e8e8e;
}
.gopay p.p1 {
  font-size: .18rem;
  color: #000;
  margin-top: .32rem;
  margin-bottom: .12rem;
}
.gopay p.p2 {
  margin-bottom: .46rem;
}
.gopay p.p1 .gopay-price {
  color: #911573;
}
.gopay button {
  color: #000;
  background: #fff;
  border: 1px solid #2f2f2f;
  display: block;
  width: 90%;
  margin: 0 auto;
}


/* 支付选择框部分 */
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
  padding: .2rem 5%;
  font-size: .14rem;
  /* text-align: center; */
  position: absolute;
  right: -65%;
  top: 0;
  width: 65%;
  height: 100%;
  background: #fff;
  transition: all .5s;
}
.pay-choice h6.daofu {
  padding-top: .5rem;
}
.pay-choice .pay {
  text-align: center;
  margin: .22rem auto 0;
  width: 1.01rem;
  height: .34rem;
  line-height: .3rem;
  border: 2px solid #bdbdbd;
}
.pay-choice .pay.active {
  color: #911573;
  border: 2px solid #911573;
}
.pay-choice .pay.zhaoshang {
  background: url(../../assets/banks@2x.png) no-repeat -.03rem 0rem/1.06rem 1.06rem;
}
.pay-choice .pay.ali {
  text-indent: .3rem;
  background: url(../../assets/icon-ali.png) no-repeat center/1.01rem .34rem;
}
.pay-choice .pay.wechat {
  text-indent: .3rem;
  background: url(../../assets/icon-weChat.png) no-repeat center/1.01rem .34rem;
}
.pay-choice .pay.paypal {
  text-indent: .3rem;
  background: url(../../assets/icon-paypal.png) no-repeat center/1.01rem .34rem;
}
.pay-choice.open {
  right: 0;
}
.pay-choice p.warning {
  color: #333;
  padding-top: 1rem;
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
.no-express-Prompt {
  font-size: .13rem;
  color: #333;
  line-height: .35rem;
  text-indent: 2em;
}
/* 退货信息表样式 */

.return-info {
  position: fixed;
  top: .5rem;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  font-size: .18rem;
}
.return-info button {
  display: block;
  margin: 0 auto;
  margin-top: .5rem;
}
.return-info p.note {
  font-size: .15rem;
  color: #911573;
  padding: 5%;
  line-height: .2rem;
}
.address {
  padding: 0 5%;
  font-size: .17rem;
}
input, select, textarea {
  color: #2f2f2f!important;
}
.address input {
  background: #f6f6f6;
  font-size: .17rem;
  line-height: .24rem;
  margin-left: 3.7%;
}
.address select {
  width: 80%;
  font-size: .17rem;
  margin-left: 5.5%;
 background: transparent;
}
.address textarea {
 background: transparent;
  vertical-align: top;
  resize: none;
  width: 66%;
  height: 1.08rem;
  margin: .09rem 0 0 5%;
  font-size: .17rem;
}
.read-in {
  height: .38rem;
  line-height: .38rem;
  background: #f6f6f6;
  padding: 0 4.4%;
  border-radius: .05rem;
  margin-top: .1rem;
  position: relative;
}
.read-in em.ok-icon {
  display: block;
  width: .15rem;
  height: .15rem;
  position: absolute;
  right: 3.3%;
  top: .12rem;
  background: url(../../assets/sprites.png) no-repeat -2.59rem -1.44rem/3rem 1.8rem;
}
.read-in.add-detail {
  height: 1.27rem;
}
</style>
