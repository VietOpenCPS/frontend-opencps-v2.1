<template>
  <div style="width: 100%; position: relative;">
    <v-layout v-if="type === 'ke_hoach' || type === 'thu_tuc'">
      <v-flex>
        <v-select
          v-model="documentType"
          autocomplete
          :items="doc_typesSelect"
          return-object
          item-text="name"
          item-value="code"
          @change="changeDocumentFilter($event)"
        ></v-select>
      </v-flex>
      <v-flex v-if="!payment">
        <v-btn icon class="mx-0 my-0 grey lighten-2" v-on:click.native="filterLeftSearch">
          <v-icon>search</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-text-field
      v-model="shipName"
      placeholder="Tên tàu"
    ></v-text-field>
    <v-text-field
      v-model="maBanKhai"
      placeholder="Mã bản khai"
    ></v-text-field>
    <v-text-field
      v-model="callSign"
      placeholder="Hô hiệu/ Số đăng ký"
    ></v-text-field>

    <div style="width: 100%;" class="ml-3" v-if="loading && (type === 'ke_hoach' || type === 'thu_tuc')">
			<content-placeholders>
				<content-placeholders-text :lines="4" />
			</content-placeholders>
		</div>
		<div class="flex xs12" v-else-if="type === 'ke_hoach' || type === 'thu_tuc'">
      <v-list v-if="document_type_code != 0" class="py-0 nav_trang_thai_ho_so"> 
        <v-list-group v-for="(item, index) in role_filter_status" 
          :value="item.id_active === type" 
          v-bind:key="index" >
          <v-list-tile slot="activator"
          :to="'/danh-sach-ho-so/' + item.id_active + '/' + document_type_code + '/' + 0">
            <v-list-tile-action> 
              <v-icon color="primary">{{ item.action }}</v-icon> 
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <span class="status__counter">{{ item.counter }}</span> 
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-for="(subItem, subIndex) in item.items"
            v-bind:key="subIndex"
            :to="{path: '/danh-sach-ho-so/' + item.id_active + '/' + document_type_code + '/' + subItem.code, 
                  query: {
                    'shipName': shipName,
                    'maBanKhai': maBanKhai,
                    'callSign': callSign,
                    'page': 1
                  }
                  }">

            <v-list-tile-action> 
             <v-icon v-if="subItem.code == document_status_code">play_arrow</v-icon>
            </v-list-tile-action>

            <v-list-tile-content> 
              <v-list-tile-title> {{ subItem.title }} </v-list-tile-title>  
              <span v-if="subItem.counter > -1" class="status__counter">
                {{subItem.counter}}
              </span>
              <span v-else class="status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
            </v-list-tile-content>

          </v-list-tile>

        </v-list-group> 

        <v-list-group :value="true" v-if="isThuTuc">
          <v-list-tile slot="activator"
          :to="{
            path: '/danh-sach-ho-so/' + type + '/' + document_type_code + '/' + 0,
            query: {
              'shipName': shipName,
              'maBanKhai': maBanKhai,
              'callSign': callSign,
              'page': 1,
              'payment': true
            }
          }">
            <v-list-tile-action> 
              <v-icon color="primary">folder</v-icon> 
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Theo dõi thanh toán </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            :to="{path: '/danh-sach-ho-so/' + type + '/' + document_type_code + '/' + 1, 
                  query: {
                    'shipName': shipName,
                    'maBanKhai': maBanKhai,
                    'callSign': callSign,
                    'page': 1,
                    'payment': true
                  }
                  }">

            <v-list-tile-action> 
             <v-icon v-if="1 == document_status_code">play_arrow</v-icon>
            </v-list-tile-action>

            <v-list-tile-content> 
              <v-list-tile-title>Xác nhận thanh toán </v-list-tile-title>  
            </v-list-tile-content>

            <v-list-tile-action class="mr-3"> <v-icon>search</v-icon> </v-list-tile-action>
          </v-list-tile>

          <v-list-tile
            :to="{path: '/danh-sach-ho-so/' + type + '/' + document_type_code + '/' + 2, 
                  query: {
                    'shipName': shipName,
                    'maBanKhai': maBanKhai,
                    'callSign': callSign,
                    'page': 1,
                    'payment': true
                  }
                  }">

            <v-list-tile-action> 
             <v-icon v-if="2 == document_status_code">play_arrow</v-icon>
            </v-list-tile-action>

            <v-list-tile-content> 
              <v-list-tile-title>Đã xử lý </v-list-tile-title>  
            </v-list-tile-content>

            <v-list-tile-action class="mr-3"> <v-icon>search</v-icon> </v-list-tile-action>
          </v-list-tile>

        </v-list-group> 
      </v-list>

      <div v-else class="flex xs12" >
        <v-list-tile v-for="(item, index) in doc_types"
          v-bind:key="index"
          :to="{path: '/danh-sach-ho-so/' + type + '/' + item.code + '/' + 0, 
                query: {
                  'shipName': shipName,
                  'maBanKhai': maBanKhai,
                  'callSign': callSign,
                  'page': 1
                }
                }">

          <v-list-tile-action> 
            <v-icon color="primary">description</v-icon>
          </v-list-tile-action>

          <v-list-tile-content> 
            <v-list-tile-title> {{ item.name }} </v-list-tile-title>  
            <span :id="'tt_count_'+item.code" class="status__counter">
              <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
            </span>
          </v-list-tile-content>

        </v-list-tile>
				
			</div>

    </div>
    <div class="flex xs12" v-else-if="type === 'lanh_dao'">
      <v-list-tile class="text-bold mb-2" :class="{'active--left--filter': activeIndex === 0}" @click="toReloadListData('lanh_dao')">

        <v-list-tile-action> 
          <v-icon color="primary">description</v-icon>
        </v-list-tile-action>

        <v-list-tile-content> 
          <v-list-tile-title> Hồ sơ chờ ký số </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action> 
          <v-btn icon class="mx-0 my-0 grey lighten-2" v-on:click.native="filterLeftSearch">
            <v-icon>search</v-icon>
          </v-btn>
        </v-list-tile-action>

      </v-list-tile>
      <v-list-tile class="text-bold" :class="{'active--left--filter': activeIndex === 1}" @click="toReloadListDataDKS('lanh_dao')">

        <v-list-tile-action> 
          <v-icon color="primary">description</v-icon>
        </v-list-tile-action>

        <v-list-tile-content> 
          <v-list-tile-title> Hồ sơ đã ký số </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action> 
          <v-btn icon class="mx-0 my-0 grey lighten-2" v-on:click.native="filterLeftSearch">
            <v-icon>search</v-icon>
          </v-btn>
        </v-list-tile-action>

      </v-list-tile>
    </div>
    <div class="flex xs12" v-else-if="type === 'van_thu'">
      <v-list-tile class="text-bold" @click="toReloadListData('van_thu')">

        <v-list-tile-action> 
          <v-icon color="primary">description</v-icon>
        </v-list-tile-action>

        <v-list-tile-content> 
          <v-list-tile-title> Hồ sơ chờ đóng dấu </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action> 
          <v-btn icon class="mx-0 my-0 grey lighten-2" v-on:click.native="filterLeftSearch">
            <v-icon>search</v-icon>
          </v-btn>
        </v-list-tile-action>

      </v-list-tile>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
