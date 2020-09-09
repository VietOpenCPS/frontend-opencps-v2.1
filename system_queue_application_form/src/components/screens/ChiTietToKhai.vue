<template>
  <div style="border: 1px solid #dedede;border-top:0;">
    <v-dialog
      v-model="dialogLoadingCreate"
      persistent
      width="450"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div v-if="!dialogLoadingCreate">
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span>TỜ KHAI TRỰC TUYẾN</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            {{serviceinfoSelected.serviceName}}
          </div>
          <!-- <div class="flex text-right" style="margin-left: auto;max-width: 150px;height:37px">
            <v-btn color="primary" class="my-0 mx-0 white--text" v-on:click.native="searchEform" style="height:100%">
              <v-icon size="16">search</v-icon> &nbsp;
              Tìm kiếm tờ khai
            </v-btn>
          </div> -->
        </div> 
      </div>
      <div>
        <div v-if="!serviceinfoSelected" class="pt-5 text-xs-center">
          <h2 class="mb-3" style="opacity:0.2;font-style:italic">Vui lòng chọn thủ tục để tạo tờ khai trực tuyến !</h2>
          <img style="opacity:0.1" src="https://i1.wp.com/www.onsitebristol.co.uk/wp-content/uploads/2016/06/application-form-icon-school-admission-form-512.png?fit=300%2C300&ssl=1" alt="">
        </div>
        <v-card flat color="#fff">
          <div id="formAlpacaEform" class="mb-5 pt-3"></div>
        </v-card>
      </div>
      <v-flex xs12 class="text-xs-right my-3 mr-2">
        <v-btn v-if="!isUpdate" color="primary" @click.stop="postEform()" class="">
          <v-icon color="white">save</v-icon>&nbsp;
          Tạo tờ khai
        </v-btn>
        <v-btn v-else color="primary" @click.stop="putEform()" class="">
          <v-icon color="white">save</v-icon>&nbsp;
          Cập nhật tờ khai
        </v-btn>
        <v-btn color="primary" class="ml-3 white--text" @click="goBack">
          <v-icon>reply</v-icon> &nbsp;
          Quay lại
        </v-btn>
      </v-flex>
    </div>
    
    <!--  -->
    <v-dialog v-model="dialogSecret" persistent max-width="400">
      <v-form v-model="validSecret" ref="formSecret" lazy-validation>
        <v-card>
          <v-toolbar flat dark color="primary">
              <v-toolbar-title>Mã tờ khai</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click.native="dialogSecret = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <v-text-field
                  box
                  v-model="eformNoSearch"
                  label="Mã tờ khai"
                  :rules="[v => !!v || 'Mã tờ khai là bắt buộc']"
                  required
                  placeholder="E-xxx-xxx, D-xxx-xxx"
                  @keyup.enter="submitSearchEform"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="mx-2">
            <v-spacer></v-spacer>
            <v-btn color="primary" class="white--text" @click.native="submitSearchEform">Đồng ý</v-btn>
            <v-btn color="primary" class="white--text" @click.native="() => dialogSecret = false">Thoát</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogLogin" max-width="550">
      <v-card class="px-0">
        <v-card-text class="px-0 py-0">
          <v-flex v-if="!isSigned" xs12>
            <nav class="toolbar theme--dark primary py-2" data-booted="true">
              <div class="toolbar__content"  style="justify-content: center">
                <div class="white--text text-bold" style="font-size: 1.25em;">ĐĂNG NHẬP ĐỒNG BỘ TÀI KHOẢN</div>
              </div>
            </nav>
            <v-flex xs12 class="px-2 pb-2" style="border: 1px solid #dddddd;">
              <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
                <v-flex xs12>
                  <v-text-field
                    box
                    placeholder="Email đăng nhập"
                    v-model="userName"
                    :rules="[v => !!v || 'Email đăng nhập là bắt buộc']"
                    required
                    prepend-inner-icon="person_outline"
                    @keyup.enter="submitConfirmLogin"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="">
                  <v-text-field
                    box
                    placeholder="Mật khẩu"
                    v-model="passWord"
                    :type="'password'"
                    :rules="[v => !!v || 'Mật khẩu là bắt buộc']"
                    required
                    prepend-inner-icon="vpn_key"
                    @keyup.enter="submitConfirmLogin"
                  ></v-text-field>
                </v-flex>
                <!-- <v-layout wrap class="ml-2">
                  <v-flex @click="getPassword" style="font-size: 12px;cursor: pointer;padding:7px">
                    <div class="primary--text right" >
                      Quên mật khẩu?
                    </div>
                  </v-flex>
                </v-layout> -->
                <!--  -->
                <v-flex v-if="captcha" class="py-2 text-xs-center" xs12 style="
                  align-items: center;
                  background: #dedede;
                  justify-content: center;
                ">
                  <img :src="chapchablob" alt="capcha" style="border-radius: 5px;">
                  <v-btn flat icon v-on:click.native="makeImageCap">
                    <v-icon color="white" size="26">refresh</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12 class="mt-2 text-xs-center" v-if="captcha">
                  <v-text-field
                    box
                    v-model="j_captcha_response"
                    placeholder="Nhập captcha"
                    :rules="[v => !!v || 'Mã captcha là bắt buộc']"
                    required
                  ></v-text-field>
                </v-flex>
                <!--  -->
                <v-flex xs12 class="text-xs-left text-xs-center">
                  <v-btn class="ml-0 mr-1 my-0 white--text" color="primary"
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    @click="submitConfirmLogin"
                  >
                    <v-icon>how_to_reg</v-icon>&nbsp;
                    Đăng nhập
                  </v-btn>
                  <v-btn @click="dialogLogin = false" color="primary">
                    <v-icon>reply</v-icon>&nbsp;
                    Thoát
                  </v-btn>
                </v-flex>
                
              </v-form>
            </v-flex>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import support from '../../store/support.json'
