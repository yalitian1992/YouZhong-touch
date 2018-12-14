<template>
  <div>
    <loading :loadingShow="loadingShow"></loading>
    <topBar backShow="true" titleShow="true" :title="$t('brandList.title')"></topBar>
    <div class="content">
      <div class="brand-list">
        <div :class="key" v-for="(value, key) in brandData" v-show="value.isShow" :key="key">
          <div class="index">{{value.text}}</div>
          <ul>
            <router-link :to="{path: '/auction/products', query: {brand_id: item.id, from: 'brand'}}" tag="li" class="hb"
                         v-for="(item, index) in value.list" :key="index">
              <div class="name">
                <div class="en one-txt-cut">{{item.name}}</div>
                <div class="cn one-txt-cut">{{item.chinese}}</div>
              </div>
              <div class="img" v-if="key == 'hot'">
                <img :src="imgBaseUrl() + item.pic" alt="">
              </div>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="alp-index ac">
        <ul>
          <li v-show="brandData.hot.isShow" @click="goPosition('hot')"><span>{{$t('brandList.hot1')}}</span><span>{{$t('brandList.hot2')}}</span></li>
          <li v-for="(value,key) in brandData" v-show="value.isShow" v-if="value.text != '热门'" @click="goPosition(key)"
              :key="key">{{value.text}}
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
  import {imgBaseUrl} from '../../config/config'
  import i18n from '../../config/i18n'
  import loading from '../../components/loading/loading.vue'
  export default {
    i18n,
    data() {
      return {
        imgBaseUrl,   //图片域名
        loadingShow: true,//loading是否显示
        brandData: {
          hot: {text: '热门', isShow: false, list: []},
          a: {text: 'A', isShow: false, list: []},
          b: {text: 'B', isShow: false, list: []},
          c: {text: 'C', isShow: false, list: []},
          d: {text: 'D', isShow: false, list: []},
          e: {text: 'E', isShow: false, list: []},
          f: {text: 'F', isShow: false, list: []},
          g: {text: 'G', isShow: false, list: []},
          h: {text: 'H', isShow: false, list: []},
          i: {text: 'I', isShow: false, list: []},
          j: {text: 'J', isShow: false, list: []},
          k: {text: 'K', isShow: false, list: []},
          l: {text: 'L', isShow: false, list: []},
          m: {text: 'M', isShow: false, list: []},
          n: {text: 'N', isShow: false, list: []},
          o: {text: 'O', isShow: false, list: []},
          p: {text: 'P', isShow: false, list: []},
          q: {text: 'Q', isShow: false, list: []},
          r: {text: 'R', isShow: false, list: []},
          s: {text: 'S', isShow: false, list: []},
          t: {text: 'T', isShow: false, list: []},
          u: {text: 'U', isShow: false, list: []},
          v: {text: 'V', isShow: false, list: []},
          w: {text: 'W', isShow: false, list: []},
          x: {text: 'X', isShow: false, list: []},
          y: {text: 'Y', isShow: false, list: []},
          z: {text: 'Z', isShow: false, list: []}
        },
        sessionToken: '' //sessionStorage中保存的token
      }
    },
    methods: {
      /*字母索引到指定位置*/
      goPosition: function (cl) {
        var top = document.getElementsByClassName(cl)[0].offsetTop,
          height = document.getElementsByClassName('top-bar')[0].offsetHeight;
        window.scroll(0, top - height);
      },
      /*处理数据*/
      doData: function (obj, list) {
        for (let i = 0, len = list.length; i < len; i++) {
          let brand = list[i];
          if (brand.recommend == 'hot') {
            obj.brandData.hot.list.push(brand);
          }
          switch (brand.initial) {
            case 'A':
              obj.brandData.a.list.push(brand);
              break;
            case 'B':
              obj.brandData.b.list.push(brand);
              break;
            case 'C':
              obj.brandData.c.list.push(brand);
              break;
            case 'D':
              obj.brandData.d.list.push(brand);
              break;
            case 'E':
              obj.brandData.e.list.push(brand);
              break;
            case 'F':
              obj.brandData.f.list.push(brand);
              break;
            case 'G':
              obj.brandData.g.list.push(brand);
              break;
            case 'H':
              obj.brandData.h.list.push(brand);
              break;
            case 'I':
              obj.brandData.i.list.push(brand);
              break;
            case 'J':
              obj.brandData.j.list.push(brand);
              break;
            case 'K':
              obj.brandData.k.list.push(brand);
              break;
            case 'L':
              obj.brandData.l.list.push(brand);
              break;
            case 'M':
              obj.brandData.m.list.push(brand);
              break;
            case 'N':
              obj.brandData.n.list.push(brand);
              break;
            case 'O':
              obj.brandData.o.list.push(brand);
              break;
            case 'P':
              obj.brandData.p.list.push(brand);
              break;
            case 'Q':
              obj.brandData.q.list.push(brand);
              break;
            case 'R':
              obj.brandData.r.list.push(brand);
              break;
            case 'S':
              obj.brandData.s.list.push(brand);
              break;
            case 'T':
              obj.brandData.t.list.push(brand);
              break;
            case 'U':
              obj.brandData.u.list.push(brand);
              break;
            case 'V':
              obj.brandData.v.list.push(brand);
              break;
            case 'W':
              obj.brandData.w.list.push(brand);
              break;
            case 'X':
              obj.brandData.x.list.push(brand);
              break;
            case 'Y':
              obj.brandData.y.list.push(brand);
              break;
            case 'Z':
              obj.brandData.z.list.push(brand);
              break;
          }
        }
        for (let j in obj.brandData) {
          if (obj.brandData[j].list.length != 0) {
            obj.brandData[j].isShow = true;
          }
        }
      }
    },
    components: {
      topBar,
      navBar,
      loading
    },
    mounted(){
      let _this = this, list = window.localStorage.getItem('brandList');
      if (list) {
        _this.doData(_this, JSON.parse(list));
        _this.loadingShow = false;
      } else {
        _this.brandList(function (data) {
          let brandList = data.data.auction_brands;
          _this.doData(_this, brandList);
          _this.loadingShow = false;
        })
      }
      _this.checkLogin(true);
    }
  }
