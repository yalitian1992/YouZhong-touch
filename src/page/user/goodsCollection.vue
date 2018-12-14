<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar :backShow="backShow" titleShow="true" :title="$t('goodsCollection.title')">
      <div class="ctr" slot="c-con" @click="editCtr">{{editTxt}}</div>
    </topBar>
    <div class="content">
        <ul class="collect brand-collect">
          <li class="" v-for="(item, index) in goodsData" @click.stop="goBrandDetail(index)">
            <div class="goods-img">
              <img :src="imgBaseUrl() + item.product.major_pic + '.m320.' + item.product.major_pic.split('.').reverse()[0]" alt="">
              <div class="fan_delete_ico" v-show="choiceIconShow">
                <span class="icon-del" @click.stop="del(index)"></span>
              </div>
            </div>
            <p class="pro-name txt-cut">{{item.product.name}}</p>
            <p class="pro-price">{{money + item.product.discount}}</p>
          </li>
        </ul>
    </div>
    <!-- 无收藏商品显示 -->
    <div class="empty" v-if="emptyShow">
      <div class="img"></div>
      <p>{{$t('goodsCollection.noData')}}</p>
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
        imgBaseUrl,            //图片域名
        loadingShow: true,//loading是否显示
        money,                 //钱的单位
        goodsData: [],
        choiceIconShow: false,
        emptyShow: false, //收藏为空显示
        editTxt: this.$t('goodsCollection.edit'),
        backShow: true,
        goodsListParams: {       //地址列表请求参数
          page: 1,
          per_page: 10
        },
        isHttp: true,  //是否可请求
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      goBrandDetail: function(index){
        this.$router.push({name: 'goodsDetails', params:{goods_id: this.goodsData[index].product_id}})
      },
      editCtr: function(){
        if (this.choiceIconShow ==false ) {
          this.choiceIconShow = true;
          this.backShow = false;
          this.editTxt = this.$t('goodsCollection.complete')
        }else {
          this.choiceIconShow = false;
          this.backShow = true;
          this.editTxt = this.$t('goodsCollection.edit')
        };
      },
      del: function(index){
        var message=confirm(this.$t('goodsCollection.confirm'));
        if(message == true){
          var delId = this.goodsData[index].product_id
          var _this = this
          this.deleteGoods(this.sessionToken, delId, function(data){
            _this.goodsData.splice(index,1)
            _this.isEmptyShow();
          })
        }
      },
      goodsListHttp: function(){  //品牌收藏列表请求
        var _this = this
        if(_this.isHttp){
          _this.isHttp = false;
          _this.goodsCollection(_this.sessionToken, _this.goodsListParams, function(data){
            var data = data.data.auction_favorites
            if(_this.goodsListParams.page == 1){
              _this.goodsData = data;
              _this.loadingShow = false;
            }else{
              _this.goodsData = _this.goodsData.concat(data)
            }
            _this.isHttp = true;
            _this.goodsListParams.page++;
            if(data.length < _this.goodsListParams.per_page){
              _this.isHttp = false;
            }
            _this.isEmptyShow();
          })
        }
      },
      //无商品收藏是否显示
      isEmptyShow: function(){
        var _this = this;
        if(_this.goodsData.length==0){
          _this.emptyShow = true;
        }else{
          _this.emptyShow = false;
        }
      }
    },
    components: {
      topBar,
      navBar,
      loading
    },
    mounted(){
      var _this = this;
      _this.scrollMore(function () {
        _this.goodsListHttp();
      })
      _this.checkLogin(true,_this.goodsListHttp);
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
.brand-collect {
  font-size: .14rem;
}
.brand-collect li {
  float: left;
  position: relative;
  width: 25%;
  text-align: center;
  margin: .2rem 0 0 6.25%;
}
.brand-collect li .goods-img {
  position: relative;
}
.brand-collect li img {
  width: 1.03rem;
  height: 1.03rem;
}
.brand-collect li .pro-name {
  font-size: .12rem;
  padding-top: .08rem;
  margin-bottom: .08rem;
  line-height: .16rem;
  height: .4rem;
}
.brand-collect li .pro-price {
  font-size: .11rem;
  padding-top: .02rem;
  color: #c0c0c0;
}
.fan_delete_ico {
    position: absolute;
    bottom: .04rem;
    right: .04rem;
    width: .26rem;
    height: .26rem;
    border-radius: .26rem;
    overflow: hidden;
    background: rgba(255,255,255,0.75);
}
.icon-del {
  display: inline-block;
  width: .15rem;
  height: .15rem;
  margin: .05rem;
  background: url("../../assets/sprites.png") no-repeat -2.56rem -1.61rem/3rem 1.8rem;
}
.empty {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1rem;
  margin: auto;
  font-size: .16rem;
  text-align: center;
  color: #8e8e8e;
  width: 80%;
}
.empty .img {
  margin: 0 auto;
  margin-bottom: .1rem;
  width: .82rem;
  height: .82rem;
  background: url("../../assets/fav_empty@2x.png") no-repeat center/contain;
}
</style>
