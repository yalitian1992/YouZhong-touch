<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('register.title')"></topBar>
    <div class="content">
      <div class="form">
        <div class="tel flex"><label for="tel">{{$t('register.tel')}}</label><input id="tel" type="tel" v-model="tel"
                                                                                    :placeholder="$t('register.telTip')">
        </div>
        <div class="img-code flex"><label for="img-code">{{$t('register.imgCode')}}</label><input id="img-code"
                                                                                                  type="text"
                                                                                                  maxlength="5"
                                                                                                  v-model="imgCode"
                                                                                                  :placeholder="$t('register.imgCodeTip')">
          <div @click="toggleCode"><img :src="imgUrl" alt=""></div>
        </div>
        <div class="message-code flex"><label for="message-code">{{$t('register.msgCode')}}</label><input
          id="message-code" type="text" maxlength="6" v-model="messageCode" :placeholder="$t('register.msgCodeTip')">
          <div class="ac" @click="getMsgCode">
            <div>{{codeText}}</div>
          </div>
        </div>
        <div class="password1 flex"><label for="password1">{{$t('register.password1')}}</label><input id="password1"
                                                                                                      type="password"
                                                                                                      maxlength="20"
                                                                                                      v-model="password1"
                                                                                                      :placeholder="$t('register.password1Tip')">
        </div>
        <div class="password2 flex"><label for="password2">{{$t('register.password2')}}</label><input id="password2"
                                                                                                      type="password"
                                                                                                      maxlength="20"
                                                                                                      v-model="password2"
                                                                                                      :placeholder="$t('register.password2Tip')">
        </div>
        <div class="spread-code flex"><label for="spread-code">{{$t('register.spreadCode')}}</label><input
          id="spread-code" type="text"
          v-model="spreadCode" :placeholder="$t('register.spreadCodeTip')">
        </div>
      </div>
      <div class="btn-group ac">
        <div class="btn" @click="registerLogin">{{$t('register.registerLogin')}}</div>
        <div class="tips">{{$t('register.tips')}}</div>
        <div class="btn btn2" @click="goLogin">{{$t('register.login')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import {baseUrl} from '../../config/config'
  import i18n from '../../config/i18n'
  export default {
    i18n,
    data() {
      return {
        baseUrl,        //接口域名
        imgUrl: baseUrl + '/rucaptcha',//验证码图片地址
        tel: '',        //手机号
        imgCode: '',    //图片验证码
        messageCode: '',//短信验证码
        canClick: true, //获取验证码按钮是否能点击
        codeText: this.$t('register.msgCodeBtn'), //短信验证码文字
        time: '',      //短息验证码按钮定时器
        password1: '',  //密码
        password2: '',  //确认密码
        spreadCode: ''  //推广码
      }
    },
    methods: {
      /*刷新图片验证码*/
      toggleCode: function () {
        this.imgUrl = baseUrl + '/rucaptcha?n=' + Math.random();
      },
      /*获取短信验证码*/
      getMsgCode: function () {
        let _this = this;
        if (!_this.tel) {
          _this.toast(_this.$t('register.telTip'));
          return false;
        } else if (!/^1(3|4|5|7|8)[0-9]\d{8}/.test(_this.tel)) {
          _this.toast(_this.$t('addAddress.telError'));
          return false;
        }
        if (!_this.imgCode) {
          _this.toast(_this.$t('register.imgCodeTip'));
          return false;
        } else if (!/^[a-zA-Z]{5}$/.test(_this.imgCode)) {
          _this.toast(_this.$t('register.imgCodeError'));
          return false;
        }
        if (_this.canClick) {
          _this.$http({
            method: "post",
            url: baseUrl + "/core/accounts/resend_activation_code",
            params: {phone: _this.tel, _rucaptcha: _this.imgCode}
          }).then(function (res) {
            if (res.body.status == 200) {
              _this.canClick = false;
              let num = 60;
              _this.time = setInterval(function () {
                num--;
                _this.codeText = num + _this.$t('register.second');
                if (num <= 0) {
                  clearInterval(_this.time);
                  _this.codeText = _this.$t('register.resend');
                  _this.canClick = true;
                  _this.imgCode = '';
                  _this.toggleCode();
                }
              }, 1000);
            } else {
              _this.toast(res.body.msg);
              _this.imgCode = '';
              _this.toggleCode();
              _this.messageCode = '';
            }
          })
        }
      },
      /*登录*/
      loginIn: function () {
        let _this = this;
        _this.login({phone: _this.tel, password: _this.password1}, function (data) {
          window.sessionStorage.setItem('token', data.data.core_account.token);
          let date = data.data.core_account.token_expired_at.replace(/-/g, ':').replace(' ', ':').split(':'),
            loginInfo = {
              username: _this.tel,
              password: _this.password1,
              loginTime: +new Date(date[0], (date[1] - 1), date[2], date[3], date[4], date[5])
            }
          window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
          _this.$router.replace(window.sessionStorage.getItem('hash'));
        })
      },
      /*注册登录*/
      registerLogin: function () {
        if (!this.tel) {
          this.toast(this.$t('register.telTip'));
          return false;
        } else if (!/^1(3|4|5|7|8)[0-9]\d{8}/.test(this.tel)) {
          this.toast(this.$t('addAddress.telError'));
          return false;
        }
        if (!this.messageCode) {
          this.toast(this.$t('register.msgCodeTip'));
          return false;
        } else if (!/^[0-9]{6}$/.test(this.messageCode)) {
          this.toast(this.$t('register.msgCodeError'));
          return false;
        }
        if (!this.password1) {
          this.toast(this.$t('register.password1Tips'));
          return false;
        } else if (!/^(\w){6,20}$/.test(this.password1)) {
          this.toast(this.$t('register.password1Error'));
          return false;
        }
        if (!this.password2) {
          this.toast(this.$t('register.password2Tip'));
          return false;
        } else if (this.password1 != this.password2) {
          this.toast(this.$t('register.password2Error'));
          return false;
        }
        this.$http({
          method: "post",
          url: baseUrl + "/core/accounts",
          params: {
            account: {
              phone: this.tel,
              password: this.password1,
              password_confirmation: this.password2,
              client: 'touch'
            },
            coupon: {code: this.spreadCode},
            message_code: this.messageCode
          }
        }).then(function (res) {
          if (res.body.status == 200) {
            this.loginIn();
          } else {
            this.toast(res.body.msg);
            this.imgCode = '';
            this.toggleCode();
            this.messageCode = '';
            clearInterval(this.time);
            this.canClick = true;
            this.codeText = this.$t('register.msgCodeBtn');
          }
        })
      },
      /*去登录页面*/
      goLogin: function () {
        this.$router.replace('/login');
      }
    },
    components: {
      topBar
    },
    mounted(){

    }
  }
</script>

<style scoped>
  .img-code > input, .message-code > input {
    width: 100%;
    border-radius: 0;
  }

  .img-code > div, .message-code .ac {
    width: 1.1rem;
    height: .38rem;
    background: #f6f6f6;
    padding: .04rem .04rem .04rem 0;
    border-radius: 0 .05rem .05rem 0;
  }

  .img-code > div img {
    height: .3rem;
  }

  .message-code .ac div {
    height: .24rem;
    line-height: .24rem;
    font-size: .14rem;
    color: #fff;
    background: #000;
    margin-top: .03rem;
  }
</style>
