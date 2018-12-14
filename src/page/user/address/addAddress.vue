<template>
  <div>
    <topBar backShow="backShow" titleShow="true" :title="$t('addAddress.title')">
    </topBar>
    <div class="content">
        <div class="address">
          <div class="read-in">
            <span>{{$t('addAddress.people')}}</span>
            <input type="text" maxlength="6" :placeholder="$t('addAddress.peopleTip')" v-model="addAddressData.name">
            <em class="ok-icon" v-show="addAddressData.name.length != 0"></em>
          </div>
          <div class="read-in">
            <span>{{$t('addAddress.tel')}}</span>
            <input class="" type="tel" maxlength="11" :placeholder="$t('addAddress.telTip')" v-model="addAddressData.phone">
            <em class="ok-icon" v-show="addAddressData.phone.length == 11"></em>
          </div>
          <div class="read-in">
            <span>{{$t('addAddress.province')}}</span>
            <select class="provinces" v-model="addAddressData.province" @change="provinceSelect">
              <option v-for="(item, index) in ChinaArea" :value="item.name">{{item.name}}</option>
            </select>
            <em class="ok-icon"></em>
          </div>
          <div class="read-in">
            <span>{{$t('addAddress.city')}}</span>
            <select class="city" v-model="addAddressData.city" @change="citiesSelect">
              <option v-for="(item, index) in ChinaArea[cityIndex].cities" :value="item.name">{{item.name}}</option>
            </select>
            <em class="ok-icon"></em>
          </div>
          <div class="read-in">
            <span>{{$t('addAddress.area')}}</span>
            <select class="areas" v-model="addAddressData.town">
              <option v-for="(item, index) in ChinaArea[cityIndex].cities[townIndex].towns" :value="item.name">{{item.name}}</option>
            </select>
            <em class="ok-icon"></em>
          </div>
          <div class="read-in add-detail">
            <span>{{$t('addAddress.address')}}</span>
            <textarea :placeholder="$t('addAddress.address')" v-model="addAddressData.address"></textarea>
            <em class="ok-icon" v-show="addAddressData.address.length >= 8"></em>
          </div>
          <div class="read-in">
            <span>{{$t('addAddress.postCode')}}</span>
            <input class="" type="tel" maxlength="6" placeholder="100000" v-model="addAddressData.postcode">
            <em class="ok-icon" v-show="addAddressData.postcode.length == 6"></em>
          </div>
          <button @click="okSure">{{$t('addAddress.sure')}}</button>
        </div>
    </div>
  </div>
</template>

<script>
  import topBar from '../../../components/topBar/topBar.vue'
  import i18n from '../../../config/i18n'
  export default {
    i18n,
    data() {
      return {
        ChinaArea: [{
          name:this.$t('addAddress.bj'),
          cities: [{
            name: this.$t('addAddress.bj'),
            towns: [{
              name: this.$t('addAddress.dc'),
            }]
          }]
        }],
        cityIndex: '0',
        townIndex: '0',
        addAddressData: {   //添加地址数据
          name: "",
          id_number: "",
          province: this.$t('addAddress.bj'),
          city: this.$t('addAddress.bj'),
          town: this.$t('addAddress.dc'),
          address: "",
          postcode: "100000",
          phone: "",
          is_default: "true"  //设为默认地址
        }
      }
    },
    methods: {
      inputverify: function(){
        var userData;
        userData=this.addAddressData;
        var reg=/^\d{6}$/;
        var regs=/^1(3|4|5|7|8)[0-9]\d{8}/
        if(!userData.name){
          this.toast(this.$t('addAddress.inputName'))
          return false;
        }
        if(!userData.phone){
          this.toast(this.$t('addAddress.inputTel'))
          return false;
        }else if(!regs.test(userData.phone)){
          this.toast(this.$t('addAddress.telError'));
          return false
        }
        if(!userData.address){
          this.toast(this.$t('addAddress.inputAddress'))
          return false;
        }else if(userData.address.length<=5){
          this.toast(this.$t('addAddress.addressError'))
          return false;
        }
        if(userData.postcode){
          if(!reg.test(userData.postcode)){
            this.toast(this.$t('addAddress.postError'));
            return false
          }
        }
        return userData;
      },
      provinceSelect: function(){
        var provinces =  this.ChinaArea
        for(var i=0; i<provinces.length; i++){
          if(provinces[i].name == this.addAddressData.province){
            this.addAddressData.city = provinces[i].cities[0].name
            this.cityIndex = i;
          }
        }
        this.citiesSelect()
      },
      citiesSelect: function(){
        var cities = this.ChinaArea[this.cityIndex].cities
        for(var i=0; i<cities.length; i++){
          if(cities[i].name == this.addAddressData.city){
            this.addAddressData.town = cities[i].towns[1].name
            this.townIndex = i;
          }
        }
      },
      okSure: function(){
        // 设为默认
        this.addAddressData.is_default = true
        var pramasData = this.inputverify();
        if(pramasData){
          pramasData = {
            "contact": this.addAddressData
          }
          var _this = this
          this.addAddress(window.sessionStorage.getItem('token'), pramasData, function(data){
            _this.$router.back()
          })
        }
      },
      //网络地址请求
      areaHttp: function(){
        var _this = this;
        _this.provincesCities(window.sessionStorage.getItem('token'), function(data){
          var data = data.data.auction_contacts.countries[0].provinces
          _this.ChinaArea = data
          _this.cityIndex = '4';
          _this.townIndex =  '0';
        })
      }
    },
    mounted(){
      this.checkLogin(false,this.areaHttp);
    },
    components: {
      topBar
    }
  }
</script>

<style scoped>
button {
  margin-top: .16rem;
  border-radius: .05rem;
  color: #fff;
  font-size: .18rem;
  width: 100%;
  height: .38rem;
  background: #000;
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
  line-height: 1.2;
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
