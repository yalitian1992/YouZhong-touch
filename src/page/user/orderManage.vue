<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('orderManage.title')"></topBar>
    <div class="content">
      <ul class="tabs flex ac">
        <li class="flex-1" :class="{active: tabsActiveIndex == index}" v-for="(item, index) in tabs" :key="index"
            @click="toggleStatus(index)">{{item.name}}
        </li>
      </ul>
      <ul class="order-list">
        <li v-for="(item, index) in orderList" :key="index">
          <div class="time">{{$t('orderManage.time')}}{{item.created_at}}</div>
          <router-link
            :to="{path: '/orderDetail', query: {orderId: item.trade_id, supplierOrderId: item.supplier_trade_id}}"
            tag="div" class="goods vc hb">
            <div class="img flex" :class="{'flex-1': item.units.length > 1}">
              <div v-for="(imgItem, imgIndex) in item.units" :key="imgIndex">
                <img :src="imgBaseUrl() + imgItem.major_pic + '.m290.' + imgItem.major_pic.split('.').reverse()[0]" alt="">
              </div>
            </div>
            <div class="flex-1" v-if="item.units.length == 1">
              <div class="name txt-cut">{{item.units[0].name}}</div>
              <div class="style-price hb">
                <div class="style">{{item.units[0].sku_name}}<span
                  v-if="item.units[0].sku_name != '' && item.units[0].sku_name !== undefined && item.units[0].sku_color != '' && item.units[0].sku_color !== undefined">丨</span>{{item.units[0].sku_color}}
                </div>
                <div class="price">{{money + item.units[0].discount}}</div>
              </div>
            </div>
            <div class="arrow"></div>
          </router-link>
          <div class="totle hb">
            <div>{{$t('orderManage.total')}}<span>{{money + item.payment_price}}</span></div>
            <div class="btn ac hb" v-if="tabsActiveIndex == 0">
              <div class="no-bg" @click="cancel_order(item.trade_id, index)">{{$t('orderManage.cancel')}}</div>
              <router-link
                :to="{path: '/orderDetail', query: {orderId: item.trade_id, supplierOrderId: item.supplier_trade_id}}"
                tag="div">{{$t('orderManage.payment')}}
              </router-link>
            </div>
            <div class="btn ac hb" v-if="tabsActiveIndex == 2">
              <router-link
                :to="{path: '/logistics', query: {logisticsParams: JSON.stringify({supplier_trade_id: item.supplier_trade_id, identifier: item.identifier, delivery_service: item.delivery_service, delivery_identifier: item.delivery_identifier, orderId: item.trade_id})}}"
                tag="div" class="no-bg">{{$t('orderManage.logistics')}}
              </router-link>
              <div @click="confirmReceive(item.supplier_trade_id, index)">{{$t('orderManage.confirmReceive')}}</div>
            </div>
          </div>
        </li>
        <li class="no-order ac" v-if="noOrder">
          <div></div>
          <p>{{$t('orderManage.noData')}}</p>
        </li>
      </ul>
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
        imgBaseUrl,              //图片域名
        loadingShow: true,       //loading是否显示
        money,                   //钱的单位
        tabsActiveIndex: 0,      //默认选中的下标
        tabs: [                  //订单状态切换标签内容
          {name: this.$t('orderManage.pay'), status: 'pay'},
          {name: this.$t('orderManage.ship'), status: 'ship,audit'},
          {name: this.$t('orderManage.receive'), status: 'receive'},
          {name: this.$t('orderManage.complete'), status: 'complete'}
        ],
        orderList: [],           //订单列表
        noOrder: false,          //是否无数据
        params: {                //请求参数
          page: 1,
          page_size: 10,
          status: 'pay'
        },
        isHttp: true,           //是否能请求
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      /*切换状态订单列表*/
      toggleStatus: function (index) {
        if (this.tabsActiveIndex !== index) {
          this.tabsActiveIndex = index;
          this.params.page = 1;
          this.params.status = this.tabs[index].status;
          this.noOrder = false;
          this.isHttp = true;
          this.orderHttp();
        }
      },
      /*取消订单*/
      cancel_order: function (id, index) {
        let isCancel = window.confirm(this.$t('orderManage.cancelOrder')), _this = this;
        if (isCancel) {
          _this.cancelOrder(_this.sessionToken, id, function () {
            _this.orderList.splice(index, 1);
            if (_this.orderList.length == 0) {
              _this.noOrder = true;
            }
          });
        }
      },
      /*确认收货*/
      confirmReceive: function (id, index) {
        let _this = this;
        _this.sureReceive(_this.sessionToken, {supplier_trade_id: id}, function () {
          _this.toast(_this.$t('orderManage.receiveSuccess'));
          _this.orderList.splice(index, 1);
          if (_this.orderList.length == 0) {
            _this.noOrder = true;
          }
        })
      },
      /*订单列表请求*/
      orderHttp: function () {
        let _this = this;
        if (_this.isHttp) {
          _this.isHttp = false;
          _this.getOrderList(_this.sessionToken, _this.params, function (data) {
            if (_this.params.page == 1) {
              _this.orderList = data.data.trades;
              if (_this.orderList.length === 0) {
                _this.noOrder = true;
              }
              _this.loadingShow = false;
            } else {
              _this.orderList = _this.orderList.concat(data.data.trades);
            }
            _this.isHttp = true;
            _this.params.page++;
            if (data.data.trades.length < _this.params.page_size) {
              _this.isHttp = false;
            }
          })
        }
      }
    },
    components: {
      topBar,
      navBar,
      loading
    },
    mounted(){
      let _this = this;
      _this.scrollMore(function () {
        _this.orderHttp();
      })
      _this.checkLogin(true, function () {
        if (_this.$route.query.from == 'logistics') {
          _this.tabsActiveIndex = 2;
          _this.params.status = 'receive';
        }
        _this.orderHttp();
      });
    }
  }
