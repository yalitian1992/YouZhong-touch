<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true">
      <div class="classify" slot="c-con">
        <div class="specific-1 ac" :class="{open: cLShow}" @click="cLShow = true">
          <div>{{titleText}}<span></span></div>
        </div>
        <div class="classify-list-1" v-show="cLShow" @click.self="cLShow = false">
          <ul>
            <li v-for="(item,index) in clList" :class="{active: clDefIndex == index}"
                @click="chooseCL(index, item.text)" :key="index">{{item.text}}
            </li>
            <span></span>
          </ul>
        </div>
      </div>
    </topBar>
    <div class="content">
      <ul class="classify-list-2">
        <li v-for="(item, index) in classifyList" :key="index">
          <div class="specific-2" @click="spreadCategory(index)">
            <div class="specific-2-name">{{item.name}}</div>
          </div>
          <ul class="classify-list-3" v-show="item.spread">
            <li v-for="(nextItem, nextIndex) in item.nextCategory" @click="goGoodsList(index, nextIndex)"
                :key="nextIndex">{{nextItem.name}}<span></span></li>
          </ul>
        </li>
      </ul>
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
        loadingShow: true,   //loading是否显示
        titleText: '',       //标题显示文字
        cLShow: false,       //大分类列表是否显示
        clList: [            //大分类列表
          {text: this.$t('classify.man'), target: 'men', category1Id: undefined},
          {text: this.$t('classify.woman'), target: 'women', category1Id: undefined},
          {text: this.$t('classify.furnishings'), target: undefined, category1Id: 103},
          {text: this.$t('classify.outdoors'), target: undefined, category1Id: 193},
          {text: this.$t('classify.eastLuxuries'), target: undefined, category1Id: 203},
        ],
        clDefIndex: 0,       //大分类类别选中下标
        params: {where: {}}, //请求参数
        classifyList: [],    //分类列表
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      /*大分类列表选择*/
      chooseCL: function (index, text) {
        let _this = this;
        _this.clDefIndex = index;
        _this.titleText = text;
        _this.params.where.target = undefined;
        _this.params.where.category1_id = undefined;
        _this.params.where.category2_id = undefined;
        if (_this.clList[index].target) {
          _this.sexFilterHttp(index);
        } else {
          _this.params.where.category1_id = _this.clList[index].category1Id;
          _this.getGoodsList(_this.params, function (data) {
            for (let i = 0, len = data.data.products_facet.category2_id.length; i < len; i++) {
              data.data.products_facet.category2_id[i].spread = false;
              data.data.products_facet.category2_id[i].nextCategory = [];
            }
            _this.classifyList = data.data.products_facet.category2_id;
          })
        }
        _this.cLShow = false;
      },
      /*男士、女士展开分类列表，家居、户外、东方奢侈品跳转到商品列表*/
      spreadCategory: function (index) {
        if (this.clDefIndex === 0 || this.clDefIndex === 1) {
          for (let i = 0, len = this.classifyList.length; i < len; i++) {
            this.classifyList[i].spread = false;
          }
          this.classifyList[index].spread = true;
          this.$nextTick(function () {
            let top = document.getElementsByClassName('specific-2')[index].offsetTop,
              height = document.getElementsByClassName('top-bar')[0].offsetHeight;
            window.scroll(0, top - height);
          })
        } else {
          let category1_id = this.clList[this.clDefIndex].category1Id,
            category2_id = this.classifyList[index].value;
          this.routerPush('', category1_id, category2_id, this.classifyList[index].name);
        }
      },
      /*男士、女士跳转到商品列表页面*/
      goGoodsList: function (index, i) {
        if (this.clDefIndex === 0 || this.clDefIndex === 1) {
          let target = this.clList[this.clDefIndex].target,
            category1_id = this.classifyList[index].value,
            category2_id = this.classifyList[index].nextCategory[i].value;
          if (i === this.classifyList[index].nextCategory.length - 1) {
            this.routerPush(target, category1_id, '', this.classifyList[index].name);
            return false;
          }
          this.routerPush(target, category1_id, category2_id, this.classifyList[index].nextCategory[i].name);
        }
      },
      /*跳转到商品列表页面*/
      routerPush: function (target, category1_id, category2_id, title) {
        this.$router.push({
          path: '/auction/products',
          query: {
            target: target,
            category1_id: category1_id,
            category2_id: category2_id,
            title: title,
            from: 'classify'
          }
        })
      },
      /*男士，女士分类数据请求*/
      sexFilterHttp: function (index) {
        let _this = this;
        _this.params.where.target = _this.clList[index].target;
        _this.getGoodsList(_this.params, function (data) {
          for (let i = 0, len = data.data.products_facet.category1_id.length; i < len; i++) {
            let everyData = data.data.products_facet.category1_id[i];
            everyData.spread = false;
            everyData.nextCategory = [];
            everyData.all = {
              value: everyData.value,
              count: everyData.count,
              name: _this.$t('classify.all') + everyData.name
            };
          }
          _this.classifyList = data.data.products_facet.category1_id;
          _this.loadingShow = false;
          for (let i = 0, len = _this.classifyList.length; i < len; i++) {
            _this.params.where.category1_id = _this.classifyList[i].value;
            _this.getGoodsList(_this.params, function (res) {
              _this.classifyList[i].nextCategory = res.data.products_facet.category2_id || [];
              _this.classifyList[i].nextCategory.push(_this.classifyList[i].all);
            })
          }
        })
      }
    },
    components: {
      topBar,
      navBar,
      loading
    },
    mounted(){
      /*设置标题文字*/
      this.titleText = this.clList[0].text;
      /*请求分类列表*/
      this.sexFilterHttp(0);
      this.checkLogin(true);
    }
  }
</script>

<style scoped>
  /*头部一级分类*/
  .classify {
    font-weight: bold;
  }

  .specific-1 {
    width: 70%;
    height: .5rem;
    font-size: .2rem;
    margin: 0 auto;
    position: relative;
  }

  .specific-1 > div {
    line-height: .48rem;
    padding-right: .18rem;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .specific-1 > div span {
    position: absolute;
    border-width: .07rem .05rem;
    border-style: solid;
    border-color: #86847F transparent transparent transparent;
    top: .22rem;
    right: 0;
  }

  .specific-1.open > div span {
    top: .15rem;
    border-color: transparent transparent #86847F transparent;
  }

  /*二级分类*/
  .specific-2, .classify-list-3 li {
    border-bottom: 1px solid #C8C7CC;
  }

  .specific-2 .specific-2-name {
    line-height: .69rem;
    font-size: .18rem;
    padding-left: .2rem;
  }

  .classify-list-3 li {
    height: .5rem;
    line-height: .5rem;
    margin-left: .2rem;
    font-size: .15rem;
    color: #87847f;
    position: relative;
  }

  .classify-list-3 li span {
    position: absolute;
    top: .18rem;
    right: .2rem;
    width: .08rem;
    height: .15rem;
    background: url("../../assets/sprites.png") no-repeat -2.69rem -.29rem/3rem 1.8rem;
  }
</style>