toastr.options = {
  "positionClass": "toast-top-center"
}

Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    serviceInfoList: [],
    eformNoSearch: '',
    secretKey: '',
    dialogSecret: false,
    validSecret: false,
    isUpdate: false,
    dataCheck: '',
    loadingForm: false,
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
    dialogLogin: false,
    userName: '',
    passWord: '',
    valid: false,
    captcha: false,
    j_captcha_response: '',
    loadingLogin: false,
    dataMapping: '',
    mapping: false,
    dialogLoadingCreate: false,
  }),
  computed: {
    serviceinfoSelected () {
      return this.$store.getters.getServiceinfoSelected
    },
    fileTemplateSelected () {
      return this.$store.getters.getFileTemplateSelected
    },
    formScriptEform () {
      return this.$store.getters.getFormScriptEform
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      if (vm.fileTemplateSelected) {
        vm.loadScriptTemplate(vm.fileTemplateSelected)
      } else {
        if (currentQuery.hasOwnProperty('service') && currentQuery.service && currentQuery.hasOwnProperty('template') && currentQuery.template) {
          if (currentQuery.hasOwnProperty('vnconnect') && String(currentQuery['vnconnect']) === '1' && !window.themeDisplay.isSignedIn()) {
            vm.checkVNConect()
          }
          let searchParams = window.location.href.split("?")
          if (searchParams[1]) {
            let dataDVCQG = decodeURIComponent(String(vm.getSearchParams(searchParams[1], "data")))
            // console.log('dataDVCQG', dataDVCQG)
            if (dataDVCQG) {
              let dataObj = JSON.parse(atob(dataDVCQG))
              console.log('dataObj', dataObj)
              if (dataObj && dataObj.hasOwnProperty('userId') && String(dataObj.userId) === '0') {
                vm.mapping = true
                vm.dataMapping = dataObj
                vm.dialogLogin = true
                // 
                let typeAccount = ''
                let title = ''
                let idType = ''
                if (dataObj.LoaiTaiKhoan === '1') {
                  typeAccount = 'Số CMND/ Căn cước '
                  idType = dataObj.SoCMND
                } else if (dataObj.LoaiTaiKhoan === '2') {
                  typeAccount = 'Mã số thuế '
                  idType = dataObj.MaSoThue
                }
                if (typeAccount && (dataObj.SoCMND || dataObj.MaSoThue)) {
                  title = typeAccount + idType + ' đã tạo tài khoản trên hệ thống. Vui lòng đăng nhập để đồng bộ với tài khoản Cổng Dịch vụ công Quốc gia.'
                }
                if (title) {
                  toastr.options = {
                    'positionClass': 'toast-top-center',
                    'closeButton': true,
                    'timeOut': '30000'
                  }
                  toastr.info(title)
                }
                // 
              }
            }
          }
          vm.loadingForm = true
          let filter = {
            index: currentQuery.service
          }
          vm.$store.dispatch('getServiceDetail', filter).then(function (result) {
            vm.$store.commit('setServiceinfoSelected', result)
            
            let data = {
              serviceInfoId: currentQuery.service,
              fileTemplateNo: currentQuery.template
            }
            vm.loadScriptTemplate(data)
          }).catch(function (reject) {
            vm.loadingForm = false
          })
          let filter2 = {
            serviceInfoId: currentQuery.service
          }       
          vm.$store.dispatch('getFileTemplateEform', filter2).then(response => {
            if (response.data) {
              vm.$store.commit('setFileTemplateSelected', response.data)
            }
          })
        } else {
          vm.goBack()
        }
        
      }
    })
  },
  updated () {
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (vm.fileTemplateSelected) {
        vm.loadScriptTemplate(vm.fileTemplateSelected)
      } else {
        if (currentQuery.hasOwnProperty('service') && currentQuery.service && currentQuery.hasOwnProperty('template') && currentQuery.template) {
          vm.loadingForm = true
          let filter = {
            index: currentQuery.service
          }
          vm.$store.dispatch('getServiceDetail', filter).then(function (result) {
            vm.$store.commit('setServiceinfoSelected', result)
            
            let data = {
              serviceInfoId: currentQuery.service,
              fileTemplateNo: currentQuery.template
            }
            vm.loadScriptTemplate(data)
          }).catch(function (reject) {
            vm.loadingForm = false
          })
        } else {
          vm.goBack()
        }
      }
    }
  },
  methods: {
    loadScriptTemplate (dataInput) {
      let vm = this
      vm.loadingForm = true
      vm.$store.dispatch('loadFormScript', dataInput).then(resFormScript => {
        vm.loadingForm = false
        vm.$store.commit('setFormScriptEform', resFormScript)
        if (resFormScript) {
          let formScript, formData
          /* eslint-disable */
          if (resFormScript) {
            formScript = eval('(' + resFormScript + ')')
          } else {
            formScript = {}
          }
          formData = {}
          /* eslint-disable */
          formScript.data = formData
          window.$('#formAlpacaEform').alpaca(formScript)
          // fixed button
          // setTimeout(function () {
          //   let pstEl = $('#formAlpacaEform').offset().top + 100
          //   let offsetLeft = $('#eform-btn').offset().left
          //   $(window).scroll(function () {
          //     if ($(window).scrollTop() > pstEl) {
          //       $('#eform-btn').css({'position':'fixed', 'top':0, 'left': `${offsetLeft}px`})
          //     } else {
          //       $('#eform-btn').css({'position':'relative', 'top':0, 'left': 0})
          //     }
          //   })
          // }, 300)
        }
      }).catch(function () {
        vm.loadingForm = false
      })
    },
    searchEform () {
      let vm = this
      vm.dialogSecret = true
    },
    submitSearchEform () {
      let vm = this
      if (vm.$refs.formSecret.validate() && vm.eformNoSearch.indexOf('-') > 0) {
        let filter = {
          eFormId: String(vm.eformNoSearch).split('-')[2],
          secret: String(vm.eformNoSearch).split('-')[1]
        }
        vm.dataCheck = filter
        vm.$store.dispatch('getEformData', filter).then(function(result) {
          if (result && result !== 'secretFail') {
            toastr.success('Lấy thông tin tờ khai thành công')
            vm.$store.commit('setEformDetail', result)
            vm.dialogSecret = false
            window.$('#formAlpacaEform').empty()
            let formScript, formData
            /* eslint-disable */
            if (vm.formScriptEform) {
              formScript = eval('(' + vm.formScriptEform + ')')
            } else {
              formScript = {}
            }
            formData = eval('(' + result + ')')
            /* eslint-disable */
            formScript.data = formData
            window.$('#formAlpacaEform').alpaca(formScript)
            vm.isUpdate = true
          }
        }).catch(function(error) {
        })
      } else {
        toastr.clear()
        toastr.error('Mã tờ khai không chính xác. Vui lòng kiểm tra lại')
      }
    },
    postEform () {
      let vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
      let fileTemplateNoParam = currentQuery.hasOwnProperty('template') && currentQuery.template ? currentQuery.template : ''
      let options = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        }
      }
      try {
        let control = window.$('#formAlpacaEform').alpaca('get')
        let formData = control.getValue()
        console.log('formData post', formData)
        let field = window.$('#formAlpacaEform').alpaca('get').childrenByPropertyId
        if (field) {
          for (var prop in field) {
            if (field[prop].isRequired() && field[prop].getValue() === '') {
              toastr.clear()
              toastr.error(field[prop].options.title ? field[prop].options.title + ' là bắt buộc' : field[prop].options['name'] + ' là bắt buộc')
              return
            }
          }
        }
        let dataCreateEform = new URLSearchParams()
        dataCreateEform.append('eFormData', JSON.stringify(formData))
        dataCreateEform.append('serviceInfoId', vm.serviceinfoSelected.serviceInfoId)
        dataCreateEform.append('fileTemplateNo', fileTemplateNoParam ? fileTemplateNoParam : vm.fileTemplateSelected.fileTemplateNo)
        dataCreateEform.append('email', '')
        axios.post('/o/rest/v2/eforms', dataCreateEform, options).then(function (response) {
          vm.$store.commit('setEformDetail', response.data)
          vm.$router.push({
            path: '/tao-to-khai-thanh-cong/0',
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }).catch(function (xhr) {
        })
      } catch (e) {
      }
    },
    putEform () {
      let vm = this
      let options = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        }
      }
      try {
        let control = window.$('#formAlpacaEform').alpaca('get')
        let formData = control.getValue()
        console.log('formData post', formData)
        let field = window.$('#formAlpacaEform').alpaca('get').childrenByPropertyId
        if (field) {
          for (var prop in field) {
            if (field[prop].isRequired() && field[prop].getValue() === '') {
              toastr.clear()
              toastr.error(field[prop].options.title ? field[prop].options.title + ' là bắt buộc' : field[prop].options['name'] + ' là bắt buộc')
              return
            }
          }
        }
        let dataUpdateEform = new URLSearchParams()
        dataUpdateEform.append('eFormData', JSON.stringify(formData))
        axios.put('/o/rest/v2/eforms/' + vm.dataCheck.eFormId + '/data/' + vm.dataCheck.secret, dataUpdateEform, options).then(function (response) {
          let filterEform = {
            eFormId: vm.dataCheck['eFormId']
          }
          vm.$store.dispatch('getEform', filterEform).then(function (result) {
            vm.$store.commit('setEformDetail', result)
            vm.$router.push({
              path: '/tao-to-khai-thanh-cong',
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
          })
        }).catch(function (xhr) {
        })
      } catch (e) {
      }
    },
    deleteAlpacaForm () {
      let vm = this
    },
    checkVNConect () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let service = ''
      let template = ''
      if (query.hasOwnProperty('service') && query.service) {
        service = query.service
      }
      if (query.hasOwnProperty('template') && query.template) {
        template = query.template
      }
      let filter = {
        state: '',
        redirectURL: service && template ? window.location.href.split("?")[0] + '?service=' +  service + '&template=' + template : window.location.href.split("?")[0]
      }
      setTimeout (function () {
        if (!vm.isSigned) {
          vm.dialogLoadingCreate = true
          vm.$store.dispatch('getVNConect', filter).then(function (result) {
            if (result) {
              window.location.href = result
            } else {
              alert('Chức năng đang cập nhật')
            }
            vm.dialogLoadingCreate = false
          }).catch(function () {
            vm.dialogLoadingCreate = false
            if (!vm.isSigned) {
              vm.dialogLogin = true
            }
          })
        }
      }, 300)
    },
    submitConfirmLogin () {
      let vm = this
      let current = vm.$router.history.current
      let filter = {
        npmreactlogin_login: vm.userName,
        npmreactlogin_password: vm.passWord,
        j_captcha_response: vm.j_captcha_response
      }
      if (vm.$refs.form.validate() && vm.userName && vm.passWord) {
        vm.loadingLogin = true
        vm.$store.dispatch('goToDangNhap', filter).then(function(result) {
          vm.loadingLogin = false
          if (vm.mapping && result === 'success') {
            vm.doMappingDvcqg()
          }
          if (result === 'success') {
            vm.dialogLogin = false
          } 
          if (result === 'captcha') {
            vm.captcha = true
            vm.makeImageCap()
          }
        }).catch(function(){
          vm.loadingLogin = false
          vm.makeImageCap()
        })
      }
    },
    getSearchParams (prams, key) {
      let value = ""
      let headers = prams.split("&")
      headers.forEach(function (header) {
        header = header.split("=");
        let keyHeader = header[0];
        if (keyHeader === key) {
          value = header[1]
        }
      });
      return value
    },
    makeImageCap () {
      var vm = this
      vm.chapchablob = ''
      vm.$store.dispatch('makeImageCapLogin').then(function (result) {
        vm.chapchablob = result
      }).catch(function (reject) {
        vm.chapchablob = ''
      })
    },
    doMappingDvcqg () {
      let vm = this
      let filter = {
        dataMapping: vm.dataMapping
      }
      vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
      }).catch(function () {
      })
    },
    goBack () {
      let vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
      if (currentQuery.hasOwnProperty('service') && currentQuery.service && currentQuery.hasOwnProperty('template') && currentQuery.template) {
        window.history.back()
      } else {
        vm.$router.push({
          path: '/',
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    }
  }
}
</script>
