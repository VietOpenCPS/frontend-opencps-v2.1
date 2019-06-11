<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big">
        <span>TẠO TỜ KHAI TRỰC TUYẾN</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          <v-text-field
            v-model="eformNoSearch"
            placeholder="Tìm kiếm tờ khai theo mã"
            solo
            chips
            multiple
            deletable-chips
            item-value="eFormNo"
            item-text="eFormName"
            @keyup.enter="filterEform"
            content-class="adv__search__select"
            return-object
          ></v-text-field>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2" v-on:click.native="filterEform">
            <v-icon size="16">search</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
    <div>
      <div v-if="!serviceinfoSelected" class="pt-5 text-xs-center">
        <h2 class="mb-3" style="opacity:0.2;font-style:italic">Vui lòng chọn thủ tục để tạo tờ khai trực tuyến !</h2>
        <img style="opacity:0.1" src="https://i1.wp.com/www.onsitebristol.co.uk/wp-content/uploads/2016/06/application-form-icon-school-admission-form-512.png?fit=300%2C300&ssl=1" alt="">
      </div>
      <v-card flat color="#fff" v-else>
        <h3 class="py-3 pl-3" style="color: #036edb">{{serviceinfoSelected.serviceName}}</h3>
        <v-flex xs12 class="text-xs-right">
          <v-btn id="eform-btn" color="primary" @click.stop="postEform()" class="mr-3">
            <v-icon color="white">save</v-icon>&nbsp;
            Tạo tờ khai
          </v-btn>
        </v-flex>
        <div id="formAlpacaEform" class="mb-5"></div>
      </v-card>
    </div>
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
    formScriptEform: ''
  }),
  computed: {
    serviceinfoSelected () {
      return this.$store.getters.getServiceinfoSelected
    },
    fileTemplateSelected () {
      return this.$store.getters.getFileTemplateSelected
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.$store.dispatch('loadFormScript', vm.fileTemplateSelected).then(resFormScript => {
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

          setTimeout(function () {
            let pstEl = $('#formAlpacaEform').offset().top + 100
            let offsetLeft = $('#eform-btn').offset().left
            $(window).scroll(function () {
              if ($(window).scrollTop() > pstEl) {
                $('#eform-btn').css({'position':'fixed', 'top':0, 'left': `${offsetLeft}px`})
              } else {
                $('#eform-btn').css({'position':'relative', 'top':0, 'left': 0})
              }
            })
          }, 300)
        }
      })
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
      vm.$store.dispatch('loadFormScript', fileTemplateSelected).then(resFormScript => {
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
          setTimeout(function () {
            let pstEl = $('#formAlpacaEform').offset().top + 100
            let offsetLeft = $('#eform-btn').offset().left
            $(window).scroll(function () {
              if ($(window).scrollTop() > pstEl) {
                $('#eform-btn').css({'position':'fixed', 'top':0, 'left': `${offsetLeft}px`})
              } else {
                $('#eform-btn').css({'position':'relative', 'top':0, 'left': 0})
              }
            })
          }, 300)
        }
      })
    }
  },
  methods: {
    filterEform () {
      let vm = this
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
              toastr.error(field[prop].options.placeholder ? field[prop].options.placeholder + ' là trường dữ liệu bắt buộc' : field[prop].options['name'] + ' là trường dữ liệu bắt buộc')
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
          vm.$store.commit('setEformDetail', response)
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
    deleteAlpacaForm () {
      let vm = this
    }
  }
}
</script>
