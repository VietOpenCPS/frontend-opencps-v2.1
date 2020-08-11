<template>
    <div>
        <div class="content-wrapper">
            <div class="search-section" style="height: calc(100vh - 162px) !important">
                <div class="note">
                    <span style="font-size: 18px;">NHẬP MÃ HỒ SƠ ĐỂ TRA CỨU THÔNG TIN </span>
                </div>

                
                <div class="search-wrapper mt-3">
                    <div class="search">
                        <input type="text" class="form-control" placeholder="Nhập mã hồ sơ" id="dossierNoSearch" name="dossierNoSearch">
                        <button type="button" @click="toDetailDossier">TRA CỨU THÔNG TIN</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  Vue.use(toastr)

  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    data: () => ({
      listDonVi: [],
      donviSelect: ''
    }),
    components: {

    },
    computed: {
      
    },
    beforeDestroy () {

    },
    mounted () {
     let vm = this
     var searchDossierNo = document.getElementById('dossierNoSearch')
     searchDossierNo.addEventListener('keypress', function (e) {
        if (e.charCode==13) {
            vm.toDetailDossier()
        }
     })
    },
    beforeCreate() {

    },
    created () {
        let vm = this
        vm.getAgencies()
    },
    watch: {
    },
    methods: {
      getAgencies () {
        let vm = this
        let url = '/o/rest/v2/dictcollections/SITE_GROUP/dictitems'
        let config = {
          headers: {
            'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get(url, config).then(function (response) {
          if (response.data && response.data['data']) {
              vm.listDonVi = response.data.data
          }
          
        }).catch(function (error) {
          
        })
      },
      toDossierManage () {
        let vm = this
        if (vm.donviSelect) {
            let url = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
            window.location.href = url + '/mot-cua-dien-tu#/' + vm.donviSelect + '/danh-sach-ho-so'
        } else {
            toastr.info('Vui lòng chọn đơn vị xử lý hồ sơ')
        }
      },
      toDetailDossier () {
        let vm = this
        if (document.getElementById('dossierNoSearch').value) {
            let dossierNo = document.getElementById('dossierNoSearch').value
            let config = {
              headers: {
                'groupId': window.themeDisplay.getScopeGroupId()
              }
            }
            let textPost = {
              dossierNo: dossierNo,
              start: 0,
              end: 10
            }
            let dataPost = new URLSearchParams()
            dataPost.append('method', 'GET')
            dataPost.append('url', '/dossiers')
            dataPost.append('data', JSON.stringify(textPost))
            axios.post('/o/rest/v2/proxy', dataPost, config).then(function (response) {
              if (response.data && response.data.hasOwnProperty('data') && response.data.data.length > 0) {
                let dossierId = response.data.data[0]['dossierId']
                vm.$store.dispatch('setSubmissionNote', response.data.data[0]['submissionNote'])
                vm.$store.dispatch('setThongTinChiTietHoSo', response.data.data[0])
                vm.$router.push({
                  path: '/thong-tin-ho-so/' + dossierId,
                  query: {
                    renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                  }
                })
              } else {
                  toastr.error('Không tồn tại hồ sơ mã ' + dossierNo)
              }
            }).catch(xhr => {
                
            })

        } else {
            toastr.info('Vui lòng nhập mã hồ sơ')
        }
      }
    }
  }
</script>