</script>

<style scoped>
  .tabs {
    font-size: .15rem;
    height: .32rem;
    border-top: 1px solid #2f2f2f;
    border-bottom: 1px solid #2f2f2f;
  }

  .tabs li {
    line-height: .3rem;
    border-right: 1px solid #2f2f2f;
  }

  .tabs li.active {
    color: #fff;
    background: #2f2f2f;
  }

  .tabs li:last-child {
    border: none;
  }

  .order-list li {
    padding: .2rem;
    font-size: .14rem;
  }

  .order-list li.no-order {
    padding: 2.57rem 0 0;
  }

  .order-list li.no-order > div {
    height: .84rem;
    background: url("../../assets/noOrder.png") no-repeat center top/.84rem .84rem;
  }

  .order-list li.no-order p {
    color: #8e8e8e;
    font-size: .15rem;
    margin-top: .12rem;
  }

  .order-list .time {
    color: #010101;
    line-height: .2rem;
  }

  .order-list .goods {
    margin: .16rem 0;
  }

  .order-list .goods .img {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .order-list .goods .img, .order-list .goods .img > div:not(:last-child), .order-list .goods .flex-1 {
    margin-right: .18rem;
  }

  .order-list .goods img {
    width: .77rem;
    height: .77rem;
  }

  .order-list .goods .arrow {
    width: .08rem;
    height: .15rem;
    background: url("../../assets/sprites.png") no-repeat -2.69rem -.29rem/3rem 1.8rem;
  }

  .order-list .goods .flex-1 {
    height: .77rem;
    position: relative;
  }

  .order-list .goods .name {
    line-height: .16rem;
  }

  .order-list .goods .style-price {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .goods .style-price .style {
    color: #8e8e8e;
  }

  .goods .style-price .style span {
    padding: 0 .02rem;
  }

  .goods .style-price .price, .order-list .totle span {
    color: #911573;
  }

  .order-list .totle > div {
    height: .3rem;
    line-height: .3rem;
  }

  .order-list .totle span {
    font-weight: bold;
  }

  .order-list .totle .btn > div {
    width: .64rem;
    height: .3rem;
    line-height: .28rem;
    border: 1px solid #911573;
    border-radius: .05rem;
    background: #911573;
    color: #fff;
    font-size: .15rem;
    margin-left: .18rem;
  }

  .order-list .totle .btn > div.no-bg {
    background: #fff;
    color: #000;
    border-color: #000;
  }
</style>
