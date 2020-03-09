<template>
  <div id="app_login">
    <div
      @click="drawerLogin = false"
      v-if="drawerLogin"
      style="position: fixed;width: 100%;height: 100vh;left: 0;top: 0;    z-index: 9999;"
    ></div>
    <div v-if="drawer" style="position: fixed;width: 100%;height: 100vh;left: 0;top: 0;"></div>
    <div
      v-if="!isSignedIn"
      style="
                  position: relative;
                  height: 50px;
              "
    >
      <div class="login-wrapper">
        <div class="login-input">
          <div class="ico ico-user">
            <input type="text" placeholder="Địa chỉ email đăng nhập" v-model="userName">
          </div>
          <div class="ico ico-pass">
            <input
              @keyup.enter="goToDangNhapPress"
              type="password"
              placeholder="Mật khẩu"
              v-model="passWord"
            >
          </div>
        </div>
        <div class="login-input">
          <div style="width: 100%;">
            <a
              :href="forgottenURLStr"
              class="text-hover-blue"
              style="
                        line-height: 30px;
                        font-size: 12px;
                        color: #005792;
                        text-decoration: underline;
                        padding-left: 10px;
                    "
            >Quên mật khẩu?</a>
          </div>
          <div
            style="
                    width: 100%;
                    text-align: right;
                  "
          >
            <button type="button" class="btn-register" @click="goToDangKyPage">Đăng ký</button>
            <button type="button" class="btn-login" @click="goToDangNhap">Đăng nhập</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="login_wrap_app_panel"
        style="text-align: right;max-width: 1366px;margin-top: 15px;"
      >
        <span
          v-if="notificationCount > 0"
          class="v-badge"
          style="
            margin-left: -42px;
            position: absolute;
            top: 21px;
        "
        >
          <button
            @click="showNoti"
            type="button"
            class="mx-0 my-0 v-btn v-btn--icon theme--light"
            style="
            position: absolute;
            left: 0;
        "
          >
            <div class="v-btn__content">
              <i
                aria-hidden="true"
                class="v-icon swing animated material-icons theme--light blue--text text--darken-3"
                style="font-size: 20px; animation: swing 0.8s ease 0s infinite normal none running;"
              >notifications_active</i>
            </div>
          </button>
          <span
            class="v-badge__badge red darken-3"
            style="
                z-index: 2;
                position: relative;
                border-radius: 6px;
                height: 18px;
                padding: 0 12px;
            "
          >
            <span
              style="
                font-size: 10px;
                color: #fff !important;
                font-weight: bold;
                height: 14px;
            "
            >{{notificationCount > 5 ? "5+" : notificationCount}}</span>
          </span>
        </span>
        <v-btn v-else @click="showNoti" icon class="mx-0 my-0">
          <v-icon
            size="20"
            color="blue darken-3"
            class="swing animated"
            style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;"
          >notifications</v-icon>
        </v-btn>
        <v-menu offset-y :nudge-bottom="5">
          <v-chip slot="activator" @click="isShowUserMenu = !isShowUserMenu">
            <v-avatar v-if="avatarURL !== ''">
              <img :src="avatarURL" style="width: 32px;height: 32px;margin: 0 !important;">
            </v-avatar>
            <v-avatar v-else class="white--text" :style="{background: '#' + colorBG}">
              <span class="white--text">{{ userNameLogin.slice(0, 1).toUpperCase() }}</span>
            </v-avatar>
            {{userNameLogin}}
            <v-icon
              v-if="!isShowUserMenu"
              size="20"
              color="blue darken-3"
              class="swing animated"
            >expand_more</v-icon>
            <v-icon v-else size="20" color="blue darken-3" class="swing animated">expand_less</v-icon>
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
          class="login_drawer"
          v-model="drawerLogin"
          fixed
          right
          hide-overlay
          temporary
          style="
                -webkit-box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 5px 28px 2px rgba(0,0,0,.14), 0 -5px 28px 1px rgba(0,0,0,0);
                box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 5px 28px 2px rgba(0,0,0,.14), 0 -5px 28px 1px rgba(0,0,0,0);
                z-index: 9999;
              "
        >
        <article class="glass down">
          <v-layout
            class="px-3"
            row
            wrap
            style="    display: -webkit-flex;    display: flex;    border-bottom: 1px solid #fff;"
          >
            <v-flex xs6 class="text-center">
              <v-btn
                block
                small
                style="
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                "
              >Thông báo</v-btn>
            </v-flex>
            <v-flex xs6 class="text-center">
              <v-btn
                @click="markRead"
                block
                small
                style="
                    background: #d0d0d0;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    border-top-right-radius: 8px;
                    border-bottom-right-radius: 8px;
                "
              >Đánh dấu đã đọc</v-btn>
            </v-flex>
          </v-layout>
          <div v-if="notificationCount > 0" class="layout row wrap px-3" style="display: flex;">
              <div
                class="flex xs12 mt-3"
                style="
                    background: #ffffff66;
                    border-radius: 8px;
                "
              >
                <div
                  style="
                      padding: 5px 10px;
                      background: #fff0;
                      text-transform: uppercase;
                      font-weight: bold;
                  "
                >
                <v-icon size="15" color="red accent-4">mail</v-icon>&nbsp;Mới
              </div>    
                <div
                  class="notification_wrap"
                  style="
                      padding: 5px 10px;
                      background: #ffffffb3;
                      border-bottom-left-radius: 8px;
                      border-bottom-right-radius: 8px;
                      overflow: auto; max-height: 300px;
                  "
                >
                  <template-rendering
                    v-for="(item, index) in testData"
                    v-bind:key="index"
                    :item="item"
                    :layout_view="item['notifyMessage']"
                    :template_default="templateDefault"
                    @mark-as-read="markReadEventId"
                  ></template-rendering>
                </div>
              </div>
          </div>
          <div class="layout row wrap px-3" style="display: flex;">
              <div
                class="flex xs12 mt-3"
                style="
                    background: #ffffff66;
                    border-radius: 8px;
                "
              >
                <div
                  style="
                      padding: 5px 10px;
                      background: #fff0;
                      text-transform: uppercase;
                      font-weight: bold;
                  "
                >
                <v-icon size="15" color="red accent-4">mail</v-icon>&nbsp;Trước đó
              </div>    
                <div
                  class="notification_wrap"
                  style="
                      padding: 5px 10px;
                      background: #ffffffb3;
                      border-bottom-left-radius: 8px;
                      border-bottom-right-radius: 8px;
                      overflow: auto; max-height: 300px;
                  "
                >
                  <template-rendering
                    v-for="(item, index) in testDataSeen"
                    v-bind:key="index"
                    :item="item"
                    :layout_view="item['notifyMessage']"
                    :template_default="templateDefault"
                    @mark-as-read="markReadEventId"
                  ></template-rendering>
                </div>
              </div>
          </div>
        </article>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import toastr from "toastr";
