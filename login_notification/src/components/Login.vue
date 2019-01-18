<template>
  <div>
    213123213 asd fsd asf 
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    isSignedIn: true,
    userNameLogin: '',
    drawer: false,
    avatarURL: 'http://via.placeholder.com/350x150',
    notificationCount: 0,
    isShowUserMenu: false,
    toggle_exclusive: 0
  }),
  methods: {
    showNoti () {

    },
    doUserInfo () {

    },
    doExitApp () {

    },
    doRegisterRedirect () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-wrapper {
    float: right;
    min-width: 400px;
}
.login-wrapper .login-input {
    display: -webkit-box;
    display: flex;
}
.login-wrapper .login-input .ico:first-child {
    margin-left: 0;
}
.login-wrapper .login-input .ico {
    position: relative;
    margin-left: 10px;
}
.login-wrapper .login-input .ico-user:before {
    content: "\f007";
}
.login-wrapper .login-input .ico-pass:before {
    content: "\f023";
}
.login-wrapper .login-input .ico:before {
    content: "";
    font-family: FontAwesome;
    position: absolute;
    color: #005792;
    width: 30px;
    height: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
}
.login-wrapper .login-input .ico:after {
    content: "";
    position: absolute;
    top: 20%;
    left: 30px;
    width: 1px;
    height: 60%;
    background-color: #005792;
}
.login-wrapper .login-input .ico:after {
    content: "";
    position: absolute;
    top: 20%;
    left: 30px;
    width: 1px;
    height: 60%;
    background-color: #005792;
}
.login-wrapper .login-input input {
    height: 26px;
    width: 200px;
    border: 1px solid #005792;
    border-radius: 30px;
    padding-left: 35px;
    font-size: 12px;
    background: #fff;
}
.login-wrapper .login-input {
    display: -webkit-box;
    display: flex;
}
.forgetten-password-input {
    width: 100%;
    line-height: 31px;
    font-size: 13px;
    padding-left: 10px;
    text-decoration: underline;
    color: #fff;
}
.forgetten-password-input a {
    font-size: 11px;
    text-transform: unset;
    text-decoration: none !important;
}
.action-btn-login-input {
    width: 100%;
    text-align: right;
}
.login-wrapper .btn-register {
    background-color: #fdb44b;
}
.login-wrapper button {
    margin: 5px 0 0 5px;
    height: 26px;
    line-height: 26px;
    padding: 0 12px;
    color: white;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: 0;
    border-radius: 30px;
    background-color: #005792;
    font-size: 12px;
    font-weight: bold;
    will-change: box-shadow;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>
