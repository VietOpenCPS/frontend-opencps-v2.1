<template>
  <div style="padding: 0px 25px; max-width: 1500px; margin: 0px auto" class="mt-5 pb-3" id="top-header">
    <v-card class="px-3 py-3" style="width: 100%; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
      <div class="headline mb-3" style="font-size: 20px!important;">DANH MỤC LOẠI GIẤY TỜ, TÀI LIỆU</div>
      <v-btn color="#0072bc" small class="mx-0 white--text" @click.stop="showTimKiem" style="position: absolute; right: 17px; top: 15px;">
        <v-icon size="20">
          filter_alt
        </v-icon> &nbsp;
        Lọc danh sách
      </v-btn>
      <v-card-text class="px-0 pb-0" v-if="showAdvanceSearch">
        <tim-kiem ref="timkiem" form="danhmuc" v-on:trigger-search="searchGiayToSoHoa" v-on:trigger-cancel="cancelSearchGiayToSoHoa"></tim-kiem>
      </v-card-text>
      <v-btn color="#0072bc" small class="mx-0 white--text" @click.stop="showCreatedocument">
        <v-icon size="20">
          post_add
        </v-icon> &nbsp;
        Thêm mới loại giấy tờ
      </v-btn>
      <v-data-table
        :headers="documentListHeader"
        :items="documentApplicantList"
        hide-actions
        class="table-landing table-bordered mt-2"
        style="border-left: 1px solid #dedede"
      >
        <v-progress-linear v-if="loadingTable" slot='progress' color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
            <td class="text-xs-center py-2" style="width:50px;height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{ documentPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px; min-width:450px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('name') ? props.item.name : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('fileTemplateNo') ? props.item.fileTemplateNo : ''}}</span>
              </div>
            </td>
            <td class="text-center py-2" style="height:36px;width: 120px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-tooltip top v-if="!loadingTable">
                <v-btn @click="deleteDocument(props.item)" color="red" slot="activator" flat icon class="mx-0 my-0 mr-2">
                  <v-icon size="22">delete</v-icon>
                </v-btn>
                <span>Xóa</span>
              </v-tooltip>
              <v-tooltip top v-if="!loadingTable" class="mr-2">
                <v-btn @click="showEditDocument(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                  <v-icon size="22">edit</v-icon>
                </v-btn>
                <span>Cập nhật</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center mt-2">
            Không có loại giấy tờ nào
          </div>
        </template>
      </v-data-table>

      <div class="my-2" v-if="totalDocument > numberPerPage">
        <div class="text-xs-right layout wrap" style="position: relative;">
          <div class="flex pagging-table"> 
            <pagination :total="totalDocument" :page="documentPage" :numberPerPage="numberPerPage" nameRecord="giấy tờ" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></pagination> 
          </div>
        </div>
      </div>
    </v-card>
    <v-dialog v-model="dialog_editDocument" scrollable persistent max-width="900px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <span v-if="typeCreate === 'create'">THÊM MỚI LOẠI GIẤY TỜ</span>
            <span v-else>CẬP NHẬT LOẠI GIẤY TỜ</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_editDocument = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-form ref="form" v-model="valid" lazy-validation class="py-3 px-0 grid-list">
            <v-layout row wrap class="px-0 py-3">
              <v-flex class="px-0">
                <v-text-field
                  label="Mã giấy tờ"
                  v-model="fileTemplateNoCreate"
                  box
                  clearable
                  :rules="[v => !!v || 'Mã giấy tờ là bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-0">
                <v-text-field
                  label="Tên loại giấy tờ"
                  v-model="nameCreate"
                  box
                  clearable
                  :rules="[v => !!v || 'Tên loại giấy tờ là bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex class="text-right">
              <v-btn class="mr-2 white--text" color="red" :disabled="loadingAction" @click.native="dialog_editDocument = false">
                <v-icon>clear</v-icon> &nbsp;
                Thoát
              </v-btn>
              <v-btn v-if="typeCreate === 'create'" :disabled="loadingAction" class="mr-0" color="primary" @click.native="createDocument">
                <v-icon>save</v-icon> &nbsp;
                <span>Thêm mới</span> 
              </v-btn>
              <v-btn v-else :disabled="loadingAction" class="mr-0" color="primary" @click.native="updateDocument">
                <v-icon>save</v-icon> &nbsp;
                <span>Cập nhật</span> 
              </v-btn>
            </v-flex>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  import Pagination from './Pagination.vue'
  import Search from './FormTimKiem.vue'
  Vue.use(toastr)

  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    components: {
      'tim-kiem': Search,
      'pagination': Pagination
    },
    data: () => ({
      valid: false,
      showDetail: false,
      dialog_editDocument: false,
      fileTemplateList: [],
      statusCreate: '',
      nameCreate: '',
      fileTemplateNoCreate: '',
      fileName: '',
      fileNo: '',
      fileUpdate: '',
      fileNameUpdate: '',
      documentSelect: '',
      loadingAction: false,
      showAdvanceSearch: false,
      dataInputSearch: '',
      loadingTable: false,
      documentApplicantList: [],
      totalDocument: 0,
      documentPage: 1,
      numberPerPage: 15,
      dialogViewFileSign: false,
      pathNameFileESign: '',
      dialogPDF: false,
      isDvc: false,
      maxFileSize: 100,
      typeCreate: 'create',
      fileNameView: '',
      srcDownload: '',
      fileEntryESign: '',
      pathNameFileESign: '',
      hasEsign: false,
      statusList: [
        {text: 'Yêu cầu số hóa', value: 0},
        {text: 'Có hiệu lực', value: 1},
        {text: 'Hết hiệu lực', value: 2},
        {text: 'Hủy', value: 3}
      ],
      documentListHeader: [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Mã giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Thao tác',
          align: 'center',
          sortable: false
        }
      ],
    }),
    computed: {
    },
    beforeDestroy () {
    },
    mounted () {
     let vm = this
    },
    beforeCreate() {
    },
    created () {
      let vm = this
      vm.getDanhSachGiayToSoHoa()
    },
    watch: {
    },
    methods: {
      showCreatedocument () {
        let vm = this
        vm.dialog_editDocument = true
        vm.typeCreate = 'create'
        vm.fileTemplateNoCreate = ''
        vm.nameCreate = ''
        vm.$refs.form.reset()
        vm.$refs.form.resetValidation()
      },
      showEditDocument (item) {
        let vm = this
        $('html, body').animate({
            scrollTop: $('#top-header').offset().top,
          },
          100,
          'linear'
        )
        vm.documentSelect = item
        vm.typeCreate = 'update'
        vm.fileTemplateNoCreate = item.fileTemplateNo
        vm.nameCreate = item.name
        vm.dialog_editDocument = true
      },
      deleteDocument (item) {
        let vm = this
        let x = confirm('Bạn có chắc chắn xóa loại giấy tờ này?')
        if (x) {
          let param = {
            headers: {
              groupId: 0,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          let url = '/o/rest/v2/fileitems/' + item.fileItemId
          axios.delete(url, param).then(result1 => {
            vm.loadingAction = false
            toastr.success('Xóa thành công')
            setTimeout(function () {
              vm.getDanhSachGiayToSoHoa()
            }, 200)
          }).catch(xhr => {
            vm.loadingAction = false
          })
        }
      },
      createDocument () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loadingAction = true
          let param = {
            headers: {
              groupId: 0,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        
          let dataCreateFile = new URLSearchParams()
          let url = '/o/rest/v2/fileitems'
          dataCreateFile.append('fileTemplateNo', vm.fileTemplateNoCreate)
          dataCreateFile.append('status', 1)
          dataCreateFile.append('name', vm.nameCreate)
          
          axios.post(url, dataCreateFile, param).then(result1 => {
            vm.loadingAction = false
            toastr.success('Thêm mới loại giấy tờ thành công')
            vm.dialog_editDocument = false
            setTimeout(function () {
              vm.getDanhSachGiayToSoHoa()
            }, 200)
          }).catch(xhr => {
            vm.loadingAction = false
            toastr.error('Thêm mới thất bại. Vui lòng thử lại.')
          })
        }
      },
      updateDocument () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loadingAction = true
          let param = {
            headers: {
              groupId: 0,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        
          let dataCreateFile = new URLSearchParams()
          let url = '/o/rest/v2/fileitems/' + vm.documentSelect.fileItemId
          dataCreateFile.append('fileTemplateNo', vm.fileTemplateNoCreate)
          dataCreateFile.append('status', 1)
          dataCreateFile.append('name', vm.nameCreate)
          
          axios.put(url, dataCreateFile, param).then(result1 => {
            vm.loadingAction = false
            toastr.success('Cập nhật thành công')
            vm.dialog_editDocument = false
            setTimeout(function () {
              vm.getDanhSachGiayToSoHoa()
            }, 200)
          }).catch(xhr => {
            vm.loadingAction = false
            toastr.error('Cập nhật thất bại. Vui lòng thử lại.')
          })
        }
      },
      showTimKiem () {
        this.showAdvanceSearch = true
      },
      uploadFile () {
        let vm = this
        vm.hasEsign = false
        document.getElementById('documentFile').value = ''
        document.getElementById('documentFile').click()
      },
      getDanhSachGiayToSoHoa (dataSearch) {
        let vm = this
        let filter = {
          start: vm.documentPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.documentPage * vm.numberPerPage,
          name: dataSearch ? dataSearch.name : '',
          fileTemplateNo: dataSearch ? dataSearch.fileTemplateNo : '',
          status: 1
        }
        vm.loadingTable = true
        vm.$store.dispatch('getFileItems', filter).then(function (result) {
          if (result.hasOwnProperty('data')) {
            vm.documentApplicantList = Array.isArray(result.data) ? result.data : [result.data]
          } else {
            vm.documentApplicantList = []
          }
          vm.totalDocument = result['total']
          vm.loadingTable = false
        }).catch(function () {
          vm.loadingTable = false
          vm.documentApplicantList = []
          vm.totalDocument = 0
        })
      },
      searchGiayToSoHoa (data) {
        let vm = this
        console.log('dataInputSearch', data)
        vm.dataInputSearch = data
        vm.documentPage = 1
        vm.totalDocument = 0
        vm.getDanhSachGiayToSoHoa(data)
      },
      cancelSearchGiayToSoHoa (data) {
        let vm = this
        console.log('dataInputSearch2', data)
        vm.showAdvanceSearch = false
        vm.dataInputSearch = data
        vm.documentPage = 1
        vm.totalDocument = 0
        vm.getDanhSachGiayToSoHoa(data)
      },
      changePage (config) {
        let vm = this
        vm.documentPage = config.page
        vm.getDanhSachGiayToSoHoa(vm.dataInputSearch)
      },
    }
  }
</script>

