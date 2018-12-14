<template>
  <div class="empty ac" v-if="noGoodsShow">
    <p class="prompt">{{prompt}}</p>
    <p class="selling">畅销商品推荐</p>
    <ul class="recommend clear">
      <router-link :to="{name: 'goodsDetails',params: {goods_id: item.id}}" tag="li" class="fl"
                   v-for="(item, index) in recommendData" :key="index">
        <div class="recommend-img">
          <img :src="imgBaseUrl() + item.major_pic + '.moderate.jpg'" alt="">
        </div>
        <p class="recommend-tit txt-cut">{{item.product_name}}</p>
        <p class="recommend-price">{{money + item.price}}</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import {imgBaseUrl, money} from '../../config/config'
  export default {
    data(){
      return {
        imgBaseUrl,        //图片域名
        money,             //钱的单位
        recommendData: []  //推荐商品
      }
    },
    props: ['noGoodsShow', 'prompt'],
    watch: {
      noGoodsShow: function (val) {
        let _this = this;
        if (val) {
          let params = {
            where: {recommend: 'newest', unsold_count: {gt: 0}},
            per_page: 6,
            page: 1,
            filter: true,
            response: 'simple'
          };
          _this.getGoodsList(params, function (data) {
            _this.recommendData = data.data.products;
          })
        }
      }
    }
  }
</script>

<style scoped>
  .empty {
    font-size: .17rem;
  }

  .empty p.prompt {
    padding: .28rem 0;
    color: #8e8e8e;
  }

  .empty p.selling {
    height: .3rem;
    line-height: .3rem;
    background: #8e8e8e;
    color: #fff;
  }

  .empty .recommend {
    padding-bottom: .3rem;
  }

  .empty .recommend li {
    width: 50%;
    height: 2.35rem;
    margin-top: .25rem;
    padding: 0 5%;
  }

  .empty .recommend-tit {
    padding: .09rem 0;
    font-size: .12rem;
    color: #8e8e8e;
    line-height: .18rem;
    text-align: left;
  }

  .empty .recommend-price {
    font-size: .14rem;
  }
</style>