</script>

<style scoped>
  /*品牌列表*/
  .brand-list .index {
    height: .45rem;
    line-height: .45rem;
    font-size: .18rem;
    font-weight: bold;
    color: #8e8e8e;
    background: #f5f3f1;
    padding: 0 .6rem 0 .2rem;
    border-bottom: 1px solid #C8C7CC;
  }

  .brand-list li {
    height: .64rem;
    padding-right: .6rem;
    margin-left: .2rem;
    border-bottom: 1px solid #C8C7CC;
  }

  .brand-list li:last-child {
    border: none;
  }

  .brand-list li .name {
    max-width: 2.5rem;
  }

  .brand-list li .en {
    font-size: .14rem;
    color: #252121;
    line-height: .2rem;
    margin-top: .14rem;
  }

  .brand-list li .cn {
    font-size: .12rem;
    color: #8e8e8e;
    line-height: .14rem;
  }

  .brand-list li .img {
    width: .42rem;
    height: .25rem;
    overflow: hidden;
    margin-top: .2rem;
  }

  /*字母索引*/
  .alp-index {
    position: fixed;
    top: .5rem;
    right: 0;
    bottom: 0;
    width: .4rem;
    background: #ebe9e7;
  }

  .alp-index ul {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .alp-index li {
    width: .4rem;
    height: .2rem;
    line-height: .2rem;
    color: #87847f;
    font-size: .11rem;
    font-weight: bold;
  }

  .alp-index li:first-child {
    height: .3rem;
    padding-top: .03rem;
  }

  .alp-index li.active {
    color: #99307d;
  }

  .alp-index li span {
    display: block;
  }
</style>
