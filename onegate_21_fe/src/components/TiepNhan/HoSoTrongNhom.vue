<template>
  <div>
    <div class="mb-3" v-if="dossiersgroup.length > 0">
      <!-- <v-layout wrap class="my-2">
        <v-flex style="width: 120px">
          <v-subheader class="pl-0 text-header">Bước xử lý: </v-subheader>
        </v-flex>
        <v-flex class="pr-3" style="width: calc(100% - 120px)">
          <v-select
          :items="stepList"
          item-text="stepName"
          item-value="stepCode"
          v-model="stepSelected"
          @change="changeStep"
          return-object
          clearable
          >
          </v-select>
        </v-flex>
      </v-layout> -->
      <v-data-table
        v-model="selectedAttach"
        select-all
        :headers="headers"
        :items="dossiersgroup"
        :pagination.sync="pagination"
        hide-actions
        class="table-landing table-bordered"
        item-key="dossierId"
      >
        <!--  -->
        <template slot="headers" slot-scope="props">
          <tr>
            <th width="32px" class="v_data_table_check_all" style="padding-left: 14px !important;">
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.native="toggleAllSelectDialog"
              ></v-checkbox>
            </th>
            <th
              v-for="header in headers"
              :key="header.text"
              :class="header['class'] ? header['class'] : ''"
              :width="header['width'] ? header['width'] + 'px' : ''"
            >
              <v-tooltip bottom>
                <span slot="activator">{{ header.text }}</span>
                <span>{{ header.text }}</span>
              </v-tooltip>
            </th>
          </tr>
        </template>
        <!--  -->
        <template slot="items" slot-scope="props">
          <tr style="cursor: pointer">
            <td class="text-xs-center pl-3" width="32px" style="height: 40px !important">
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td @click="viewDetail(props.item, props.index)" class="text-xs-center" width="50px" style="height: 40px !important">
              <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span>
            </td>
            <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="250px" style="height: 40px !important">
              {{ props.item.dossierNo }}
            </td>
            <td @click="viewDetail(props.item, props.index)" class="text-xs-left" style="height: 40px !important">
              {{ props.item.applicantName }}
            </td>
            <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="200px" style="height: 40px !important">
              {{ props.item.dossierSubStatusText ? props.item.dossierSubStatusText : props.item.dossierStatusText }}
            </td>
          </tr>
        </template>
      </v-data-table>

      <div v-if="dossiersgroup.length > 10" class="text-xs-center layout wrap mt-2 pr-1" style="position: relative;">
        <div class="flex pagging-table px-2">
          <tiny-pagination :total="dossiersgroup.length" :currentLimit="15" :page="pagination.page" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import toastr from 'toastr'
