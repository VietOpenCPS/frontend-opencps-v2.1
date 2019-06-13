<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big">
        <span>TỜ KHAI TRỰC TUYẾN</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          {{serviceinfoSelected.serviceName}}
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 150px;height:37px">
          <v-btn color="primary" class="my-0 mx-0 white--text" v-on:click.native="searchEform" style="height:100%">
            <v-icon size="16">search</v-icon> &nbsp;
            Tìm kiếm tờ khai
          </v-btn>
        </div>
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
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import support from '../../store/support.json'
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
    loadingForm: false
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
        vm.loadingForm = true
        vm.$store.dispatch('loadFormScript', vm.fileTemplateSelected).then(resFormScript => {
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
        })
      } else {
        vm.goBack()
      }
    })
  },
  updated () {
    var vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.loadingForm = true
      vm.$store.dispatch('loadFormScript', fileTemplateSelected).then(resFormScript => {
        vm.loadingForm = false
        vm.$store.commit('setFormScriptEform', resFormScript)
        if (resFormScript) {
          window.$('#formAlpacaEform').empty()
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
      })
    }
  },
  methods: {
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
          if (result) {
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
      }
    },
    postEform () {
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
        let dataCreateEform = new URLSearchParams()
        dataCreateEform.append('eFormData', JSON.stringify(formData))
        dataCreateEform.append('serviceInfoId', vm.serviceinfoSelected.serviceInfoId)
        dataCreateEform.append('fileTemplateNo', vm.fileTemplateSelected.fileTemplateNo)
        dataCreateEform.append('email', '')
        axios.post('/o/rest/v2/eforms', dataCreateEform, options).then(function (response) {
          vm.$store.commit('setEformDetail', response.data)
          vm.$router.push({
            path: '/tao-to-khai-thanh-cong',
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
    goBack () {
      let vm = this
      vm.$router.push({
        path: '/',
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    }
  }
}
</script>
