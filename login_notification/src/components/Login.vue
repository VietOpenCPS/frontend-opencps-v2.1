<template>
  <div>
    <div @click="showNoti"
      v-if="drawer"
      style="position: fixed;width: 100%;height: 100vh;left: 0;top: 0;"></div>
    <div v-if="!isSignedIn" style="
        position: relative;
        height: 50px;
    ">
    <div class="login-wrapper">
      <div class="login-input">
        <div class="ico ico-user">
          <input type="text" placeholder="Tài khoản đăng nhập" name="_LoginNotification_login">
        </div>
        <div class="ico ico-pass">
          <input type="text" placeholder="Mật khẩu" name="_LoginNotification_password">
        </div>
      </div>
      <div class="login-input">
        <div style="width: 100%;">
          <a href="/forgotten-password" class="text-hover-blue" style="
              line-height: 30px;
              font-size: 12px;
              color: #005792;
              text-decoration: underline;
              padding-left: 10px;
          ">Quên mật khẩu?</a>
        </div> 
        <div style="
          width: 100%;
          text-align: right;
        ">
          <button type="button" @click="doRegisterRedirect" class="btn-register">Đăng ký</button>
          <button type="submit" class="btn-login">Đăng nhập</button>
        </div>
      </div>
    </div>
    </div>
    <div v-else>
      
      <div style="text-align: right;">
        <v-badge color="red" v-if="notificationCount > 0">
          <span @click="showNoti" slot="badge">2</span>
          <v-btn icon @click="showNoti" class="mx-0 my-0">
            <v-icon
              size="20"
              color="blue darken-3"
              class="swing animated"
              style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;"
            >
              notifications_active
            </v-icon>
          </v-btn>
        </v-badge>
        <v-btn v-else icon @click="showNoti" class="mx-0 my-0" style="margin-right: -10px !important">
            <v-icon
              size="20"
              color="blue darken-3"
              class="swing animated"
              style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;"
            >
              notifications
            </v-icon>
          </v-btn>
        <v-menu offset-y :nudge-bottom="5">
          <v-chip slot="activator" @click="isShowUserMenu = !isShowUserMenu">
            <v-avatar>
              <img :src="avatarURL">
            </v-avatar>
            {{userNameLogin}}
            <v-icon
              v-if="!isShowUserMenu"
              size="20"
              color="blue darken-3"
              class="swing animated"
            >
              expand_more
            </v-icon>
            <v-icon
              v-else
              size="20"
              color="blue darken-3"
              class="swing animated"
            >
              expand_less
            </v-icon>
          </v-chip>
          <v-list>
            <v-list-tile @click="doUserInfo">
              <v-list-tile-action>
                <v-icon size="16">person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Thông tin tài khoản</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="doExitApp">
              <v-list-tile-action>
                <v-icon size="16" color="red darken-3">exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Đăng xuất</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      
      <v-navigation-drawer
        v-model="drawer"
        temporary
        fixed
        clipped
        right
        hide-overlay
      >
        <v-list class="pa-1">
          <v-list-tile>
            <v-list-tile-content>
              <v-btn-toggle style="width: 100%;" v-model="toggle_exclusive" mandatory>
                <v-btn block flat class="px-0">
                  Hôm nay
                </v-btn>
                <v-btn block flat class="px-0">
                  Thông báo mới
                </v-btn>
              </v-btn-toggle>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
  
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
  
          <!--
          <v-list-tile>

            <v-list-tile-content>
              <v-list-tile-title>Yesterday</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn small icon class="mx-0 my-0" color="grey darken-2">
                <v-icon size="14" style="color: #fff;">clear</v-icon>
              </v-btn>
            </v-list-tile-action>
            
          </v-list-tile>
          <div style="padding: 2px 12px 8px 12px;"><div style="
    border-radius: 7px;
    background: #f3f3f3;
"><div style="
    background: #eaeaea;
    padding: 5px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
">
                  Thong bao moi
                </div> <div style="
    padding: 10px;
">
                  abc
                </div></div></div>

          <div style="padding: 2px 12px 8px 12px;"><div style="
    border-radius: 7px;
    background: #f3f3f3;
"><div style="
    background: #eaeaea;
    padding: 5px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
">
                  Thong bao moi
                </div> <div style="
    padding: 10px;
">
                  abc
                </div></div></div>
            
          <div style="padding: 2px 12px 8px 12px;"><div style="
    border-radius: 7px;
    background: #f3f3f3;
"><div style="
    background: #eaeaea;
    padding: 5px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
">
                  Thong bao moi
                </div> <div style="
    padding: 10px;
">
                  abc
                </div></div></div>

              -->
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    isSignedIn: true,
    userNameLogin: 'Tạ Hữu Bình',
    drawer: false,
    avatarURL: 'http://via.placeholder.com/350x150',
    notificationCount: 0,
    isShowUserMenu: false,
    toggle_exclusive: 0
  })
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