import TemplateRendering from "./template_rendering.vue";
import { templateDefault } from "./DefaultTemplate.js";
toastr.options = {
  closeButton: true,
  timeOut: "15000"
};
export default {
  components: {
    "template-rendering": TemplateRendering
  },
  data: () => ({
    isSignedIn: false,
    userNameLogin: "",
    drawerLogin: false,
    avatarURL: "/o/opencps-store/js/cli/login/app/image/img_login.png",
    notificationCount: 0,
    isShowUserMenu: false,
    toggle_exclusive: 0,
    forgottenURLStr: "",
    userName: "",
    passWord: "",
    userData: {},
    colorBG: "009688",
    templateDefault: templateDefault,
    testData: [],
    testDataSeen: []
  }),
  created() {
    let vm = this;
    vm.$nextTick(function() {
      vm.isSignedIn = window.themeDisplay.isSignedIn();
      vm.userNameLogin = window.themeDisplay.getUserName();
      vm.colorBG = vm.intToRGB(vm.hashCode(vm.userNameLogin));
      let redirectURL = window.themeDisplay
        .getLayoutRelativeURL()
        .substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf("/"));
      if (redirectURL !== "") {
        vm.forgottenURLStr = redirectURL + "/register/#/cap-lai-mat-khau";
      } else {
        vm.forgottenURLStr =
          window.themeDisplay.getURLHome() + "/register/#/cap-lai-mat-khau";
      }
      if (vm.isSignedIn) {
        vm.userData = {};
        // kt
        vm.pullNotificationCount();
        setTimeout(() => {
          axios
            .get("/o/v1/opencps/users/" + window.themeDisplay.getUserId())
            .then(function(response) {
              vm.userData = response.data;
              // vm.avatarURL = vm.userData["avatar"];
              // if (vm.avatarURL.includes("img_id=0")) {
              //   vm.avatarURL = "";
              // }
              let filter = {
                className: vm.userData['className'] === 'org.opencps.usermgt.model.Applicant' ? 'org.opencps.usermgt.model.ApplicantAvatar' : vm.userData['className'],
                classPK: vm.userData['classPK']
              }
              // kt
              vm.getImageAvatar(filter)
              vm.userNameLogin = vm.userData["userName"];
              vm.colorBG = vm.intToRGB(vm.hashCode(vm.userNameLogin));
            })
            .catch(function(error) {
              vm.avatarURL = ""
            })
        }, 1000);
      }
    });
  },
  watch: {
    $route: function(newRoute, oldRoute) {
      let vm = this;
      if (vm.notificationCount < 5) {
        // kt
        vm.pullNotificationCount();
      }
    }
  },
  methods: {
    getImageAvatar (filter) {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        }
      }
      axios.get('/o/v1/opencps/users/avatar/' + filter['className'] + '/' + filter['classPK'], param).then(function (response) {
        if (response.data) {
          let url = String(response.data)
          vm.avatarURL = window.themeDisplay.getPortalURL() + url
        } else {
          vm.avatarURL = ''
        }
      }).catch(function (xhr) {
        vm.avatarURL = ''
      })
    },
    markRead () {
      let vm = this
      for (let key in vm.testData) {
        axios
        .post("/o/rest/v2/notifications/" + vm.testData[key]['eventId'] + "/mark")
        .then(function(response) {
        })
      }
      vm.drawerLogin = false
    },
    markReadEventId (configOBJ) {
      let vm = this
      let userType = ''
      if (String(vm.userData['className']).indexOf('Employee') >= 0) {
        userType = 'employee'
      } else {
        userType = 'applicant'
      }
      let urlCurrent = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
      axios
      .post("/o/rest/v2/notifications/" + configOBJ['eventId'] + "/mark")
      .then(function(response) {
        //send redirect
        let urlRedirect =  urlCurrent + '/dich-vu-cong#/danh-sach-ho-so/0/chi-tiet-ho-so/' + configOBJ['dossierId']+ '?t=' + new Date().getTime()
        if (userType === 'employee') {
          urlRedirect = urlCurrent + '#/danh-sach-ho-so/0/chi-tiet-ho-so/' + configOBJ['dossierId']+ '?t=' + new Date().getTime()
        }
        // if (window.document.getElementById('app') === null || window.document.getElementById('app') === undefined) {
          window.location.href = urlRedirect
        // } else {
        //   window.location.href = urlRedirect
        //   window.location.reload()
        // }
      })
      .catch(function(error) {
        //send redirect
        let urlRedirect =  urlCurrent + '/dich-vu-cong#/danh-sach-ho-so/0/chi-tiet-ho-so/' + configOBJ['dossierId']+ '?t=' + new Date().getTime()
        if (userType === 'employee') {
          urlRedirect = urlCurrent + '#/danh-sach-ho-so/0/chi-tiet-ho-so/' + configOBJ['dossierId']+ '?t=' + new Date().getTime()
        }
        // if (window.document.getElementById('app') === null || window.document.getElementById('app') === undefined) {
            window.location.href = urlRedirect
          // } else {
          //   window.location.href = urlRedirect
          //   window.location.reload()
          // }
      })
    },
    pullNotificationCount() {
      let vm = this;
      let param = {};
      axios
        .get("/o/rest/v2/notifications/count?archived=false", param)
        .then(function(response) {
          let serializable = response.data;
          vm.notificationCount = serializable["total"];
        })
        .catch(function(error) {
          vm.notificationCount = 0;
        });
    },
    pullNotificationData() {
      let vm = this;
      let param = {};
      vm.testData = [];
      vm.testDataSeen = []
      axios
        .get("/o/rest/v2/notifications?archived=false", param)
        .then(function(response) {
          let serializable = response.data;
          vm.notificationCount = serializable["total"];
          vm.testData = serializable["data"];
        })
        .catch(function(error) {});
      axios
        .get("/o/rest/v2/notifications?archived=true&start=0&end=10", param)
        .then(function(response) {
          vm.testDataSeen = response.data["data"];
        })
        .catch(function(error) {});
    },
    showNoti() {
      let vm = this;
      vm.drawerLogin = !vm.drawerLogin;
      vm.pullNotificationData();
    },
    doRegisterRedirect() {
      let redirectURL = window.themeDisplay
        .getLayoutRelativeURL()
        .substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf("/"));
      if (redirectURL !== "") {
        window.location.href = redirectURL + "/register";
      } else {
        window.location.href = window.themeDisplay.getURLHome() + "/register";
      }
    },
    doUserInfo() {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        // eslint-disable-next-line
        let redirectURL = window.themeDisplay
          .getLayoutRelativeURL()
          .substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf("/"));
        window.location.href = redirectURL + "/profile";
      } else {
        window.location.href = "/profile";
      }
    },
    doExitApp() {
      let vm = this
      if (typeof(Storage) !== 'undefined') {
        sessionStorage.removeItem('userLogout')
        if (String(vm.userData['className']).indexOf('Employee') >= 0) {
          sessionStorage.setItem('userLogout', 'employee')
        } else {
          sessionStorage.setItem('userLogout', 'applicant')
        }
      }
      window.location.href = "/c/portal/logout";
    },
    goToDangKyPage() {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        // eslint-disable-next-line
        let redirectURL = window.themeDisplay
          .getLayoutRelativeURL()
          .substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf("/"));
        if (redirectURL !== "") {
          window.location.href = redirectURL + "/register";
        } else {
          window.location.href = window.themeDisplay.getURLHome() + "/register";
        }
      } else {
        window.location.href = "/register";
      }
    },
    goToDangNhap() {
      let vm = this;
      axios
        .post(
          "/o/v1/opencps/login",
          {},
          {
            headers: {
              Authorization:
                "BASIC " + window.btoa(vm.userName + ":" + vm.passWord)
            }
          }
        )
        .then(function(response) {
          if (
            response.data !== "" &&
            response.data !== "ok" &&
            response.data !== "captcha" &&
            response.data !== "lockout"
          ) {
            if (response.data === "pending") {
              let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
              window.location.href =
                url +
                "/register#/xac-thuc-tai-khoan?active_user_id=" +
                window.themeDisplay.getUserId() +
                "&redirectURL=" +
                url;
            } else {
              window.location.href = response.data
            }
          } else if (response.data === "ok") {
            window.location.href = window.themeDisplay.getURLHome();
          } else if (response.data === "captcha") {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.")
          } else if (response.data === "lockout") {
            toastr.error("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị tạm khóa trong 10 phút.")
          } else {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
          }
        })
        .catch(function(error) {
          toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
        });
    },
    goToDangNhapPress(e) {
      let vm = this;
      if (e.keyCode == 13) {
        axios
          .post(
            "/o/v1/opencps/login",
            {},
            {
              headers: {
                Authorization:
                  "BASIC " + window.btoa(vm.userName + ":" + vm.passWord)
              }
            }
          )
          .then(function(response) {
            console.log(response.data);
            if (
              response.data !== "" &&
              response.data !== "ok" &&
              response.data !== "captcha" && 
              response.data !== "lockout"
            ) {
              if (response.data === "pending") {
                window.location.href =
                  window.themeDisplay.getURLHome() +
                  "/register#/xac-thuc-tai-khoan?active_user_id=" +
                  window.themeDisplay.getUserId() +
                  "&redirectURL=" +
                  window.themeDisplay.getURLHome()
              } else {
                window.location.href = response.data
              }
            } else if (response.data === "ok") {
              window.location.href = window.themeDisplay.getURLHome()
            } else if (response.data === "captcha") {
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.")
            } else if (response.data === "lockout") {
              toastr.error("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị tạm khóa trong 10 phút.")
            } else {
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.")
            }
          })
          .catch(function(error) {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.")
          });
      }
    },
    hashCode(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    },
    intToRGB(i) {
      var c = (i & 0x00ffffff).toString(16).toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
    }
  }
}
</script>
