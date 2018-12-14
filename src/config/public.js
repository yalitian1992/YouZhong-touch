import {baseUrl} from './config'
export default {
  data(){
    return {
      baseUrl,    //接口域名
      timer: ''   //toast定时器
    }
  },
  install: function (Vue, options) {
    /*判断登录信息*/
    Vue.prototype.checkLogin = function (haveNavBar, userCorrelated) {
      let sessionToken = window.sessionStorage.getItem('token'),
        localLoginInfo = window.localStorage.getItem('loginInfo');
      if (!sessionToken) {
        if (localLoginInfo) {
          localLoginInfo = JSON.parse(localLoginInfo);
          if (+new Date() - localLoginInfo.loginTime > 1296000000) {
            window.localStorage.removeItem('loginInfo');
            if (userCorrelated) {
              this.goToLogin();
            }
          } else {
            this.$http({
              method: "post",
              url: baseUrl + "/login",
              params: {phone: localLoginInfo.username, password: localLoginInfo.password}
            }).then(function (res) {
              let data = res.body;
              if (data.status === 200) {
                window.sessionStorage.setItem('token', data.data.core_account.token);
                if (haveNavBar) {
                  this.sessionToken = data.data.core_account.token;
                }
                if (userCorrelated) {
                  userCorrelated();
                }
              } else {
                window.localStorage.removeItem('loginInfo');
                if (userCorrelated) {
                  this.goToLogin();
                }
              }
            })
          }
        } else {
          if (userCorrelated) {
            this.goToLogin();
          }
        }
      } else {
        if (haveNavBar) {
          this.sessionToken = sessionToken;
        }
        if (userCorrelated) {
          userCorrelated();
        }
      }
    }

    /*跳转到登录页面*/
    Vue.prototype.goToLogin = function () {
      let url = window.location.href, path = window.location.pathname;
      if (path === '/login') {
        return false;
      }
      window.sessionStorage.setItem('hash', url.slice(url.indexOf(path)));
      this.$router.replace('/login');
    }

    /*吐司提示*/
    Vue.prototype.toast = function (msg, time) {
      time = time ? time : 1500;
      let toast = document.getElementsByClassName('toast-alert')[0];
      if (toast) {
        document.body.removeChild(toast);
        clearTimeout(this.timer);
      }
      let newToast = document.createElement("div");
      newToast.className = 'toast-alert one-txt-cut';
      newToast.innerHTML = msg;
      document.body.appendChild(newToast);
      this.timer = setTimeout(function () {
        document.body.removeChild(newToast);
      }, time)
    }


    /*滚动到底部加载更多*/
    Vue.prototype.scrollMore = function (callback) {
      window.onscroll = function () {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
          scrollHeight = document.body.scrollHeight,
          clientHeight = document.documentElement.clientHeight;
        if (scrollHeight - scrollTop - clientHeight <= 50) {
          callback();
        }
      }
    }

    /*判断android还是IOS*/
    Vue.prototype.clientType = function (adrCallback, iosCallback) {
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        if (adrCallback) {
          adrCallback();
        }
      } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        if (iosCallback) {
          iosCallback();
        }
      }
    }

    /*判断数组中是否有某个元素*/
    Vue.prototype.isInArray = function (arr, value) {
      if (arr.indexOf && typeof(arr.indexOf) == 'function') {
        var index = arr.indexOf(value);
        if (index >= 0) {
          return true;
        }
      }
      return false;
    }

    /*判断微信或不是微信*/
    Vue.prototype.isWachat = function (isisWachat, notWachat) {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        isisWachat();
      } else {
        notWachat();
      }
    }
    //保留2位小数
    Vue.prototype.twoInt = function (value) {
      var value = Math.round(parseFloat(value) * 100) / 100;
      var xsd = value.toString().split(".");
      if (xsd.length == 1) {
        value = value.toString();
        return value;
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    }

    /*设置默认图片*/
    /*Vue.prototype.defaultImg = function (option) {
     var defaultImg = '';
     switch (option) {
     case 0:
     defaultImg = 'this.src = "' + require('../../images/loadError01.png') + '"';
     break;
     case 1:
     defaultImg = 'this.src = "' + require('../../images/loadError02.png') + '"';
     break;
     case 2:
     var n = Math.floor(Math.random() * 3);
     defaultImg = 'this.src = "' + require('../../images/head-photo' + n + '.png') + '"';
     break;
     }
     return defaultImg;
     }*/

    /*弹出框显示时，禁止底层滑动*/
    Vue.prototype.setSlide = function (option) {
      let body = document.body, scrollTop = body.scrollTop;
      if (option === 0) {
        body.className = 'body-fixed';
        body.style.top = scrollTop * -1 + 'px';
      } else {
        body.className = '';
        body.scrollTop = body.style.top.slice(0, -2) * -1;
        body.style.top = null;
      }
    }

    /*用户详情*/
    Vue.prototype.userDetails = function (token, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/users/0",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*短信验证码*/
    Vue.prototype.msgCode = function (params, success) {
      this.$http({
        method: "post",
        url: baseUrl + "/core/accounts/resend_activation_code",
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*注册*/
    Vue.prototype.register = function (params, success) {
      this.$http({
        method: "post",
        url: baseUrl + "/core/accounts",
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*修改账号信息*/
    Vue.prototype.modifyUser = function (id, params, success) {
      this.$http({
        method: "put",
        url: baseUrl + "/core/accounts/" + id,
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*登录*/
    Vue.prototype.login = function (params, success) {
      this.$http({
        method: "post",
        url: baseUrl + "/login",
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*登出*/
    Vue.prototype.loginOut = function (token, success) {
      if (token) {
        this.$http({
          method: "delete",
          url: baseUrl + "/core/sessions/0",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*商品搜索列表*/
    Vue.prototype.getGoodsList = function (params, success) {
      this.$http({
        method: "post",
        url: baseUrl + "/auction/products",
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*商品详情*/
    Vue.prototype.getGoodsDetails = function (id, success) {
      this.$http({
        method: "get",
        url: baseUrl + "/auction/products/" + id
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*优惠券列表*/
    Vue.prototype.couponList = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/vouchers",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*添加优惠券*/
    Vue.prototype.addCoupon = function (token, params, success) {
      if (token) {
        this.$http({
          method: "put",
          url: baseUrl + "/auction/vouchers/1",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*订单列表*/
    Vue.prototype.getOrderList = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/trades",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*订单详情*/
    Vue.prototype.orderDetail = function (token, params, id, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/trades/" + id + ".json",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*创建订单*/
    Vue.prototype.crateOrder = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          params: params,
          url: baseUrl + "/auction/trades",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*订单取消*/
    Vue.prototype.cancelOrder = function (token, id, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/trades/" + id + "/cancel",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*订单退货操作*/
    Vue.prototype.returnGoods = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/units/return",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            // this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*订单退货详情*/
    Vue.prototype.returnDetail = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/units/return_detail",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*确认订单页面的商品清单*/
    Vue.prototype.confirmOrder = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/trades/confirm_products_list",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*支付列表*/
    Vue.prototype.paymentList = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/trades/pay_list.json",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*订单支付*/
    Vue.prototype.orderPay = function (params, success) {
      this.$http({
        method: "post",
        url: baseUrl + "/bj-ruby/api_server",
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*支付宝支付*/
    Vue.prototype.aliPay = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/pay/alipays/new",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*微信支付（手机微信浏览器支付）*/
    Vue.prototype.wechatPay = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/pay/wechats/mobile_wx_pay",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*paypal支付第一步*/
    Vue.prototype.paypalFirst = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/pay/paypals",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*paypal支付第二步*/
    Vue.prototype.paypalSencond = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/pay/paypals/execute",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*货到付款*/
    Vue.prototype.cashOnDelivery = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/trades/express",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*查看物流*/
    Vue.prototype.getLogistics = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/trades/delivery_query",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*确认收货*/
    Vue.prototype.sureReceive = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/trades/receive",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*收货地址列表*/
    Vue.prototype.addressList = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/contacts",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*添加收货地址*/
    Vue.prototype.addAddress = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/contacts",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*修改收货地址*/
    Vue.prototype.updateAddress = function (token, id, params, success) {
      if (token) {
        this.$http({
          method: "put",
          params: params,
          url: baseUrl + "/auction/contacts/" + id,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*删除收货地址*/
    Vue.prototype.deleteAddress = function (token, id, success) {
      if (token) {
        this.$http({
          method: "delete",
          url: baseUrl + "/auction/contacts/" + id,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*设置默认地址*/
    Vue.prototype.setDefAddress = function (token, id, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/contacts/" + id + "/set_default_contact",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*获取默认地址*/
    Vue.prototype.getDefAddress = function (token, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/contacts/default_contact",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*收货地址详情*/
    Vue.prototype.addressDetails = function (token, id, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/contacts/" + id
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*收货地址省市区*/
    Vue.prototype.provincesCities = function (token, success) {
      this.$http({
        method: "get",
        url: baseUrl + "/auction/contacts/options",
        headers: {TOKEN: token}
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*品牌收藏列表*/
    Vue.prototype.brandCollection = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/fanships",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*创建品牌收藏*/
    Vue.prototype.addBrand = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/fanships",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*删除收藏品牌*/
    Vue.prototype.deleteBrand = function (token, id, success) {
      if (token) {
        this.$http({
          method: "delete",
          url: baseUrl + "/auction/fanships/" + id,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*品牌是否收藏*/
    Vue.prototype.isAddBrand = function (token, id, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/fanships/" + id + "/is_collect",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*商品收藏列表*/
    Vue.prototype.goodsCollection = function (token, params, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/favorites",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*创建商品收藏*/
    Vue.prototype.addGoods = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/auction/favorites",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*删除收藏商品*/
    Vue.prototype.deleteGoods = function (token, id, success) {
      if (token) {
        this.$http({
          method: "delete",
          url: baseUrl + "/auction/favorites/" + id,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }
    /*商品是否收藏*/
    Vue.prototype.isAddGoods = function (token, id, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/auction/favorites/" + id + "/is_collect",
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }
    /*创建用户反馈*/
    Vue.prototype.feedback = function (params, success) {
      this.$http({
        method: "post",
        url: baseUrl + "/core/reports",
        params: params
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*添加购物车*/
    Vue.prototype.addCart = function (token, params, success) {
      if (token) {
        this.$http({
          method: "post",
          url: baseUrl + "/retail/carts",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*删除购物车商品*/
    Vue.prototype.deleteCart = function (token, params, success) {
      if (token) {
        this.$http({
          method: "delete",
          url: baseUrl + "/retail/carts/",
          params: params,
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*购物车列表*/
    Vue.prototype.cartList = function (token, success) {
      if (token) {
        this.$http({
          method: "get",
          url: baseUrl + "/retail/carts",
          params: {page: 1, page_size: 100},
          headers: {TOKEN: token}
        }).then(function (res) {
          var data = res.body;
          if (data.status == 200) {
            success(data);
          } else if (data.status == 403) {
            this.goToLogin();
          } else {
            this.toast(data.msg);
          }
        }, function (error) {
          //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
        })
      } else {
        this.goToLogin();
      }
    }

    /*品牌列表*/
    Vue.prototype.brandList = function (success) {
      this.$http({
        method: "get",
        url: baseUrl + "/auction/brands",
        params: {page: 1, per_page: 10000}
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*品牌详情*/
    Vue.prototype.brandDetails = function (id, success) {
      this.$http({
        method: "get",
        url: baseUrl + "/auction/brands/" + id
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*首页*/
    Vue.prototype.getIndexData = function (success) {
      this.$http({
        method: "get",
        url: baseUrl + "/ad_seckill_theme"
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }

    /*专题详情*/
    Vue.prototype.getTheme = function (id, success) {
      this.$http({
        method: "get",
        url: baseUrl + "/auction/themes/" + id
      }).then(function (res) {
        var data = res.body;
        if (data.status == 200) {
          success(data);
        } else {
          this.toast(data.msg);
        }
      }, function (error) {
        //this.$router.replace({path: '/error', query: {router: location.hash.slice(1)}});
      })
    }
  }
}
