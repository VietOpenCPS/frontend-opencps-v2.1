<template>
  <v-app id="app_voting_canbo">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <div class="wrap-login">
        <div class="wrap-btn-screen">
          <v-btn class="btn-screen px-0" @click.stop="changeScreen" flat icon color="#940404">
            <v-icon size="28" v-if="!fullScreen">fullscreen</v-icon>
            <v-icon size="28" v-else>fullscreen_exit</v-icon>
          </v-btn>
        </div>
        <div id="header-app" >
          <header id="banner-voting">
            <div class="container layout wrap" style=""> 
              <div class="flex layout wrap sm6 md5 lg4" style="padding-top: 10px;">
                <img class="logo-banner" src="/o/hau-giang-theme/images/quoc_huy.svg">
                <div  class="flex">
                  <div class="title-banner">TRUNG TÂM HÀNH CHÍNH CÔNG</div>
                  <div class="title-banner">TỈNH HẬU GIANG</div>
                </div>
              </div>
              <div class="flex sm6 md7 lg8" style="align-self: center;">
                <div class="title-banner-2" style="">
                  <span>{{gateName}}</span>
                </div>
              </div>
              <div class="wrap-btn-edit">
                <v-btn title="Sửa tên quầy" class="btn-screen px-0" @click.stop="showUpdateGate" flat icon color="#940404">
                  <v-icon size="28">edit</v-icon>
                </v-btn>
              </div>
            </div>
          </header>
        </div>
        <v-container
          id="wrap-content"
          class="px-0 pt-0"
          tag="section"
        >
          
          <div class="layout wrap">
            <div class="flex col-left sm6 md5 lg4">
              <img :src="employeeAvatar" alt="">
              <div class="name-emp">
                {{employeeInfo.employeeFullName ? employeeInfo.employeeFullName : employeeInfo.userName}}
              </div>
            </div>
            <div class="flex col-right sm6 md7 lg8">
              <div class="title-voting">
                Xin vui lòng đánh giá chất lượng dịch vụ?
              </div>
              <div>
                <div>
                  <v-btn class="my-0 white--text btn-vote" color="#940404"
                    :loading="loading"
                    :disabled="loading"
                    @click.stop="submitVoting({name: 'Rất hài lòng', value: 3})"
                  >
                    <span>RẤT HÀI LÒNG</span>
                  </v-btn>
                </div>
                <div>
                  <v-btn class="my-0 white--text btn-vote" color="#940404"
                    :loading="loading"
                    :disabled="loading"
                    @click.stop="submitVoting({name: 'Hài lòng', value: 2})"
                  >
                    <span>HÀI LÒNG</span>
                  </v-btn>
                </div>
                <div>
                  <v-btn class="my-0 white--text btn-vote" color="#940404"
                    :loading="loading"
                    :disabled="loading"
                    @click.stop="submitVoting({name: 'Không hài lòng', value: 1})"
                  >
                    <span>KHÔNG HÀI LÒNG</span>
                  </v-btn>
                </div>
              </div>
            </div>
          </div> 
          
        </v-container>
        <v-dialog v-model="dialogSuccess" persistent max-width="700px">
          <v-card>
            <v-toolbar height="48" flat dark color="#940404">
              <v-toolbar-title style="width: 100%;text-transform: uppercase;">Đánh giá cán bộ thành công</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p class="text-success" style="text-align: justify">- Cảm ơn quý khách đã tham gia đánh giá cán bộ.</p>
              <p class="text-success" style="text-align: justify">- Kết quả đánh giá của bạn đã giúp chúng tôi cải thiện, nâng cao chất lượng phục vụ và cung ứng
                dịch vụ giải quyết thủ tục hành chính cho người dân, tổ chức, doanh nghiệp.
              </p>
              <p class="my-2 text-success" style="text-align:center">(Có thể đánh giá sau {{countDown}} giây)</p>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogUpdate" persistent max-width="500px">
          <v-card>
            <v-toolbar height="48" flat dark color="#940404">
              <v-toolbar-title>Cập nhật tên quầy</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                label="Tên quầy"
                v-model="gateNameEdit"
                box
                clearable
                color="#940404"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="mx-0 px-3">
              <v-spacer></v-spacer>
              <v-btn class="white--text mr-2" color="red" style="color: #fff !important"  @click="dialogUpdate = false" :loading="loading" :disabled="loading">
                <v-icon class="white--text" size="20"  style="color: #fff !important">clear</v-icon>&nbsp; Thoát
              </v-btn>
              <v-btn style="color: #fff !important" color="#940404" @click="submitUpdate" :loading="loading" :disabled="loading">
                <v-icon size="20">save</v-icon>&nbsp; Cập nhật
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  Vue.use(toastr)
  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    data: () => ({
      gateName: 'Quầy cảnh sát hành chính',
      gateNameEdit: '',
      dialogSuccess: false,
      fullScreen: false,
      loading: false,
      isMobile: false,
      employeeInfo: '',
      employeeAvatar: '/o/hau-giang-theme/images/avatar-default.png',
      countDown: 0,
      dialogUpdate: false
    }),
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted: function () {
      let vm = this
      this.$nextTick(function () {
        // let userId = window.themeDisplay ? window.themeDisplay.getUserId() : ''
        // if (userId && userId != '20139') {
        //   vm.fullScreen = true
        //   setTimeout(function () {
        //     vm.openFullscreen()
        //   }, 500)
        // }
      })
    },
    computed: {
    },
    created () {
      let vm = this
      vm.getEmployee()
      setInterval(function () {
        // location.reload()
        vm.getEmployee()
      }, 1*60*1000)
    },
    methods: {
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.isMobile = isMobile
      },
      getEmployee () {
        let vm = this
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let userId = window.themeDisplay.getUserId()
        if (userId) {
          axios.get('/o/v1/opencps/users/' + userId, param).then(function (response) {
            vm.employeeInfo = response.data
            axios.get('/o/v1/opencps/users/avatar/' + vm.employeeInfo['className'] + '/' + vm.employeeInfo['classPK'], param).then(function (response) {
              let seriable = response.data
              let portalURL = ''
              if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
                portalURL = window.themeDisplay.getPortalURL()
              }
              if (seriable) {
                vm.employeeAvatar = portalURL + seriable
              } else {
                vm.employeeAvatar = '/o/hau-giang-theme/images/avatar-default.png'
              }
            }).catch(function (xhr) {
            })
          })
        }
      },
      submitVoting (vote) {
        let vm = this
        let data = JSON.stringify({
          "dossierNo": "",
          "govAgencyCode": "",
          "govAgencyName": "",
          "employeeEmail": vm.employeeInfo ? vm.employeeInfo.employeeEmail : '',
          "employeeName": vm.employeeInfo ? vm.employeeInfo.employeeFullName : '',
          "votingName": vote.name,
          "votingValue": vote.value,
          "groupId": window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        })
        vm.loading = true
        let config = {
          method: 'post',
          url: '/o/rest/v2/votings/rateEmployee',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        }

        axios(config)
        .then(function (response) {
          vm.loading = false
          vm.dialogSuccess = true
          vm.countDown = 30
          var downloadTimer = setInterval(function(){
            if(vm.countDown <= 0){
              clearInterval(downloadTimer)
            }
            vm.countDown -= 1
          }, 1000)
          setTimeout (function () {
            vm.dialogSuccess = false
          }, 30000)
        })
        .catch(function (error) {
          vm.loading = false
        })
      },
      showUpdateGate () {
        let vm = this
        vm.gateNameEdit = vm.gateName
        vm.dialogUpdate = true
      },
      submitUpdate () {
        let vm = this
        let data = JSON.stringify({
          "title_vote": vm.gateNameEdit
        })
        vm.loading = true
        let config = {
          method: 'post',
          url: '/o/rest/v2/votings/rateEmployee',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        }

        axios(config)
        .then(function (response) {
          vm.loading = false
          vm.dialogUpdate = false
          vm.gateName = vm.gateNameEdit
        })
        .catch(function (error) {
          toastr.error('Cập nhật không thành công')
          vm.loading = false
        })
      },
      changeScreen () {
        let vm = this
        if (vm.fullScreen) {
          vm.closeFullscreen()
          vm.fullScreen = false
        } else {
          vm.openFullscreen()
          vm.fullScreen = true
        }
      },
      openFullscreen () {
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen();
        }
      },
      closeFullscreen() {
        var elem = document.documentElement;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen();
        }
      }
    }
  }
