<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('logistics.title')"></topBar>
    <div class="content">
      <div class="container">
        <h6>{{$t('logistics.receiveInfo')}}</h6>
        <div class="receive-detail">
          <p class="p1"><span class="receive-name">{{$t('logistics.status')}}</span><span class="status">{{state[logisticsData.state]}}</span></p>
          <p class="p1"><span class="receive-name">{{$t('logistics.num')}}</span>{{logisticsParams.delivery_identifier}}</p>
          <p class="p1"><span class="receive-name">{{$t('logistics.from')}}</span>{{companyName}}</p>
          <!-- <p class="p1"><span class="receive-name">官方电话</span>400000000000</p> -->
        </div>
      </div>
      <ul class="logistics-info">
        <li class="active" v-for="(item,index) in logisticsData.data">
          <dl>
            <dd>{{item.context}}</dd>
            <dd>{{item.time}}</dd>
          </dl>
        </li>
        <li v-if="logisticsData.status == undefined || logisticsData.state == 0" class="noinfo">
          <p>{{$t('logistics.noInfo')}}</p>
        </li>
      </ul>
      <!-- 订单商品列表 -->
      <div class="list">
        <h6>{{$t('logistics.goods')}}</h6>
        <ul class="shopping-list">
          <li v-for="(item,index) in goodsList.units" @click=goGoodsDetail(index)>
            <div class="img">
              <img :src="imgBaseUrl() + item.major_pic + '.promote.' + item.major_pic.split('.').reverse()[0]" alt="">
            </div>
            <div class="pro-info">
              <p class="pro-tit">{{item.name}}</p>
              <p class="pro-size">
                <span>{{item.sku_name}}</span>
                <span>{{item.sku_color}}</span>
                <span class="pro-price">{{money + item.discount}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import {imgBaseUrl, money} from '../../config/config'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        loadingShow: true,//loading是否显示
        state: {
          "0": this.$t('logistics.status1'),
          "1": this.$t('logistics.status2'),
          "2": this.$t('logistics.status3'),
          "3": this.$t('logistics.status4'),
          "4": this.$t('logistics.status5'),
          "5": this.$t('logistics.status6'),
          "6": this.$t('logistics.status7')
        },
        logisticsParams: {},  //参数数据
        companyName: '',     //物流公司名字
        imgBaseUrl,         //图片域名
        money,              //钱的单位
        logisticsData: {
          com: "",
          condition: "",
          data: [],
          ischeck: "",
          message: "",
          nu: "",
          state: "",
          status: "",

        },  //物流数据
        goodsList: [],  //清单商品
        isOpen: false,
        isSelectShow: false,
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      //物流接口
      logisticsHttp: function(){
        var _this = this;
        var params = {
          supplier_trade_id: _this.logisticsParams.supplier_trade_id,
          identifier:  _this.logisticsParams.identifier,
          delivery_service:  _this.logisticsParams.delivery_service,
          delivery_identifier:  _this.logisticsParams.delivery_identifier
        }
        _this.getLogistics(_this.sessionToken, params, function(data){
          _this.logisticsData = data.data
          _this.loadingShow = false;
        })
      },
      logisticsCompany: function(str){
        switch(str){
          case 'fedex':
            return this.$t('logistics.fedex')
            break;
          case 'zjs':
            return this.$t('logistics.zjs')
            break;
          case 'ems':
            return this.$t('logistics.ems')
            break;
          case 'offline':
            return this.$t('logistics.offline')
            break;
          case 'pickup':
            return this.$t('logistics.pickup')
            break;
          case 'sf':
            return this.$t('logistics.sf')
            break;
          case 'yt':
            return this.$t('logistics.yt')
            break;
          case 'scic':
            return this.$t('logistics.scic')
            break;
          case 'bestex':
            return this.$t('logistics.bestex')
            break;
          case 'deppon':
            return this.$t('logistics.deppon')
            break;
          case 'dhl':
            return this.$t('logistics.dhl')
            break;
          case 'yunda':
            return this.$t('logistics.yunda')
            break;
          case 'zyzoom':
            return this.$t('logistics.zyzoom')
            break;
          case 'ttkdex':
            return this.$t('logistics.ttkdex')
            break;
          case 'xlobo':
            return this.$t('logistics.xlobo')
            break;
          case 'express_au':
            return this.$t('logistics.express_au')
            break;
          default:
            return ''
          }
      },
      //清单商品接口
      goodsListHttp: function(){
        var _this = this
        var params = {
          supplier_trade_id: _this.logisticsParams.supplier_trade_id
        }
        var orderId = _this.logisticsParams.orderId
        _this.orderDetail(_this.sessionToken, params, orderId ,function(data){
          _this.goodsList = data.data;
          _this.loadingShow = false;
        })
      },
      goGoodsDetail: function(index){
        var unitsArr = this.goodsList.units
        this.$router.push({name: 'goodsDetails', params:{goods_id: unitsArr[index].product_id}})
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
      }

    },
    components: {
      topBar,
      navBar,
      loading
    },
    mounted(){
      this.logisticsParams = JSON.parse(this.$route.query.logisticsParams)
      this.companyName = this.logisticsCompany(this.logisticsParams.delivery_service)
      var _this = this
      _this.checkLogin(true, function(){
        _this.logisticsHttp();
        _this.goodsListHttp();
      });
    }
  }
</script>

<style>
</style>

<style scoped>
.container {
  padding: .15rem 5%;
}
.list {
  padding: .15rem 0;
}
.list h6 {
  padding-left: 5%;
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
.receive-detail .status {
  color: #911573;
}
.receive-detail p {
  font-size: .14rem;
  line-height: .18rem;
}
.receive-detail p.p1 {
  font-size: .14rem;
}
.receive-detail p .receive-name {
  margin-right: .2rem;
}
.icon-car {
    background: url(../../assets/sprites.png) no-repeat -.28rem -1.61rem/3rem 1.8rem;
}
.icon-card {
    background: url(../../assets/sprites.png) no-repeat -.01rem -1.62rem/3rem 1.8rem;
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
  line-height: .16rem;
  padding-bottom: .05rem;
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

.logistics-info {
  padding: .2rem 5%;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.logistics-info li {
  position: relative;
  color: #8e8e8e;
  border-left: .02rem solid #ddd;
  padding-left: .4rem;
}
.logistics-info li.noinfo {
  border: none;
  padding-left: 0;
}
.logistics-info li.noinfo:before {
  display: none;
}
.logistics-info li.noinfo p  {
  font-size: .14rem;
  color: #8e8e8e;
}
.logistics-info li:first-child {
  color: #911573;
}
.logistics-info li:before, .logistics-info li:first-child:before {
  top: -.02rem;
  left: -.06rem;
  width: .1rem;
  height: .1rem;
  content: "";
  background: #ddd;
  border-radius: 50%;
  position: absolute;
}
.logistics-info li:first-child:before {
  top: -.02rem;
  left: -.08rem;
  border: .02rem solid #E6AFDC;
  background: #911573;
}
.logistics-info li dl {
  padding: .1rem 0;
  font-size: .14rem;
  border-radius: .05rem;
  overflow: hidden;
  border-bottom: 1px solid #eee;
}
.logistics-info li dl:last-child {
  border: none;
}
.logistics-info li dl dd {
  line-height: .2rem;
}
.logistics-info li dl dd:last-child {
  font-size: .13rem;
  padding-top: .03rem;
}
</style>
