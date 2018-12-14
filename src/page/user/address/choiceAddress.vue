<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="backShow" titleShow="true" :title="$t('choiceAddress.title')">
    <div slot="c-con">
        <div class="add-btn" @click="add">
          <span class="icon-add"></span>
        </div>
    </div>
    </topBar>
    <div class="content">
      <div class="choice">
        <ul class="choice-list">
          <li :class="{'active': item.default==true}"  v-for="(item,index) in addressListData" @click=choice(index)>
            <p class="name-num"><span class="name">{{item.name}}</span>{{item.phone}}</p>
            <p>{{item.address}}</p>
            <!-- <p class="id-num">{{item.id}}</p> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import topBar from '../../../components/topBar/topBar.vue'
  import i18n from '../../../config/i18n'
  import loading from '../../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        loadingShow: true,//loading是否显示
        addressListData: [],
        params: {       //地址列表请求参数
          page: 1,
          per_page: 10
        },
        isHttp: true  //是否可请求
      }
    },
    methods: {
      add: function(){
        this.$router.replace({path:'/addAddress'})
      },
      choice: function(index){
        var _this=this;
        var defaultId = this.addressListData[index].id
        this.setDefAddress(window.sessionStorage.getItem('token'), defaultId, function(data){
          // 重新渲染默认地址
          for(var i=0; i<_this.addressListData.length;i++){
            _this.addressListData[i].default = false;
          }
          _this.addressListData[index].default = true;
          _this.$router.go(-1);
        })
      },
      // 地址列表请求
      addListHttp: function(){
        var _this = this;
        if(_this.isHttp){
          _this.isHttp = false;
          _this.addressList(window.sessionStorage.getItem('token'), _this.params, function(data){
            var data = data.data.auction_contacts
            if(_this.params.page == 1){
              _this.addressListData = data
              _this.loadingShow = false;
            }else {
              _this.addressListData = _this.addressListData.concat(data)
            }
            _this.isHttp = true;
            _this.params.page++;
            if(data.length < _this.params.per_page){
              _this.isHttp = false;
            }
          })
        }
      }
    },
    mounted(){
      let _this = this;
      _this.scrollMore(function () {
        _this.addListHttp();
      })
      _this.checkLogin(false,_this.addListHttp);
    },
    components: {
      topBar,
      loading
    },
  }
</script>

<style>
</style>

<style scoped>
.add-btn, .close-btn {
  padding: .10rem;
  position: fixed;
  top: .03rem;
}
.add-btn {
  right: 4.8%;
}
.close-btn {
  left: 4.8%;
}
.add-btn span, .close-btn span {
  display: block;
  width: .25rem;
  height: .25rem;
}
.add-btn span {
  background: url(../../../assets/sprites.png) no-repeat -2.24rem -1.31rem/3rem 1.8rem;
}
.close-btn span {
  background: url(../../../assets/sprites.png) no-repeat -2.49rem -1.19rem/3rem 1.8rem;
}
.choice {
  font-size: .14rem;
}
.choice .choice-list li {
  padding: .16rem 10%;
  border-bottom: 1px solid #eee;
}
.choice .choice-list li.active {
  background: #f7f6f6;
  position: relative;
}
.choice .choice-list li.active:before {
  content: "";
  position: absolute;
  width: .15rem;
  height: .15rem;
  top: .16rem;
  left: 4.5%;
  background: url(../../../assets/sprites.png) no-repeat -2.59rem -1.44rem/3rem 1.8rem;
}
.choice p {
  padding-top: .08rem;
  line-height: .18rem;
  color: #666;
}
.choice p.name-num {
  padding-top: 0;
  font-size: .17rem;
  color: #333;
}
.choice p span.name {
  margin-right: .2rem;
}
.choice p.id-num {
  color: #8e8e8e;
}
button {
  margin-top: .16rem;
  border-radius: .05rem;
  color: #fff;
  font-size: .18rem;
  width: 100%;
  height: .38rem;
  background: #000;
}
.add {
  position: relative;
}
.address {
  padding: 0 5%;
  font-size: .17rem;
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
  background: url(../../../assets/sprites.png) no-repeat -2.59rem -1.44rem/3rem 1.8rem;
}
.read-in.add-detail {
  height: 1.27rem;
}
</style>
