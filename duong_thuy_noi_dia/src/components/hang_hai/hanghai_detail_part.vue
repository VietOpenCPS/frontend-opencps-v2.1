<template>
  <div style="width: 100%; position: relative;">
    <div class="row-header" style="height: 38px;overflow: hidden;">
      <div class="background-triangle-big" @click="backtolistpdf()"> THÀNH PHẦN HỒ SƠ </div>
      <div class="layout row wrap header_tools row-blue">
      </div>
    </div>
    
    <div v-if="loadingList">
      <content-placeholders>
        <content-placeholders-text :lines="14" />
      </content-placeholders>
    </div>
    <ul class="list thanh_phan_hoso pr-2">
      <li class="list--group__container" v-for="(item, index) in thanhPhanLists" v-bind:key="item.code">
        <ul class="list--group__header" :index="index" :class='{"list--group__header--active": (thanhPhanSelected===item.code)}' @click.stop.prevent="selectThanhPhan(item, index, $event)">
          <li>
            <a class="list__tile list__tile--link">
              <div class="list__tile__action pl-3">
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/lenh_dieu_dong_on.png" alt="ldd" v-if="item.code === 'lenh_dieu_dong' && item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/lenh_dieu_dong_off.png" alt="ldd" v-else-if="item.code === 'lenh_dieu_dong' && !item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/giay_to_on.png" alt="gt" v-else-if=" (item.code === 'NC_23' || item.code === 'NC_24' || item.code === 'NC_25' || item.code === 'NC_2014' || item.code === 'NC_2018') && item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/giay_to_off.png" alt="gt" v-else-if=" (item.code === 'NC_23' || item.code === 'NC_24' || item.code === 'NC_25' || item.code === 'NC_2014' || item.code === 'NC_2018') && !item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/folder_on.png" alt="bk" v-else-if="item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/folder_off.png" alt="bk" v-else-if="!item.available"/>
              </div>
              <div class="list__tile__content">
                <div class="list__tile__title">
                  {{item.name}}
                </div>
              </div>
              <div class="list__tile__action" v-if="item.state == 1 && item.available">
                <v-icon color="primary">done</v-icon>
              </div>
              <div class="list__tile__action" v-else-if="item.state == 0">
                <v-icon class="orange--text">warning</v-icon>
              </div>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
const COMPONENT_NAME = 'jx-hanghai-detail-part'
import { eventBus } from '../../event-bus/eventBus.js'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    thanh_phan_ho_so_api: '',
    detail_ho_so: {},
    type: '',
    document_type_code: '',
    document_status_code: '',
    document_name: '',
    document_year: 0
  },
  data () {
    return {
      thanhPhanLists: [],
      thanhPhanSelected: '',
      loadingList: true,
      messageTypeTemp: 0
    }
  },
  methods: {
    backtolistpdf: function () {
      this.thanhPhanSelected = 0
      this.$router.push({ path: '/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code,
        query: {
          'renew': Math.floor(Math.random() * (10 - 1 + 1)) + 1
        }
      })
    },
    reloadThanhPhanParam: function (url) {
      let vm = this
      let currentParams = vm.$router.history.current.params
      if (currentParams.hasOwnProperty('messageType')) {
        vm.messageTypeTemp = currentParams.messageType
      }
      vm.thanh_phan_ho_so_api = url
      vm.reloadThanhPhan()
    },
    reloadThanhPhan: function () {
      var vm = this
      vm.thanhPhanLists = []
      if (vm.thanh_phan_ho_so_api !== '') {
        let config = {
          params: {
            'documentType': vm.document_type_code,
            'documentName': vm.document_name,
            'documentYear': vm.document_year,
            'roleUserFilterselectedType': -1
          }
        }
        if (vm.type !== 'ke_hoach') {
          config.params.roleUserFilterselectedType = 0
        }
        vm.loadingList = true
        axios
          .get(vm.thanh_phan_ho_so_api, config)
          .then(function (response) {
            var serializable = response.data
            vm.thanhPhanLists = serializable
            eventBus.$emit('thanhphanlist', vm.thanhPhanLists)
            vm.loadingList = false
          })
          .catch(function (error) {
            console.log(error)
            vm.loadingList = false
          })
      }
    },
    selectThanhPhan: function (item, index, event) {
      var vm = this
      vm.thanhPhanSelected = item.code
      setTimeout(() => {
        if (item.available || (item.code === 'NC_23' || item.code === 'NC_24' || item.code === 'NC_25' || item.code === 'NC_2014')) {
          let requestCodeView = 0
          if (item.requestCode.length > 0) {
            requestCodeView = item.requestCode
          }
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          if (item.messageType === 23 || item.messageType === '23') {
            if ((event.metaKey || event.ctrlKey) && event.type === 'click') {
              window.open(orginURL + '#/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state + '?title=' + item.name)
            } else {
              location.replace(orginURL + '#/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state + '?title=' + item.name)
            }
          } else {
            if ((event.metaKey || event.ctrlKey) && event.type === 'click') {
              window.open(orginURL + '#/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state + '?title=' + item.name)
            } else {
              vm.$router.push({ path: '/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state,
                query: {
                  title: item.name
                }
              })
            }
          }
        } else {
          alert('Không có ' + item.name + ' !')
        }
      }, 200)
    }
  }
}
</script>