import $ from 'jquery'
import TinyPagination from '../pagging/opencps_pagination'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index', 'id', 'dossiersgroup'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    detailGroup: false,
    dialogImportDosier: false,
    dialogSelectDosier: false,
    groupDossierList: [],
    groupDossierSelected: '',
    dossiersgroup: [],
    dossiersgroup: [],
    selected: [],
    selectedAttach: [],
    stepList: [],
    stepSelected: '',
    btnDynamics: [],
    processOptionSelected: '',
    inputTypes: [6],
    outputTypesGroup: [7],
    inputTypesIntoGroup: [1, 3, 6],
    outputTypes: [2],
    loadingAction: false,
    dialogAddGroup: false,
    activeAddDossierIntoGroup: false,
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Tên chủ hồ sơ',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      }
    ],
    filesGroupDossier: [],
    progressUploadFile: false,
    totalDossier: 0,
    valueProgress: 0,
    countDossierSuccess: 0,
    pagination: {
      rowsPerPage: 15,
      page: 1
    }
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    filesAdd () {
      return this.$store.getters.getFilesAdd
    },
    activeAddFileGroup () {
      return this.$store.getters.activeAddFileGroup
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
    })
  },
  mounted () {
    let vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
    },
    selectedAttach (val) {
      let vm = this
      vm.$store.commit('setSelectDossierGroup', val)
    },
    selected (val) {
      let vm = this
      // vm.$store.commit('setSelectDossierGroup', val)
    },
    activeAddFileGroup (val) {
      let vm = this
      console.log('val activeAddFileGroup', val)
      vm.stepSelected = ''
      vm.dialogSelectDosier = val
    }
  },
  methods: {
    paggingData (config) {
      let vm = this
      vm.pagination.page = config.page
    },
    changeStep () {
      let vm = this
      setTimeout(function () {
        if (vm.stepSelected) {
          vm.dossiersgroup = vm.dossiersgroup.filter(function(item) {
            return String(item['stepCode']) === String(vm.stepSelected['stepCode'])
          })
          vm.$store.dispatch('pullProcessSteps', vm.stepSelected).then(function (result) {
            if (result.hasOwnProperty('menuGroup') && result.menuGroup) {
              vm.$store.dispatch('getDetailMenuConfig', result).then(function (result2) {
                if (result2.hasOwnProperty('buttonConfig') && result2.buttonConfig) {
                  try {
                    vm.btnDynamics = JSON.parse(result2['buttonConfig'])['buttons']
                    vm.btnDynamics = vm.btnDynamics.filter(function(item) {
                      return item['form'] === 'ACTIONS'
                    })
                    vm.btnDynamics = vm.btnDynamics.filter(function(item) {
                      return (!item.hasOwnProperty('onlySteps') ||
                        (item.hasOwnProperty('onlySteps') && item['onlySteps'].filter(function(item2) {
                          return String(item2) === String(vm.stepSelected['stepCode']) 
                        }) > 0)
                      )
                    })
                  } catch (error) {
                    vm.btnDynamics = []
                  }
                } else {
                  vm.btnDynamics = []
                }
              })
            } else {
              vm.btnDynamics = []
            }
          })
        } else {
          vm.dossiersgroup = vm.dossiersgroup
          vm.btnDynamics = []
        }
      }, 200)
    },
    viewDetail (item, indexItem) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.$router.push('/danh-sach-ho-so/0/chi-tiet-ho-so/' + item['dossierId'])
    },
    addFileToDossier () {
      let vm = this
      // add file cho thành phần hồ sơ con
      let dossierIds = vm.selectedAttach.map(obj =>{
        return obj.dossierId
      }).toString()
      let dossierFileIds = vm.filesAdd.map(obj =>{
        return obj.dossierFileId
      }).toString()
      let filterCopyFile = {
        dossierIds: dossierIds,
        dossierFileId: dossierFileIds
      }
      // for (let index in vm.filesAdd) {
      //   filterCopyFile.dossierFileId = vm.filesAdd[index]['dossierFileId']
        vm.$store.dispatch('uploadFileDossierGroup', filterCopyFile).then(function (result) {
          toastr.success('Đính kèm tài liệu thành công')
          vm.$store.commit('setActiveAddFileGroup', false)
        })
      // }
    },
    cancelAddFile () {
      let vm = this
      vm.$store.commit('setActiveAddFileGroup', false)
    },
    toggleAll () {
      var vm = this
      if (vm.selected.length) {
        vm.selected = []
      } else {
        vm.selected = vm.dossiersgroup
      }
    },
    toggleAllSelectDialog () {
      var vm = this
      console.log('toggleAllSelectDialog', vm.dossiersgroup, vm.selectedAttach)
      if (vm.selectedAttach.length) {
        vm.selectedAttach = []
      } else {
        vm.selectedAttach = vm.dossiersgroup
      }
      console.log('toggleAllSelectDialog 2', vm.selectedAttach)
    },
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (vm.activeAddDossierIntoGroup) {
        vm.activeAddDossierIntoGroup = false
        vm.getDetaiGroup(vm.id)
      } else {
        vm.$router.push({
          path: '/danh-sach-ho-so/' + currentParams.index,
          query: currentQuery
        })
      }
    }
  }
}
</script>
