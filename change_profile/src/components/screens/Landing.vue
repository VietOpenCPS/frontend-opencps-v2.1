<template>
  <div>
    <!-- content-right -->
    <v-layout wrap>
      <v-flex class="xs3 sm3 px-3" v-for="(item, index) in employees" v-bind:key="index">
        <v-card style="border-radius: 4px;-webkit-box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;">
          <v-card-text class="mt-2" style="width: 395px;padding: 0;margin: 0 auto;">
            <attached-file-avatar :pk="item['employeeId']" :pick-item="itemOptions" :type="'image'"></attached-file-avatar>
            <h2 class="text-xs-center">{{item['fullName']}}</h2>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import AttachedFileAvatar from '../ext/AttachedFileAvatar.vue'
  import TinyPagination from './Pagination.vue'
  import toastr from 'toastr'
  Vue.use(toastr)
  toastr.options = {
    'closeButton': true,
    'timeOut': '3000'
  }
  export default {
    components: {
      AttachedFileAvatar,
      'tiny-pagination': TinyPagination
    },
    data: () => ({
      employees: '',
      zaloOaId: '',
      zaloOaid_token_access: '',
      userAppZaloUid: '',
      isFollowZalo: false,
      titleDialogPdf: '',
      dialogPDF: false,
      dialogPDFLoading: false,
      changePassWordFail: false,
      snackbarsuccess: false,
      oldPassWord: '',
      newPassWord: '',
      newPassWordConfirm: '',
      state: 0,
      stateLabel: 'Đổi mật khẩu',
      valid: false,
      loading: false,
      user: {},
      menuBirthDate: false,
      toDateFormatted: null,
      ngayCap: null,
      toggle_exclusive: 0,
      cityItems: [],
      districtItems: [],
      wardItems: [],
      fileList: [],
      totalFileList: 0,
      filePage: 1,
      itemOptions: {
        "model": "classPK",
        'upload_api': '/o/v1/opencps/users/upload/opencps_employee/org.opencps.usermgt.model.Employee',
        'remove_api': '',
        'class_name': 'org.opencps.usermgt.model.EmployeeAvatar'
      }
    }),
    watch: {
    },
    created() {
      var vm = this
      vm.$nextTick(function() {
        let current = vm.$router.history.current
        let currentQuery = current.query
        let filter = {
        }
        vm.$store.dispatch('loadEmployeesMotcua', filter).then(result => {
          vm.employees = result
        }).catch(xhr => {
        })
      })
    },
    computed: {
    },
    methods: {
      formatDate(date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate(date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      changeBirthDate () {
        let vm = this
        vm.menuBirthDate = false
        vm.user['employeeBirthDate'] = vm.formatDate(vm.ngayCap)
      },
      onChangeCity (data) {
        var vm = this
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: data
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.districtItems = result.data
          vm.wardItems = []
        })
      },
      onChangeDistrict (data) {
        var vm = this
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: data
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.wardItems = result.data
        })
      },
      submitUserProfile () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loading = true
          vm.$store.dispatch('putUser', vm.user).then(function () {
            vm.loading = false
            toastr.clear()
            toastr.success('Yêu cầu thực hiện thành công')
          }).catch(function () {
            vm.loading = false
            toastr.clear()
            toastr.error('Yêu cầu thực hiện thất bại')
          })
        }
      },
      showChangePass () {
        let vm = this
        if (vm.state === 0) {
          vm.state = 1
          vm.stateLabel = 'Thông tin tài khoản'
        } else {
          vm.state = 0
          vm.stateLabel = 'Đổi mật khẩu'
        }
      },
      doChangePassWord () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loading = true
          let data = {
            oldPassword : vm.oldPassWord,
            newPassword : vm.newPassWord
          }
          vm.changePassWordFail = false
          vm.$store.dispatch('changePass', data).then(function (data) {
            vm.loading = false
            if (String(data) === 'false') {
              vm.changePassWordFail = true
            } else {
              vm.snackbarsuccess = true
              vm.state = 1
            }
          }).catch(function () {
            vm.loading = false
          })
        }
      },
      parseDateInput (dateInput) {
        if (dateInput) {
          let date = ''
          if (isNaN(dateInput)) {
            date = new Date(dateInput)
          } else {
            date = new Date(Number(dateInput))
          }
          let dateFormated = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
          return dateFormated
        }
      },
      getMaxdate () {
        let date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      },
      itemCodeNumber (code) {
        if (code && code.indexOf('0') !== 0) {
          return Number(code)
        } else {
          return ''
        }
      },
      viewFile (file) {
        var vm = this
        vm.titleDialogPdf = file.eForm ? 'Giấy tờ khai trực tuyến' : 'Giấy tờ đính kèm'
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        document.getElementById('dialogPDFPreview').src = ''
        vm.$store.dispatch('viewFile', file).then(result => {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      },
      downloadFile (file) {
        let vm = this
        vm.$store.dispatch('downloadFile', file)
      },
      deleteFileApplicant (file) {
        let vm = this
        let x = confirm('Bạn có chắc chắn xóa giấy tờ này?')
        if (x) {
          vm.$store.dispatch('deleteFileApplicant', file).then(function (result) {
            toastr.success('Xóa giấy tờ thành công')
            let current = vm.$router.history.current
            let newQuery = current.query
            let filter = {
              applicantIdNo: vm.user['applicantIdNo'],
              page: newQuery.hasOwnProperty('page') && newQuery.page ? newQuery.page : 1
            }
            vm.$store.dispatch('getDossierFilesApplicants', filter).then(function(result) {
              vm.fileList = result.data
              vm.totalFileList = result.total
              vm.filePage = currentQuery.hasOwnProperty('page') && currentQuery.page ? currentQuery.page : 1
            })
          }).catch(function(reject) {
            toastr.error('Xóa giấy tờ không thành công')
          })
        }
      },
      getServerConfig () {
        let vm = this
        let filter = {
          serverNo: 'ZALO'
        }
        vm.$store.dispatch('getServerConfig', filter).then(function (result) {
          try {
            let zaloOAInfo = JSON.parse(result.configs)
            vm.zaloOaId = zaloOAInfo['oaid']
            vm.zaloOaid_token_access = zaloOAInfo['oaid_token_access']
            console.log('zalo_info', vm.zaloOaId, vm.zaloOaid_token_access)
            vm.getUserAppZaloInfo()
          } catch (error) {
          }
        })
      },
      getUserAppZaloInfo () {
        let vm = this
        let url = '/o/rest/v2/users/' + vm.user['userId'] + '/preferences/ZALO_UID'
        let config = {
          headers: {
            'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(url, config).then(function (response) {
          if (response.data && response.data.uid) {
            vm.userAppZaloUid = response.data.uid
            vm.getZaloIsFollowing(vm.userAppZaloUid)
          } else {
            vm.isFollowZalo = false
          }
        }).catch(function (error) {
          vm.getZaloIsFollowing(vm.userAppZaloUid)
        })
      },
      getZaloIsFollowing (uid) {
        let vm = this
        let zaloOaToken = vm.zaloOaid_token_access
        let url = 'https://cors-anywhere.herokuapp.com/https://openapi.zalo.me/v2.0/oa/getprofile?access_token=' + zaloOaToken + '&data={"user_id":"' + uid + '"}'
        // window.axios.get(url).then(function (response) {
        //   console.log(response.data)
        //   if (response.data && response.data['user_id']) {
        //     vm.isFollowZalo = true
        //   }
        //   // vm.zaloOaId = response.data.message !== 'Success' ? vm.MSystemConfiguration.configuration.zalo.oaid : ''
        // }).catch(function (error) {
        //   console.log(error)
        // })
        // 
        $.ajax({
          url: url,
          method: 'GET',
          success: function(data){
            console.log(data)
            if (data['user_id']) {
              vm.isFollowZalo = true
            }
          }
        })
      },
      callbackzalo (responeFromZalo) {
        let vm = this
        let url = '/o/rest/v2/users/' + vm.user['userId'] + '/preferences/ZALO_UID'
        const config = {
          headers: {
            'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        let params = new URLSearchParams()
        params.append('value', '{"uid":"' + responeFromZalo.userId + '"}')
        window.axios.put(url, params, config).then(function (response) {
        }).catch(function (error) {
        })
      },
      paggingData (config) {
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
      }
    }
  }
</script>