<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar :backShow="backShow" titleShow="true" :title="$t('brandCollection.title')">
    <div class="ctr" slot="c-con" @click="editCtr">{{editTxt}}</div>
    </topBar>
    <div class="content">
        <ul class="collect brand-collect">
          <li class="vc ac" v-for="(item,index) in brandData" @click.stop="goBrandDetail(index)">
            <p><span class="name-e">{{item.auction_brands.name}}</span><br><span class="name-c">{{item.auction_brands.chinese}}</span></p>
            <div class="fan_delete_ico" v-show="choiceIconShow" @click.stop="del(index)">
              <span class="icon-del"></span>
            </div>
          </li>
        </ul>
    </div>
    <!-- 无收藏品牌显示 -->
    <div class="empty" v-if="emptyShow">
      <div class="img"></div>
      <p>{{$t('brandCollection.noData')}}</p>
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
        brandData: [],
        choiceIconShow: false,
        emptyShow: false, //收藏为空显示
        editTxt: this.$t('brandCollection.edit'),
        backShow: true,
        brandListParams: {       //地址列表请求参数
          page: 1,
          per_page: 50
        },
        isHttp: true,  //是否可请求
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      goBrandDetail: function(index){
        this.$router.push({path: '/auction/products', query:{brand_id: this.brandData[index].brand_id, from: 'brand'}})
      },
      editCtr: function(){
        if (this.choiceIconShow ==false ) {
          this.choiceIconShow = true;
          this.backShow = false;
          this.editTxt = this.$t('brandCollection.complete')
        }else {
          this.choiceIconShow = false;
          this.backShow = true;
          this.editTxt = this.$t('brandCollection.edit')
        };
      },
      del: function(index){
        var message=confirm(this.$t('brandCollection.confirm'));
        if(message == true){
          var delId = this.brandData[index].brand_id
          var _this = this
          this.deleteBrand(this.sessionToken, delId, function(data){
            _this.brandData.splice(index,1)
            _this.isEmptyShow();
          })
        }
      },
      brandListHttp: function(){  //品牌收藏列表请求
        var _this = this
        if(_this.isHttp){
          _this.isHttp = false;
          _this.brandCollection(_this.sessionToken, _this.brandListParams, function(data){
            var data = data.data.auction_fanships
            if(_this.brandListParams.page == 1){
              _this.brandData = data;
              _this.loadingShow = false;
            }else{
              _this.brandData = _this.brandData.concat(data)
            }
            _this.isHttp = true;
            _this.brandListParams.page++;
            if(data.length < _this.brandListParams.per_page){
              _this.isHttp = false;
            }
            _this.isEmptyShow();
          })
        }
      },
      //无品牌收藏是否显示
      isEmptyShow: function(){
        var _this = this;
        if(_this.brandData.length==0){
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
      let _this = this;
      _this.scrollMore(function () {
        _this.brandListHttp();
      })
      _this.checkLogin(true, _this.brandListHttp);
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
  position: relative;
  width: 1.75rem;
  height: .96rem;
  background: url(https://t3.ihaveu.net/images/border@2x.png?201708030929) repeat-y left/.16rem .14rem,url(https://t3.ihaveu.net/images/border@2x.png?201708030929) repeat-y right/.16rem .14rem;

  background-color: #f7f6f6;
}
.brand-collect li:nth-child(2n+1) {
  float: left;
  margin: .16rem 0 0 5%;
}
.brand-collect li:nth-child(2n) {
  float: right;
  margin: .16rem 5% 0 0;
}
.brand-collect li p {
  width: 100%;
  line-height: .20rem;
}
.brand-collect li p .name-c {
  color: #8e8e8e;
}
.brand-collect li p .name-e {
  color: #252121;
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
  background: url("../../assets/sprites.png") no-repeat -2.58rem -1.62rem/3rem 1.8rem;
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
  background: url("../../assets/fan_empty.png") no-repeat center/contain;
}
</style>
