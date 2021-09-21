<template>
    <div>
        <div class="content-wrapper">
            <div class="search-section" style="height: calc(100vh - 162px) !important">
                <div class="note">
                    <span style="font-size: 18px;">Nhập mã số hồ sơ mà bạn muốn xử lý <br>Hoặc chọn đơn vị để thực hiện quản lý hồ sơ</span>
                </div>

                <v-flex class="select-gov text-xs-center flex">
                    <div style="width: 565px" class="d-inline-block">
                        <v-autocomplete
                            class="select-search d-inline-block"
                            style="width: 450px"
                            placeholder="Chọn đơn vị"
                            :items="listDonVi"
                            v-model="donviSelect"
                            :hide-selected="true"
                            item-text="itemName"
                            item-value="itemCode"
                            clearable
                            hide-details
                            solo
                            flat
                            height="32"
                            min-height="32"
                        ></v-autocomplete>
                        <button class="d-inline-block" type="button" @click="toDossierManage">Quản lý hồ sơ</button>
                    </div>
                    
                </v-flex>
                
                <div class="search-wrapper mt-3">
                    <div class="search">
                        <input type="text" class="form-control" placeholder="Nhập mã hồ sơ" id="dossierNoSearch" name="dossierNoSearch">
                        <button type="button" @click="toDetailDossier">Xử lý hồ sơ</button>
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
            let govCode = dossierNo.split('-')[0]
            let govCodeSelect = ''
            try {
                govCodeSelect = vm.listDonVi.filter(function (item) {
                    return item.itemNameEN === govCode
                })[0]['itemCode']
            } catch (error) {
                toastr.error('Không có hồ sơ mã ' + dossierNo)
                return
            }
            
            if (govCodeSelect) {
                let dossierId = ''
                let config = {
                    headers: {
                        'groupId': govCodeSelect
                    }
                }
                axios.get('/o/rest/v2/dossiers?start=0&end=1&dossierNo=' + dossierNo, config).then(function (response) {
                    if (response.data && response.data.hasOwnProperty('data') && response.data.data.length > 0) {
                        dossierId = response.data.data[0]['dossierId']
                        let url = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
                        window.location.href = url + '/mot-cua-dien-tu#/' + govCodeSelect + '/danh-sach-ho-so/0/chi-tiet-ho-so/' + dossierId
                    } else {
                        toastr.error('Không có hồ sơ mã ' + dossierNo)
                    }
                }).catch(function (error) {
                })
            } else {
                toastr.error('Không có hồ sơ mã ' + dossierNo)
            }
            
        } else {
            toastr.info('Vui lòng nhập mã hồ sơ')
        }
      }
    }
  }
</script>

