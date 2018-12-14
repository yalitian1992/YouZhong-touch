import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/index'
import VueResource from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import publicMethod from './config/public'
import VueI18n from 'vue-i18n'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueAwesomeSwiper)
Vue.use(publicMethod)
Vue.use(VueI18n)
const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router
}).$mount('#app')   //手动挂载
