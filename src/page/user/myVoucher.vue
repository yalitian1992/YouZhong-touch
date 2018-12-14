<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('myVoucher.title')"></topBar>
    <div class="content">
      <!-- <div class="voucher_input_bg clear">
        <input class="voucher fl" type="text" :placeholder="$t('myVoucher.tips')" v-model.trim="redeemCode">
        <div class="btn ac fr" :class="{'have-val': redeemCode}" @click="add">{{$t('myVoucher.add')}}</div>
      </div> -->
      <div class="voucher-form-tit">
        <span class="fl">{{$t('myVoucher.name')}}</span>
        <span class="voucher-data fr">{{$t('myVoucher.time')}}</span>
      </div>
      <ul class="voucher-list" v-if="haveData">
        <li :class="{active1: item.overdue, active2: item.trade_id}" v-for="(item, index) in voucherData" :key="index">
          <p class="voucher-name">{{item.event.name}}</p>
          <p class="voucher-note">{{item.event.description}}</p>
          <span class="voucher-term">{{item.event.ended_at.slice(0, 10)}}</span>
          <span class="expired">{{$t('myVoucher.endTime')}}</span>
          <span class="al-use">{{$t('myVoucher.alUse')}}</span>
        </li>
      </ul>
      <div class="voucher-empty" v-else>
        <p>{{$t('myVoucher.noData')}}</p>
      </div>
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        loadingShow: true,//loading是否显示
        redeemCode: "",
        voucherData: [],  //优惠券列表
        haveData: true,   //优惠券列表是否有数据
        params: {
          page: 1,
          per_page: 20
        },
        isHttp: true,     //是否能请求
        sessionToken: ''  //sessionStorage中保存的token
      }
    },
    methods: {
      add: function () {
        let _this = this;
        if (_this.redeemCode) {
          _this.addCoupon(_this.sessionToken, {voucher: {identifier: _this.redeemCode}}, function () {
            _this.haveData = true;
            _this.params.page = 1;
            _this.isHttp = true;
            _this.getList();
          })
        }
      },
      getList: function () {
        let _this = this;
        if (_this.isHttp) {
          _this.isHttp = false;
          _this.couponList(_this.sessionToken, _this.params, function (data) {
            let list = data.data.auction_vouchers;
            for (let i = 0, len = list.length; i < len; i++) {
              let time = list[i].event.ended_at.replace(/-/g, ':').replace(' ', ':').split(':');
              if (+new Date() > +new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])) {
                list[i].overdue = true;
              } else {
                list[i].overdue = false;
              }
            }
            if (_this.params.page == 1) {
              _this.voucherData = list;
              if (_this.voucherData.length === 0) {
                _this.haveData = false;
              }
              _this.loadingShow = false;
            } else {
              _this.voucherData = _this.voucherData.concat(list);
            }
            _this.isHttp = true;
            _this.params.page++;
            if (list.length < _this.params.per_page) {
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
        _this.getList();
      })
      _this.checkLogin(true, _this.getList);
    }
  }
</script>

<style scoped>
  .voucher_input_bg .voucher, .voucher_input_bg .btn {
    height: .38rem;
    line-height: .38rem;
    border-radius: .05rem;
    font-size: .18rem;
  }

  .voucher_input_bg .voucher {
    width: 60%;
    background: #f7f6f6;
    padding: 0 .1rem;
    margin: .13rem .1rem .13rem 5%;
  }

  .voucher_input_bg .btn {
    width: 20%;
    color: #fff;
    background: #B4B4B4;
    margin: .13rem 5% .13rem 0;
  }

  .voucher_input_bg .btn.have-val {
    background: #000;
  }

  .voucher-form-tit {
    font-size: .17rem;
    background: #eee;
    overflow: hidden;
    padding: .1rem 5%;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .voucher-data {
    padding-left: .45rem;
    border-left: 1px solid #ddd;
  }

  .voucher-list {
    color: #8e8e8e;
    font-size: .15rem;
    padding: 0 0 0 5%;
  }

  .voucher-list li {
    overflow: hidden;
    position: relative;
    padding: .18rem 0;
    border-bottom: 1px solid #ddd;
  }

  .voucher-list li .expired, .voucher-list li .al-use {
    display: none;
  }

  .voucher-list .voucher-name {
    color: #000;
    padding-bottom: .1rem;
  }

  .voucher-list .voucher-note {
    font-size: .13rem;
  }

  .voucher-list .voucher-term {
    position: absolute;
    right: 5%;
    top: .33rem;
  }

  .voucher-list li.active1, .voucher-list li.active2 {
    opacity: .3;
  }

  .voucher-list li.active1 .expired, .voucher-list li.active2 .al-use {
    display: block;
  }

  .expired, .al-use {
    background: #999;
    position: absolute;
    right: -.3rem;
    font-size: .12rem;
    top: .05rem;
    padding: .03rem .3rem;
    color: #fff;
    transform: rotate(45deg);
  }

  .voucher-empty {
    position: relative;
    height: .93rem;
    margin-top: 2.395rem;
    background: url(../../assets/voucher_empty@2x.png) no-repeat top/.8rem .66rem;

  }

  .voucher-empty p {
    font-size: .15rem;
    text-align: center;
    color: #8e8e8e;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
