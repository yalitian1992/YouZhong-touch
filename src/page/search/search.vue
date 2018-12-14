<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('navBar.search')"></topBar>
    <div class="content">
      <div class="search-bar hb">
        <div class="search-input clear">
          <label class="fl" for="con"><span></span></label><input class="fl" id="con" type="text"
                                                                  v-model.trim="searchCon" @focus="toggleClearBtn"
                                                                  @blur="loseFocus" @input="toggleClearBtn"
                                                                  v-focus="isFocus" :placeholder="$t('search.defaultCon')">
          <div class="clear-con fr" v-show="isClearCon" @click="clearCon">
            <div></div>
          </div>
        </div>
        <div class="search-btn ac" @click="goSearch">{{$t('navBar.search')}}</div>
      </div>
      <!--搜索历史和热门推荐-->
      <!--<div class="his-rec">
        <div class="tabs flex ac">
          <div class="flex-1" :class="{active: !isActive}" @click="isActive = !isActive">搜索历史</div>
          <div class="flex-1" :class="{active: isActive}" @click="isActive = !isActive">热门推荐</div>
        </div>
        <div class="his" v-show="!isActive">
          <ul>
            <li v-for="item in historyList">{{item}}</li>
            <li class="no-his ac">
              <div></div>
              <p>您还没有搜索记录</p>
            </li>
          </ul>
          <div class="delete-his ac" v-if="historyList.length > 0" @click="clearHis">清除历史</div>
        </div>
        <ul class="rec" v-show="isActive">
          <li>2016春夏新款</li>
          <li>2016春夏新款</li>
          <li>2016春夏新款</li>
          <li>2016春夏新款</li>
          <li>最新上架</li>
        </ul>
      </div>-->
    </div>
    <navBar :sessionToken="sessionToken"></navBar>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import navBar from '../../components/navBar/navBar.vue'
  import i18n from '../../config/i18n'
  export default {
    i18n,
    data() {
      return {
        isClearCon: false, //清除按钮×是否显示
        isFocus: false,    //搜索框是否获得焦点
        isActive: true,   //热门推荐是否选中
        searchCon: '',    //搜索内容
        historyList: [],  //搜索历史列表
        hotList: [],      //热门推荐列表
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    directives: {
      focus: {
        update: function (el, {value}) {
          if (value) {
            el.focus();
          }
        }
      }
    },
    methods: {
      /*隐藏或显示清除按钮*/
      toggleClearBtn: function () {
        this.isClearCon = this.searchCon ? true : false;
      },
      /*清除搜索内容*/
      clearCon: function () {
        this.searchCon = '';
        this.isClearCon = false;
        this.isFocus = true;
      },
      /*搜索框失去焦点*/
      loseFocus: function () {
        let _this = this;
        _this.isFocus = false;
        setTimeout(function () {
          _this.isClearCon = false;
        }, 10)
      },
      /*搜索*/
      goSearch: function () {
        if (this.searchCon) {
//          this.historyList.push(this.searchCon);
          this.$router.push({path: '/auction/products', query: {from: 'search', keyword: this.searchCon}});
        }
      },
      /*清除搜索历史记录*/
      clearHis: function () {
        this.historyList = [];
      }
    },
    components: {
      topBar,
      navBar
    },
    mounted(){
      this.checkLogin(true);
    }
  }
</script>

<style scoped>
  /*搜索条*/
  .search-bar {
    height: .58rem;
    padding: .1rem .2rem;
  }

  .search-bar > div, .delete-his {
    border-radius: .05rem;
  }

  .search-input {
    width: 2.86rem;
    background: #f7f6f6;
    overflow: hidden;
  }

  .search-input label {
    width: .31rem;
    height: .38rem;
    padding: .1rem .06rem .11rem .08rem;
  }

  .search-input label span {
    display: block;
    height: 100%;
    background: url("../../assets/sprites.png") no-repeat -1.42rem -.27rem/3rem 1.8rem;
  }

  .search-input input {
    width: 2.22rem;
    height: .38rem;
    line-height: .38rem;
    background: #f7f6f6;
    font-size: .17rem;
  }

  .search-input .clear-con {
    width: .33rem;
    height: .38rem;
    padding: .11rem .08rem .1rem;
  }

  .search-input .clear-con div {
    height: 100%;
    background: url("../../assets/sprites.png") no-repeat -1.24rem -.27rem/3rem 1.8rem;
  }

  .search-btn {
    width: .75rem;
    line-height: .38rem;
    background: #000;
    color: #fff;
    font-size: .18rem;
  }

  /*搜索历史和热门推荐*/
  .his-rec .tabs {
    height: .4rem;
    font-size: .15rem;
    border-top: 1px solid #2f2f2f;
    border-bottom: 1px solid #2f2f2f;
  }

  .his-rec .tabs > div {
    line-height: .38rem;
  }

  .his-rec .tabs > div.active {
    color: #fff;
    background: #2f2f2f;
  }

  .his li, .rec li {
    padding: 0 .2rem;
    height: .45rem;
    line-height: .45rem;
    font-size: .14rem;
    color: #8e8e8e;
  }

  .his li.no-his {
    padding-top: 2.35rem;
  }

  .his li.no-his div {
    height: .88rem;
    background: url("../../assets/search_empty.png") no-repeat center top/.88rem .88rem;
  }

  .his li.no-his p {
    font-size: .15rem;
    margin-top: .12rem;
  }

  .delete-his {
    width: 1.34rem;
    height: .3rem;
    line-height: .28rem;
    font-size: .15rem;
    margin: .2rem auto;
    border: 1px solid #2f2f2f;
  }
</style>
