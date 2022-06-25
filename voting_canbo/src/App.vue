<template>
  <v-app id="app_voting_canbo">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <div class="wrap-login">
        <div id="header-app" >
          <header id="banner">
            <div class="container layout wrap" style=""> 
              <div class="flex layout wrap sm6 md5 lg4" style="padding-top: 5px;">
                <img class="logo-banner" src="http://119.17.200.69:8174/o/hau-giang-theme/images/quoc_huy.svg">
                <div  class="flex">
                  <div class="title-banner">TRUNG TÂM HÀNH CHÍNH CÔNG</div>
                  <div class="title-banner">TỈNH HẬU GIANG</div>
                </div>
              </div>
              <div class="flex sm6 md7 lg8" style="align-self: center;">
                <div class="title-banner" style="font-size: 20px; text-align: center;">
                  <span>QUẦY cảnh sát hành chính </span>
                </div>
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
              <img src="" alt="">
              <div class="name-emp">
                NGUYỄN THỊ TUYẾT MAI
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
                    @click=""
                  >
                    <span>RẤT HÀI LÒNG</span>
                  </v-btn>
                </div>
                <div>
                  <v-btn class="my-0 white--text btn-vote" color="#940404"
                    :loading="loading"
                    :disabled="loading"
                    @click=""
                  >
                    <span>HÀI LÒNG</span>
                  </v-btn>
                </div>
                <div>
                  <v-btn class="my-0 white--text btn-vote" color="#940404"
                    :loading="loading"
                    :disabled="loading"
                    @click=""
                  >
                    <span>KHÔNG HÀI LÒNG</span>
                  </v-btn>
                </div>
              </div>
            </div>
          </div> 
          
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import toastr from 'toastr'
  import axios from 'axios'
  export default {
    data: () => ({
      loading: false,
      isMobile: false
    }),
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
      if (this.isMobile) {
        $('section#content').css('padding-left', '0px')
      }
    },
    computed: {
    },
    methods: {
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.isMobile = isMobile
      },
      loadEmployees ({commit, state}, data) {
        return new Promise((resolve, reject) => {
          commit('setLoading', true)
          store.dispatch('loadInitResource').then(function (result1) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get(support.initData.employeeApi + '/' + data.itemCode, param).then(result => {
              if (result.data) {
                resolve(result.data.data)
              } else {
                resolve([])
              }
            }).catch(xhr => {
              reject(xhr)
            })
          })
        })
      },
      getEmployee ({commit, state}, data) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result1) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get(support.initData.detailEmployeeApi + '/' + data.employeeId, param).then(result => {
              resolve(result.data)
            }).catch(xhr => {
              reject(xhr)
            })
          })
        })
      },
      submitVoting ({commit, state}, data) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result1) {
            let params = new URLSearchParams()
            const config = {
              headers: {
                'groupId': state.initData.groupId
              }
            }
            if (data.comment) {
              params.append('comment', data.comment)
            }
            params.append('selected', data.selected)
            params.append('className', data.className)
            params.append('classPk', data.classPk)
            axios.post(state.endPointApi + '/postal/votings/' + data.votingId + '/results', params, config).then(result => {
              resolve(result.data)
            }).catch(xhr => {
              reject(xhr)
            })
          })
        })
      }
    }
  }
</script>

<style>
  #app {
    background: transparent !important
  }
  #header-app {
    height: 64px;
    width: 100%;
    background: transparent;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    padding: 0;
  }
  #banner .container {
    height: 64px;
    padding: 0;
  }
  #banner .container a {
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
    border-radius: 10px;
    font-size: 22px;
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
    max-width: 700px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .col-left img {
    width: 300px;
    height: 300px;
  }
  .col-left .name-emp {
    width: 300px;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 24px;
    font-weight: 400;
    color: #fff;
    background: #940404!important;
    padding: 10px;
    border-radius: 10px;
  }
  .wrap-login {
    background: url(https://quantritaikhoan.haugiang.gov.vn/images/bg-login.png) no-repeat center;
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
  .input-text .v-icon{
    color: #B11312 !important;
    font-size: 20px !important;
  }
  .input-text  .v-input__slot {
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 8%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 7%) !important;
  }
</style>