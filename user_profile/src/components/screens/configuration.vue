<template>
  <div class="mobilink-all-component layout">
    <v-layout wrap>
      <mbl-expand-panel
        :ownExpanded= "ownExpanded"
        :showheader=false
      >
        <template slot="title-name">
          Cấu hình cá nhân
        </template>
        <template slot="card-text-container">
          <v-layout wrap class="layout-btn-zalo">
            <div class="zalo-btn-follow-wrapper"
              v-if="zaloOaId"
            >
              <div class="zalo-follow-only-button"
                :data-oaid="zaloOaId"
                data-callback="callbackzalofollow"
              ></div>
            </div>
            <div id="profile-info-detail-wraper">
              <div class="box-panel">
                
                <div id="profile-check-noti-detail"></div>
                <button type="button" class="profile-check-noti-detail-submit btn btn-primary btn-default ML10">
                  Lưu lại
                </button>
              </div>
            </div>
          </v-layout>
        </template>
      </mbl-expand-panel>
    </v-layout>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'configuration'
  export default {
    name: COMPONENT_NAME,
    props: {
    },
    components: {},
    watch: {
    },
    computed: {
      personalInformation: function () { return this.$store.state.personalInformation }
    },
    data () {
      return {
        ownExpanded: true,
        zaloOaId: ''
      }
    },
    created () {
      this.$nextTick(function () {
        window.callbackzalofollow = this.callbackzalofollow
        this.zaloOaId = this.MSystemConfiguration.configuration.zalo.oaid || '402033447373752096333'
        this.getZaloInfo()
      })
    },
    methods: {
      async getZaloInfo () {
        let vm = this
        let url = vm.end_point + 'users/' + vm.user_id + '/preferences/ZALO_UID'
        let config = {
          headers: {
            'groupId': vm.group_id
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(url, config)
          .then(function (response) {
            console.log(response.data.uid)
            if (response.data && response.data.uid) {
              vm.getZaloIsFollowing(response.data.uid)
            }
          })
          .catch(function (error) {
            vm.getZaloIsFollowing('1893010867233038754')
            console.log(error)
          })
      },
      async getZaloIsFollowing (uid) {
        let vm = this
        let zaloOaToken = this.MSystemConfiguration.configuration.zalo.oaid_token_access || '402033447373752096333'
        let url = 'https://cors-anywhere.herokuapp.com/https://openapi.zalo.me/v2.0/oa/getprofile?access_token=' + zaloOaToken + '&data={"user_id":"' + uid + '"}'
        window.axios.get(url)
          .then(function (response) {
            console.log(response.data)
            vm.zaloOaId = response.data.message !== 'Success' ? vm.MSystemConfiguration.configuration.zalo.oaid : ''
          })
          .catch(function (error) {
            console.log(error)
          })
        // fetch(url) // 'https://reqres.in/api/users?page=2'
        //   .then(function (response) {
        //     return response.json()
        //   })
        //   .then(function (myJson) {
        //     console.log(JSON.stringify(myJson))
        //   })
      },
      callbackzalofollow (rs) {
        // rs like: {data: 1, userId: "2912670375013662092"}
        let vm = this
        let url = vm.end_point + 'users/' + vm.user_id + '/preferences/ZALO_UID'
        const config = {
          headers: {
            'groupId': vm.group_id
          }
        }
        vm.$store.dispatch('loading/setLoading', {
          loading: true,
          message: 'Cập nhật thông tin cá nhân...'
        })
        let params = new URLSearchParams()
        params.append('value', '{"uid":"' + rs.userId + '"}')
        window.axios.put(url, params, config)
          .then(function (response) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
          })
          .catch(function (error) {
            vm.$store.dispatch('loading/setLoading', {
              loading: false
            })
            console.log(error)
            window.showMessageByAPICode(error.response.status, error.response.data)
          })
      }
    },
    mounted () {
      let vm = this
      this.$nextTick(() => {
        window.$(document).ready(function ($) {
          // let dataAlpaca = $('#profile-check-noti-detail-default').val()
          // let alpacaSchemaJs = $('#profile-check-noti-detail-default-schema').val()
          let dataAlpaca = vm.MSystemConfiguration.configuration.userpreference.data
          let alpacaSchemaJs = vm.MSystemConfiguration.configuration.userpreference.schema
          if (dataAlpaca === '') {
            dataAlpaca = {
              'settingNotification': [
                {
                  'settingType': 'updateDocFile',
                  'settingLabel': 'Cập nhật thông tin văn bản',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'approveDocFile',
                  'settingLabel': 'Cập nhật phê duyệt văn bản',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'votingDocFile',
                  'settingLabel': 'Cập nhật đánh giá văn bản',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'commentDocFile',
                  'settingLabel': 'Bình luận trên văn bản',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'attachFileDocFile',
                  'settingLabel': 'Đính kèm tệp lên văn bản',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'updateDocArchive',
                  'settingLabel': 'Cập nhật thông tin hồ sơ',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'approveDocArchive',
                  'settingLabel': 'Cập nhật phê duyệt hồ sơ',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'votingDocArchive',
                  'settingLabel': 'Cập nhật đánh giá hồ sơ',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'commentDocArchive',
                  'settingLabel': 'Bình luận trên hồ sơ',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'attachFileDocArchive',
                  'settingLabel': 'Đính kèm tệp lên hồ sơ',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'updateActivity',
                  'settingLabel': 'Cập nhật thông tin hoạt động',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'approveActivity',
                  'settingLabel': 'Cập nhật phê duyệt hoạt động',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'votingActivity',
                  'settingLabel': 'Cập nhật đánh giá hoạt động',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'commentActivity',
                  'settingLabel': 'Bình luận trên hoạt động',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'attachFileActivity',
                  'settingLabel': 'Đính kèm tệp lên hoạt động',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'updateChecklist',
                  'settingLabel': 'Cập nhật thông tin công việc',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'approveChecklist',
                  'settingLabel': 'Cập nhật phê duyệt công việc',
                  'email': true,
                  'sms': false
                },
                {
                  'settingType': 'votingChecklist',
                  'settingLabel': 'Cập nhật đánh giá công việc',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'commentChecklist',
                  'settingLabel': 'Bình luận trên công việc',
                  'email': false,
                  'sms': false
                },
                {
                  'settingType': 'attachFileChecklist',
                  'settingLabel': 'Đính kèm tệp lên công việc',
                  'email': true,
                  'sms': false
                }
              ]
            }
          } else {
            // dataAlpaca = eval('(' + dataAlpaca + ')')
          }
          if (alpacaSchemaJs.length === 0) {
            alpacaSchemaJs = 'default'
          }
          let profileAlpaca = new window.MobilinkProfileAlpaca({
            el: '#profile-check-noti-detail',
            saveButton: '.profile-check-noti-detail-submit',
            getPreferencesAPI: function (options) {
              // let pk = $('#profile-check-noti-detail').attr('data-pk')
              $.ajax({
                url: vm.end_point + '/users/' + vm.user_id + '/preferences',
                headers: {
                  'groupId': vm.group_id
                },
                type: 'GET',
                dataType: 'text',
                success: function (result) {
                  options.success(result)
                },
                error: function (xhr) {
                  options.error(xhr.status)
                }
              })
            },
            putPreferenceAPI: function (data) {
              // let pk = $('#profile-check-noti-detail').attr('data-pk')
              $.ajax({
                url: vm.end_point + '/users/' + vm.user_id + '/preferences',
                type: 'PUT',
                headers: {
                  'groupId': vm.group_id
                },
                dataType: 'json',
                async: false,
                data: {
                  preferences: data
                },
                success: function (response) {
                  window.showMessageToastr('success', 'Yêu cầu của bạn được xử lý thành công!')
                },
                error: function (xhr, textStatus, errorThrown) {
                  window.showMessageByAPICode(xhr.status)
                }
              })
            },
            dataAlpaca: dataAlpaca,
            alpacaSchemaJs: alpacaSchemaJs
          })
          profileAlpaca.active()
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
  .layout-btn-zalo {
    position: relative;
  }
  .zalo-btn-follow-wrapper {
    position: absolute;
    right: 0;
    top: 8px;
  }

</style>