const COMPONENT_NAME = 'jx-hanghai-filter-left'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    document_type_api: '',
    role_filter_api: '',
    type: '',
    document_type_code: '',
    document_status_code: '',
    role_filter_status: [],
    count_ho_so_api: '',
    counter_ho_so_ke_hoach_table: '',
    counter_ho_so_thu_tuc_table: ''
  },
  data () {
    return {
      documentType: {},
      shipName: '',
      maBanKhai: '',
      callSign: '',
      doc_typesSelect: [],
      doc_types: [],
      loading: true,
      isThuTuc: false,
      payment: false,
      initDataFilter: {},
      activeIndex: 0
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        let initData = result
        vm.initDataFilter = result
        vm.isThuTuc = initData.user.isThuTuc
      })
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('daKy') && query.daKy) {
        vm.activeIndex = 1
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query.hasOwnProperty('payment') && query.payment) {
        vm.payment = true
      } else {
        vm.payment = false
      }
    }
  },
  methods: {
    toReloadListData (typeData) {
      let vm = this
      vm.activeIndex = 0
      router.push({path: '/danh-sach-ho-so/' + typeData + '/0/0',
        query: {
          'renew': Math.floor(Math.random() * (10 - 1 + 1)) + 1,
          'shipName': vm.shipName,
          'maBanKhai': vm.maBanKhai,
          'callSign': vm.callSign,
          'page': 1
        }
      })
    },
    toReloadListDataDKS (typeData) {
      let vm = this
      vm.activeIndex = 1
      router.push({path: '/danh-sach-ho-so/' + typeData + '/0/0',
        query: {
          'renew': Math.floor(Math.random() * (10 - 1 + 1)) + 1,
          'shipName': vm.shipName,
          'maBanKhai': vm.maBanKhai,
          'callSign': vm.callSign,
          'daKy': true,
          'page': 1
        }
      })
    },
    doInitUpdate () {
      let vm = this
      vm.loading = true
      vm.doc_types = vm.$parent.$parent.docTypes
      let query = vm.$router.history.current.query
      vm.maBanKhai = query['maBanKhai']
      vm.shipName = query['shipName']
      vm.callSign = query['callSign']
      if (vm.doc_typesSelect.length === 0) {
        vm.doc_typesSelect = Array.from(vm.doc_types)
        vm.doc_typesSelect.unshift({
          'code': '0',
          'name': 'Toàn bộ thủ tục',
          'typeCode': '0'
        })
        if (vm.document_type_code === '0') {
          vm.documentType = vm.doc_typesSelect[0]
        } else {
          for (let key in vm.doc_typesSelect) {
            if (vm.doc_typesSelect[key]['code'] === vm.document_type_code) {
              vm.documentType = vm.doc_typesSelect[key]
            }
          }
        }
      }
      if (this.document_type_code === '0') {
        setTimeout(() => {
          this.doCounterHoSo()
        }, 200)
      }
      vm.loading = false
    },
    filterLeftSearch: function () {
      let vm = this
      router.push({
        path: '/danh-sach-ho-so/' + vm.type + '/' + vm.document_type_code + '/' + vm.document_status_code,
        query: {
          'shipName': vm.shipName,
          'maBanKhai': vm.maBanKhai,
          'callSign': vm.callSign,
          'page': 1
        }
      })
      if (vm.document_type_code === '0') {
        vm.doCounterHoSo()
      }
      if (vm.type === 'ke_hoach') {
        vm.doKeHoachFilterCount()
      } else if (vm.type === 'thu_tuc') {
        vm.doThuTucFilterCount()
      }
    },
    changeDocumentFilter: function (data) {
      this.shipName = ''
      this.maBanKhai = ''
      this.callSign = ''
      router.push('/danh-sach-ho-so/' + this.type + '/' + data.code + '/0')
    },
    doCounterHoSo () {
      let vm = this
      axios.get(vm.count_ho_so_api, {
        params: {
          'shipName': vm.shipName !== '' ? encodeURIComponent(vm.shipName) : '',
          'maBanKhai': vm.maBanKhai,
          'callSign': vm.callSign,
          'isDTND': vm.initDataFilter.user.isDTND,
          'isDTNDCam': vm.initDataFilter.user.isDTNDCam
        }
      }).then(function (response) {
        var serializable = response.data
        for (var key in serializable) {
          var idCounter = 'tt_count_' + serializable[key]['code']
          var idCounterEl = document.getElementById(idCounter)
          if (idCounterEl != null) {
            idCounterEl.innerHTML = serializable[key]['total']
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    fillCounterToMenu (rootIndex, childIndex, counter) {
      if (this.type === 'thu_tuc') {
        rootIndex = 1
      }
      let filteredArray = this.role_filter_status.filter(function (item) {
        return item.index === rootIndex
      })
      filteredArray[0].items[childIndex].counter = counter
    },
    doKeHoachFilterCount () {
      let vm = this
      let childIndex = 0
      for (let key in vm.role_filter_status) {
        if (vm.role_filter_status[key].id_active === 'ke_hoach') {
          let items = vm.role_filter_status[key].items
          for (let keyItem in items) {
            axios.get(vm.counter_ho_so_ke_hoach_table, {
              params: {
                'documentTypeCode': vm.document_type_code,
                'requestState': items[keyItem]['code'],
                'rootIndex': 0,
                'childIndex': childIndex,
                'shipName': vm.shipName !== '' ? encodeURIComponent(vm.shipName) : '',
                'documentName': vm.maBanKhai,
                'callSign': vm.callSign,
                'isDTND': vm.initDataFilter.user.isDTND,
                'isDTNDCam': vm.initDataFilter.user.isDTNDCam
              }
            }).then(function (response) {
              let serializable = response.data
              vm.fillCounterToMenu(serializable.rootIndex, serializable.childIndex, serializable.total)
            }).catch(function (error) {
              console.log(error)
            })
            childIndex = childIndex + 1
          }
        }
      }
    },
    doThuTucFilterCount () {
      let vm = this
      let childIndex = 0
      for (let key in vm.role_filter_status) {
        if (vm.role_filter_status[key].id_active === 'thu_tuc') {
          let items = vm.role_filter_status[key].items
          for (let keyItem in items) {
            axios.get(vm.counter_ho_so_thu_tuc_table, {
              params: {
                'documentTypeCode': vm.document_type_code,
                'documentStatusCode': items[keyItem]['code'],
                'rootIndex': 0,
                'childIndex': childIndex,
                'shipName': vm.shipName !== '' ? encodeURIComponent(vm.shipName) : '',
                'maBanKhai': vm.maBanKhai,
                'callSign': vm.callSign,
                'isDTND': vm.initDataFilter.user.isDTND,
                'isDTNDCam': vm.initDataFilter.user.isDTNDCam
              }
            }).then(function (response) {
              let serializable = response.data
              vm.fillCounterToMenu(serializable.rootIndex, serializable.childIndex, serializable.total)
            }).catch(function (error) {
              console.log(error)
            })
            childIndex = childIndex + 1
          }
        }
      }
    }
  }
}
</script>
