<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      ">opencps_certnumbers</a>
    </v-breadcrumbs>

    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{activeCertNumberDetail ? currentCertNumber.pattern : 'Danh sách tham số hệ thống'}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <!-- Danh sách tham số -->
        <v-card v-if="!activeCertNumberDetail" class="py-2" style="margin-bottom:40px">
          <v-btn color="blue darken-3" dark
            class="mb-3 mx-0"
            @click="createCertNumbers"
          >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm tham số hệ thống
          </v-btn>
          <v-data-table
            :headers="headerCertNumber"
            :items="certNumberList"
            hide-actions
            class="elevation-1 table-bordered"
            style="border: 1px solid #dedede"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-center" width="10%">
                <div>
                  <span>{{pageCertNumber * 10 - 10 + props.index + 1}}</span>
                </div>
              </td>
              <td class="text-xs-left" width="35%">{{ props.item.certId }}</td>
              <td class="text-xs-left" width="20%">{{ props.item.pattern }}</td>
              <td class="text-xs-left" width="10%">{{ props.item.initNumber }}</td>
              <td class="text-xs-center px-0" width="15%">
                <v-icon
                  small color="blue"
                  class="mr-3"
                  @click="editCertNumber(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  small color="red"
                  @click="deleteCertNumber(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>
            <template slot="no-data">
            </template>
          </v-data-table>
          <v-flex xs12 class="text-right" style="
            position: fixed;
            bottom: 0;
            width: -webkit-calc( 100% - 300px );
            width: calc( 100% - 300px );
            background: white;
            z-index: 2;
          ">
            <div class="text-xs-right layout wrap mt-2 pr-2" style="position: relative;">
              <v-flex xs12>
                <tiny-pagination :total="pageTotalCertNumber" :page="pageCertNumber" @tiny:change-page="paggingCertData" custom-class="custom-tiny-class"></tiny-pagination> 
              </v-flex>
            </div>
          </v-flex>
        </v-card>
        <!-- form chi tiet -->
        <v-form v-else ref="formAddCertNumber" v-model="validAddCertNumber" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm12 v-if="id !== 0 && id !== '0'">
              <v-text-field
                v-model="currentCertNumber.certId"
                box
                readonly
                label="Tên tham số"
              >
              </v-text-field>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm12>
              <v-text-field
                v-model="currentCertNumber.pattern"
                box
                :rules="[rules.required]"
                required
              >
                <template slot="label">Pattern <span class="red--text darken-3">*</span></template>
              </v-text-field>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm12>
              <v-text-field
                v-model="currentCertNumber.initNumber"
                box
                type="number"
                :rules="[rules.required]"
                required
              >
                <template slot="label">Số khởi tạo <span class="red--text darken-3">*</span></template>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-flex xs12 class="text-right pr-3" style="
            position: fixed;
            bottom: 0;
            width: -webkit-calc( 100% - 300px );
            width: calc( 100% - 300px );
            background: white;
            z-index: 2;
          ">
            <v-btn color="blue darken-3" dark
              v-if="id === 0 || id === '0'"
              :loading="loading"
              :disabled="loading"
              @click="updateCertNumber('add')"
            >
              <v-icon>add_circle_outline</v-icon>&nbsp;
              Thêm mới
            </v-btn>
            <v-btn color="blue darken-3" dark
              v-else
              :loading="loading"
              :disabled="loading"
              @click="updateCertNumber('update')"
            >
              <v-icon>save</v-icon>&nbsp;
              Cập nhật
            </v-btn>
            <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
          </v-flex>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
  import TinyPagination from '../ext/TinyPagination.vue'
  export default {
    components: {
      'tiny-pagination': TinyPagination
    },
    data () {
      return {
        breadCrumbsitems: [
          {
            text: 'Bảng dữ liệu',
            disabled: false
          },
          {
            text: '',
            disabled: false
          }
        ],
        id: '',
        activeCertNumberDetail: false,
        headerCertNumber: [
          {
            text: 'STT',
            align: 'center',
            sortable: false
          },
          {
            text: 'Tên tham số',
            align: 'center',
            sortable: false
          },
          {
            text: 'Pattern',
            align: 'center',
            sortable: false
          },
          {
            text: 'Số khởi tạo',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thao tác',
            align: 'center',
            sortable: false
          }
        ],
        pageTotalCertNumber: 0,
        pageCertNumber: 1,
        certNumberList: [],
        currentCertNumber: {
          certId: '',
          pattern: '',
          initNumber: ''
        },
        validAddCertNumber: false,
        loading: false,
        rules: {
          required: (value) => (!!value || value === 0) || 'Trường dữ liệu bắt buộc'
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let currentQuery = vm.$router.history.current.query
        vm.activeCertNumberDetail = currentQuery.hasOwnProperty('id') && currentQuery.id !== ''
        if (vm.activeCertNumberDetail) {
          vm.id = currentQuery.id
          if (vm.id !== 0 && vm.id !== '0') {
            vm.getCertNumberDetail()
          } else {
            vm.currentCertNumber = {
              certId: '',
              pattern: '',
              initNumber: ''
            }
          }
        } else {
          vm.getCertNumberList()
        }
      })
    },
    computed: {
    },
    watch: {
      '$route': function (newRoute) {
        let vm = this
        let currentQuery = newRoute.query
        vm.activeCertNumberDetail = currentQuery.hasOwnProperty('id') && currentQuery.id !== ''
        if (vm.activeCertNumberDetail) {
          vm.id = currentQuery.id
          if (vm.id !== 0 && vm.id !== '0') {
            vm.getCertNumberDetail()
          } else {
            vm.currentCertNumber = {
              certId: '',
              pattern: '',
              initNumber: ''
            }
          }
        } else {
          vm.getCertNumberList()
        }
      }
    },
    methods: {
      createCertNumbers () {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?id=0',
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      getCertNumberList () {
        let vm = this
        let currentQuery = vm.$router.history.current.query
        let filter = {
          page: currentQuery.page ? currentQuery.page : 1
        }
        vm.pageCertNumber = currentQuery.page ? Number(currentQuery.page) : 1
        vm.pageTotalCertNumber = 0
        vm.$store.dispatch('getCertNumberList', filter).then(function (result) {
          vm.pageTotalCertNumber = result.total
          vm.certNumberList = result.data
        }).catch(reject => {
          console.log(reject)
        })
      },
      getCertNumberDetail () {
        let vm = this
        let filter = {
          certId: vm.id
        }
        vm.$store.dispatch('getCertNumberDetail', filter).then(function (result) {
          vm.currentCertNumber = result
        }).catch(reject => {
          console.log(reject)
        })
      },
      paggingCertData (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'page=' + config.page
        vm.$router.push({
          path: current.path + queryString
        })
      },
      editCertNumber (item) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push({
          path: currentPath + '?id=' + item.certId,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      deleteCertNumber (item) {
        let x = confirm('Xác nhận xóa dữ liệu')
        if (x) {
          var vm = this
          let filter = {
            certId: item.certId
          }
          vm.$store.dispatch('deleteCertNumber', filter).then(function () {
            setTimeout (function () {
              vm.getCertNumberList()
            }, 300)
          }).catch(reject => {
            console.log(reject)
          })
        }
      },
      updateCertNumber (type) {
        var vm = this
        let currentPath = vm.$router.history.current.path
        if (vm.$refs.formAddCertNumber.validate()) {
          vm.currentCertNumber['type'] = type
          vm.loading = true
          vm.$store.dispatch('updateCertNumber', vm.currentCertNumber).then(function (result) {
            vm.loading = false
            if (type === 'add') {
              vm.$router.push({
                path: currentPath.replace(0, result.certId),
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            } else {
              vm.currentCertNumber = result
            }
          }).catch(reject => {
            vm.loading = false
            console.log(reject)
          })
        }
      },
      backToList () {
        window.history.back()
      }
    },
    filters: {
    }
  }
</script>
