import App from '../App.vue'
import mallIndex from '../page/mallIndex/mallIndex.vue'
import classify from '../page/classify/classify.vue'
import brand from '../page/brand/brand.vue'
import goodsList from '../page/goodsList/goodsList.vue'
import goodsDetails from '../page/goodsDetails/goodsDetails.vue'
import search from '../page/search/search.vue'
import userIndex from '../page/user/userIndex.vue'
import aboutIhaveu from '../page/user/aboutIhaveu.vue'
import brandCollection from '../page/user/brandCollection.vue'
import goodsCollection from '../page/user/goodsCollection.vue'
import myVoucher from '../page/user/myVoucher.vue'
import shoppingCart from '../page/user/shoppingCart.vue'
import logistics from '../page/user/logistics.vue'  //物流
import login from '../page/user/login.vue'
import register from '../page/user/register.vue'

// 地址管理
import addAddress from '../page/user/address/addAddress.vue'
import choiceAddress from '../page/user/address/choiceAddress.vue'

// 订单
import orderDetail from '../page/user/orderDetail.vue'
import confirmOrder from '../page/user/confirmOrder.vue'
import orderManage from '../page/user/orderManage.vue'

import helpIndex from '../page/user/help/helpIndex.vue'
import payMethod from '../page/user/help/payMethod.vue'
import returnExplain from '../page/user/help/returnExplain.vue'
import specialReturnExplain from '../page/user/help/specialReturnExplain.vue'
import afterSaleServer from '../page/user/help/afterSaleServer.vue'
import watchAfterSaleServer from '../page/user/help/watchAfterSaleServer.vue'
import qualityGoodsEnsure from '../page/user/help/qualityGoodsEnsure.vue'
import packagedGoods from '../page/user/help/packagedGoods.vue'

export default[{
  path: '/',
  component: App, //顶层路由，对应index.html
  children: [ //二级路由。对应App.vue
    //地址为空时跳转mallIndex页面
    {
      path: '',
      redirect: '/mallIndex'
    },
    //商城首页
    {
      path: '/mallIndex',
      component: mallIndex
    },
    //分类页面
    {
      path: '/classify',
      component: classify
    },
    //品牌页面
    {
      path: '/auction/brands',
      component: brand
    },
    //商品列表页面
    {
      path: '/auction/products',
      component: goodsList
    },
    //商品详情页面
    {
      path: '/auction/products/:goods_id',
      name: 'goodsDetails',
      component: goodsDetails
    },
    //搜索页面
    {
      path: '/search',
      component: search
    },
    //用户首页
    {
      path: '/userIndex',
      component: userIndex
    },
    //关于优众
    {
      path: '/aboutIhaveu',
      component: aboutIhaveu
    },
    //使用帮助首页
    {
      path: '/helpIndex',
      component: helpIndex
    },
    //付款方式
    {
      path: '/payMethod',
      component: payMethod
    },
    //退换货说明
    {
      path: '/returnExplain',
      component: returnExplain
    },
    //特殊商品退换货
    {
      path: '/specialReturnExplain',
      component: specialReturnExplain
    },
    //售后服务政策
    {
      path: '/afterSaleServer',
      component: afterSaleServer
    },
    //手表售后服务政策
    {
      path: '/watchAfterSaleServer',
      component: watchAfterSaleServer
    },
    //正品保证
    {
      path: '/qualityGoodsEnsure',
      component: qualityGoodsEnsure
    },
    //货品包装
    {
      path: '/packagedGoods',
      component: packagedGoods
    },
    //品牌收藏
    {
      path: '/brandCollection',
      component: brandCollection
    },
    //商品收藏myVoucher
    {
      path: '/goodsCollection',
      component: goodsCollection
    },
    //我的代金券
    {
      path: '/myVoucher',
      component: myVoucher
    },
    //购物车
    {
      path: '/shoppingCart',
      component: shoppingCart
    },
    //添加地址
    {
      path: '/addAddress',
      component: addAddress
    },
    //选择地址
    {
      path: '/choiceAddress',
      component: choiceAddress
    },
    //物流查询
    {
      path: '/logistics',
      component: logistics
    },
    //订单详情
    {
      path: '/orderDetail',
      component: orderDetail
    },
    //确认订单
    {
      path: '/confirmOrder',
      component: confirmOrder
    },
    //订单管理
    {
      path: '/orderManage',
      component: orderManage
    },
    //登录
    {
      path: '/login',
      component: login
    },
    //注册
    {
      path: '/register',
      component: register
    }
  ]
}]
