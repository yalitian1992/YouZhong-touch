<template>
  <div>
    <topBar backShow="true" titleShow="true" :title="$t('login.title')"></topBar>
    <div class="content">
      <div class="form">
        <div class="username flex"><label for="username">{{$t('login.accountNum')}}</label><input id="username"
                                                                                                  type="text"
                                                                                                  v-model="username"
                                                                                                  :placeholder="$t('login.accountNumTip')">
        </div>
        <div class="password flex"><label for="password">{{$t('login.password')}}</label><input id="password"
                                                                                                type="password"
                                                                                                v-model="password"
                                                                                                :placeholder="$t('login.passwordTip')">
        </div>
      </div>
      <div class="btn-group ac">
        <div class="btn" @click="loginIn">{{$t('login.title')}}</div>
        <div class="tips">{{$t('login.tips')}}</div>
        <div class="btn btn2" @click="goRegister">{{$t('login.register')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import topBar from '../../components/topBar/topBar.vue'
  import i18n from '../../config/i18n'
  export default {
    i18n,
    data() {
      return {
        username: '',  //账号
        password: ''   //密码
      }
    },
    methods: {
      loginIn: function () {
        let _this = this;
        if (!_this.username) {
          _this.toast(_this.$t('login.accountNumTips'));
          return false;
        }
        if (!_this.password) {
          _this.toast(_this.$t('register.password1Tips'));
          return false;
        }
        _this.login({phone: _this.username, password: _this.password}, function (data) {
          window.sessionStorage.setItem('token', data.data.core_account.token);
          let date = data.data.core_account.token_expired_at.replace(/-/g, ':').replace(' ', ':').split(':'),
            loginInfo = {
              username: _this.username,
              password: _this.password,
              loginTime: +new Date(date[0], (date[1] - 1), date[2], date[3], date[4], date[5])
            }
          window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
          _this.$router.replace(window.sessionStorage.getItem('hash'));
        })
      },
      /*去注册页面*/
      goRegister: function () {
        this.$router.replace('/register');
      }
    },
    components: {
      topBar
    }
  }
</script>

<style></style>