</script>

<style>
  .wrap-btn-screen {
    position: absolute;
    right: 10px;
    top: 78px;
  }
  .wrap-btn-edit {
    position: absolute;
    right: 10px;
    top: 15px;
  }
  header#banner, nav#navigation, footer#footer, .yhy-append-wrap {
    display: none !important;
  }
  #app {
    background: transparent !important
  }
  #header-app {
    height: 72px;
    width: 100%;
    background: transparent;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    padding: 0;
  }
  #banner-voting .container {
    height: 72px;
    padding: 0;
  }
  #banner-voting .container a {
    text-decoration: none;
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    align-content: center;
  }
  .logo-banner {
    width: 55px;
    height: 55px;
    margin-right: 13px;
  }
  .title-banner {
    font-family: "Roboto";
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 26px;
    color: #940404;
    text-transform: uppercase;
  }
  .title-banner-2 {
    font-family: "Roboto";
    font-style: normal;
    font-weight: bold;
    line-height: 26px;
    color: #940404;
    text-transform: uppercase;
    font-size: 20px;
    text-align: center;
  }
  #wrap-content {
    padding-top: 50px !important;
  }
  .col-left {
    width: 300px;
    max-width: 350px;
    text-align: center;
    padding: 15px;
        /* border: 1px solid red; */
  }
  .col-right {
    text-align: center;
    padding: 15px;
        /* border: 1px solid red; */
  }
  .btn-vote {
    width: 300px;
    margin-bottom: 20px !important;
    border-radius: 10px !important;
    font-size: 22px !important;
    height: 64px !important;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 5px 0px rgb(0 0 0 / 20%), 0px 5px 5px 0px rgb(0 0 0 / 22%) !important;
  }
  .title-voting {
    min-height: 64px !important;
    font-size: 24px;
    font-weight: 400;
    color: #fff;
    background: #940404!important;
    padding: 10px;
    border-radius: 15px;
    max-width: 600px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .col-left img {
    width: 250px;
    height: 330px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .col-left .name-emp {
    max-width: 300px;
    margin: 0 auto;
    margin-top: 15px;
    font-size: 22px;
    font-weight: 400;
    color: #fff;
    background: #940404!important;
    padding: 10px;
    border-radius: 10px;
  }
  .wrap-login {
    background: url(/o/hau-giang-theme/images/bg-trongdong.png) no-repeat center;
    background-size: cover;
    height: 100vh;
    width: 100%;
    position: relative;
  }
  #login-page {
    position: relative;
  }
  .container-wrap {
    position: absolute;
    width: 651px;
    height: 155px;
    left: 66px;
    top: 87px;
  }
  .img-login-logo {
    width: 630px;
    height: 410px; 
    position: absolute;
    left: 50%;
    right: 3.89%;
    top: 21.88%;
    bottom: 13.64%;
  }
  .text-1 {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 900;
    font-size: 38px;
    line-height: 50px;
    color: #940404;
  }
  .text-1-1 {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 900;
    font-size: 42px;
    line-height: 55px;
    color: #E9372B;
    text-transform: uppercase;
  }
  .wrap-form {
    width: 465px;
    margin-top: 80px
  }
  .text-login {
    font-family: Roboto;
    font-style: normal;
    font-weight: 900;
    font-size: 18px;
    line-height: 21px;
    color: #940404;
    text-shadow: 0px 3px 3px rgba(0, 0, 0, 0.17);
    margin-bottom: 15px;
    text-transform: uppercase;
  }
  .text-success {
    font-size: 18px;
    font-weight: 500;
    color: #000000de;
  }
  .input-text .v-icon{
    color: #B11312 !important;
    font-size: 20px !important;
  }
  .input-text  .v-input__slot {
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 8%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 7%) !important;
  }
  @media (max-width: 767px) {
    #app_voting_canbo .title-banner {
      font-size: 16px !important;
    }
    #app_voting_canbo .title-banner-2 {
      margin-top: 20px !important ;
    }
    .btn-vote {
      width: 280px;
    }
  }
</style>