<template>
  <div>
    <v-expansion-panel :value="[true]" expand readonly>
      <v-expansion-panel-content expand-icon="mdi-menu-down">
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Thông tin chung hồ sơ</div>
        <v-card>
          <v-card-text class="py-0">
            <v-layout wrap class="px-2 py-2">
              <v-flex xs12 sm4 class="pr-3" v-if="originality !== 1">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Chủ hồ sơ: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantName}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Số CMND/ căn cước: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantIdNo}}</span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1 overHidden">
                  <span class="pr-2">Địa chỉ: </span>
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{ thongTinChiTietHoSo.address }} {{thongTinChiTietHoSo.wardName}}<span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span></span>
                    <span class="pl-0"> {{thongTinChiTietHoSo.address}} {{thongTinChiTietHoSo.wardName}}<span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span></span>
                  </v-tooltip>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pl-0">Thư điện tử: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.contactEmail}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Điện thoại: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.contactTelNo}} </span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <v-menu offset-y style="position:relative !important;">
                    <span slot="activator" class="pr-2">
                      Thông tin người nộp
                      <v-icon color="blue" size="22" style="position: absolute;right: -12px;top: -2px;">arrow_drop_down</v-icon>
                    </span>
                    <v-list class="px-3 py-2">
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Tên người nộp:</span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> 
                          {{thongTinChiTietHoSo.applicantName}}
                        </span>
                        <span v-else class="pl-0 text-bold "> {{thongTinChiTietHoSo.delegateName}} </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Số CMND/ căn cước: </span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> 
                          {{thongTinChiTietHoSo.applicantIdNo}}
                        </span>
                        <span v-else class="pl-0 text-bold "> {{thongTinChiTietHoSo.delegateIdNo}} </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Địa chỉ:</span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> 
                          {{thongTinChiTietHoSo.address}} {{thongTinChiTietHoSo.wardName}}
                          <span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span>
                        </span>
                        <span class="pl-0 text-bold" v-else> 
                          {{thongTinChiTietHoSo.delegateAddress}} {{thongTinChiTietHoSo.delegateWardName}}
                          <span v-if="thongTinChiTietHoSo.delegateWardName">, {{thongTinChiTietHoSo.delegateDistrictName}}, {{thongTinChiTietHoSo.delegateCityName}}</span>
                        </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Thư điện tử:</span>
                        <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.contactEmail}} </span>
                        <span class="pl-0 text-bold " v-else> {{thongTinChiTietHoSo.delegateEmail}} </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Số điện thoại:</span>
                        <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.contactTelNo}} </span>
                        <span class="pl-0 text-bold " v-else> {{thongTinChiTietHoSo.delegateTelNo}} </span>
                      </div>
                    </v-list>
                  </v-menu>
                </div>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm4 class="pr-3" v-if="originality === 1">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Mã hồ sơ: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.dossierNo}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Cơ quan: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.govAgencyName}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Trạng thái: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
                </div>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm4 v-if="originality !== 1">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2" v-if="thongTinChiTietHoSo.online">Ngày gửi trực tuyến: </span>
                  <span class="pr-2" v-else>Ngày nộp hồ sơ: </span>
                  <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                  <span class="pl-0 text-bold" v-else> {{thongTinChiTietHoSo.receiveDate}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày tiếp nhận: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.receiveDate}}</span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Thời hạn giải quyết: </span>
                  <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.durationCount > 0"> 
                    {{durationText(thongTinChiTietHoSo.durationUnit, thongTinChiTietHoSo.durationCount)}} làm việc 
                  </span>
                  <span class="pl-0 text-bold " v-else>
                    Không quy định
                  </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày hẹn trả: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dueDate}}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm4 v-else>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2" v-if="thongTinChiTietHoSo.online">Ngày gửi trực tuyến: </span>
                  <span class="pr-2" v-else>Ngày nộp hồ sơ: </span>
                  <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                  <span class="pl-0 text-bold" v-else> {{thongTinChiTietHoSo.receiveDate}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày tiếp nhận: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.receiveDate}}</span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày hẹn trả: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dueDate}}</span>
                </div>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm4 v-if="originality !== 1">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Mã hồ sơ: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.dossierNo}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo.originDossierNo">
                  <span class="pr-2">Hồ sơ gốc: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.originDossierNo}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Trạng thái: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
                </div>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <div class="xs12 sm12 pb-1 overHidden" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0&&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{thongTinChiTietHoSo.dossierNote}} </span>
                    <span class="pl-0"> {{thongTinChiTietHoSo.dossierNote}} </span>
                  </v-tooltip>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo['groupDossierId']">
                  <span class="pr-2">Nhóm hồ sơ: </span>
                  <span class="pl-0 text-bold">
                    {{groupDossierName}}
                  </span>
                </div>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  Ghi chú:
                </div>
              </v-flex>
              <v-flex xs12 sm4 v-else>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <div class="xs12 sm12 pb-1 overHidden" v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{thongTinChiTietHoSo.dossierNote}} </span>
                    <span class="pl-0"> {{thongTinChiTietHoSo.dossierNote}} </span>
                  </v-tooltip>
                </div>
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo.extendDate">
                  <span class="pl-0 text-bold">Hẹn lại: {{thongTinChiTietHoSo.extendDate}}</span>
                </div>
                <!--  -->
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!--  -->
    <v-expansion-panel :value="[true]" expand readonly style="border-top: 1px solid #dedede">
      <v-expansion-panel-content expand-icon="mdi-menu-down">
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Tiến trình xử lý</div>
        <v-card class="mb-3">
          <v-card-text class="py-0 px-0">
            <v-flex xs12 style="height:42px">
              <v-radio-group class="absolute__btn pt-1" style="width: 350px" v-model="typeTienTrinh" row @change="changeTypeTienTrinh($event)">
                <v-radio label="Xem dạng bảng" :value="1" ></v-radio>
                <v-radio label="Xem dạng biểu đồ" :value="2"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-data-table v-if="typeTienTrinh === 1" :headers="headers" :items="dossierActions" class="table-landing table-bordered"
            hide-actions no-data-text="Không có dữ liệu"
            >
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{props.index + 1}}</td>
                <td class="text-xs-left">{{props.item.sequenceRole}}</td>
                <td class="text-xs-left">{{props.item.sequenceName}}</td>
                <td class="text-xs-left">{{props.item.durationCount|getThoiHanQuyDinh}}</td>
                <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                <td class="text-xs-left">
                  <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                    {{itemUser.userName}} <br>
                  </div>
                </td>
                <td class="text-xs-left">
                  <div v-for="(itemAction, index) in props.item.actions" :key="index">
                    {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                    <span v-if="itemAction.actionNote && itemAction.actionNote !== 'null'"> - <i>{{itemAction.actionNote}}</i></span>
                    <div v-if="Array.isArray(itemAction.files) && itemAction.files.length > 0">
                      <div v-for="(itemFile, index) in itemAction.files" :key="index" title="Tải xuống">
                        <p v-if="itemFile.dossierDocumentId" @click="downloadFileDocument(itemFile.dossierReferenceUid ? itemFile.dossierReferenceUid : '')">
                          <v-icon size="18" color="#0b72ba">
                            get_app
                          </v-icon>
                          <!-- <v-icon size="18" color="#0b72ba" class="mx-2" @click="">visibility</v-icon> -->
                          <span style="color: #0b72ba;cursor: pointer;">
                            {{itemFile.fileName}}
                          </span>
                        </p>
                        <p v-if="itemFile.dossierFileId" @click="downloadFileLogs(itemFile.dossierFileId)">
                          <v-icon size="18" color="#0b72ba">
                            get_app
                          </v-icon>
                          <!-- <v-icon size="18" color="#0b72ba" class="mx-2" @click="">visibility</v-icon> -->
                          <span style="color: #0b72ba;cursor: pointer;">
                            {{itemFile.fileName}}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div v-if="props.item.statusText">
                    <span style="color: green" v-if="thongTinChiTietHoSo['dossierStatus'] === 'done' || thongTinChiTietHoSo['dossierStatus'] === 'unresolved'">
                      {{props.item.statusText.replace("Đang thực hiện:", "")}}
                    </span>
                    <span style="color: green" v-else>
                      {{props.item.statusText}}
                    </span>
                  </div>
                </td>
              </template>
            </v-data-table>
            <div v-else>
              <content-placeholders v-if="loadingMermaidgraph">
                <content-placeholders-img />
                <content-placeholders-heading />
              </content-placeholders>
              <div id="mermaid_dossier" class="mermaid" style="padding: 15px;"></div>
            </div>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
  
</template>

<script>
  mermaid.initialize({
    theme: 'forest',
    startOnLoad: false
  })
  export default {
    props: {
      detailDossier: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      detailDossier(val) {
        // console.log('watch', val)
        let vm = this
        vm.thongTinChiTietHoSo = val
        vm.loadDossierActions()
      }
    },
    components: {},
    data: () => ({
      thongTinChiTietHoSo: {},
      groupDossierNo: '',
      groupDossierName: '',
      showContactDetail: false,
      typeTienTrinh: 1,
      dossierActions: [],
      loadingMermaidgraph: false,
      headers: [
        {
          text: '#',
          align: 'center',
          sortable: false
        },
        {
          text: 'Vai trò',
          align: 'center',
          sortable: false,
          class: 'vaitro_column'
        }, {
          text: 'Công việc',
          align: 'center',
          sortable: false,
          class: 'congviec_column'
        }, {
          text: 'Thời hạn quy định',
          align: 'center',
          sortable: false,
          class: 'thoihanquydinh_column'
        }, {
          text: 'Ngày bắt đầu',
          align: 'center',
          sortable: false,
          class: 'ngaybatdau_column'
        }, {
          text: 'Người thực hiện',
          align: 'center',
          sortable: false,
          class: 'nguoithuchien_column'
        }, {
          text: 'Kết quả',
          align: 'center',
          sortable: false,
          class: 'ketqua_column'
        }
      ],
    }),
    computed: {
    },
    created() {
      let vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    mounted() {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    methods: {
      goBack() {
        window.history.back()
      },
      durationText(durationUnit, durationCount) {
        let durationText
        if (durationUnit === 1 && durationCount > 8) {
          let day = Math.floor(durationCount / 8) + ' ngày'
          let hours
          if (durationCount % 8 !== 0) {
            hours = ((durationCount / 8) - Math.floor(durationCount / 8)) * 8 + ' giờ'
          } else {
            hours = ''
          }
          durationText = `${day} ${hours}`
        } else if (durationUnit === 0) {
          durationText = durationCount + ' ngày'
        } else if (durationUnit === 1 && durationCount <= 8) {
          durationText = durationCount + ' giờ'
        }
        return durationText
      },
      changeTypeTienTrinh (event) {
        let vm = this
        if (event === 2) {
          setTimeout(function () {
            vm.loadMermaidgraph()
          }, 200)
        }
      },
      loadDossierActions () {
        var vm = this
        if (vm.thongTinChiTietHoSo.dossierId) {
          let dataParams = {
            dossierId: vm.thongTinChiTietHoSo.dossierId
          }
          vm.$store.dispatch('loadDossierActions', dataParams).then(resultActions => {
            if (resultActions.data && resultActions.data.length !== 0) {
              let resultTemp = resultActions.data
              for (var i = 0; i < resultTemp.length; i++) {
                if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                  if (!Array.isArray(resultTemp[i]['actions'])) {
                    let arrActionsTemp = []
                    arrActionsTemp.push(resultTemp[i]['actions'])
                    resultTemp[i]['actions'] = arrActionsTemp
                  }
                }
              }
              vm.dossierActions = resultTemp
            } else {
              if (vm.thongTinChiTietHoSo['submissionNote']) {
                try {
                  JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])
                  let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote']).data
                  for (var i = 0; i < resultTemp.length; i++) {
                    if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                      if (!Array.isArray(resultTemp[i]['actions'])) {
                        let arrActionsTemp = []
                        arrActionsTemp.push(resultTemp[i]['actions'])
                        resultTemp[i]['actions'] = arrActionsTemp
                      }
                    }
                  }
                  vm.dossierActions = resultTemp
                } catch (e) {
                }
              }
            }
          }).catch(function () {
            if (vm.thongTinChiTietHoSo['submissionNote']) {
              try {
                JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])
                let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote']).data
                for (var i = 0; i < resultTemp.length; i++) {
                  if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                    if (!Array.isArray(resultTemp[i]['actions'])) {
                      let arrActionsTemp = []
                      arrActionsTemp.push(resultTemp[i]['actions'])
                      resultTemp[i]['actions'] = arrActionsTemp
                    }
                  }
                }
                vm.dossierActions = resultTemp
              } catch (e) {
              }
            }
          })
        }
      },
      loadMermaidgraph (data) {
        let vm = this
        document.getElementById('mermaid_dossier').innerHTML = ''
        if (vm.thongTinChiTietHoSo.dossierId) {
          let dataParams = {
            dossierId: vm.thongTinChiTietHoSo.dossierId
          }
          vm.loadingMermaidgraph = true
          vm.$store.dispatch('loadMermaidgraph', dataParams).then(chartData => {
            vm.loadingMermaidgraph = false
            mermaid.render('theGraph', chartData, function (svgCode) {
              document.getElementById('mermaid_dossier').innerHTML = svgCode
            })
          }).catch(function () {
            vm.loadingMermaidgraph = false
          })
        }
      },
    },
    filters: {
      dateTimeView(arg) {
        if (arg) {
          let value = new Date(Number(arg))
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      },
      getMaxDueDate (arr) {
        let maxDue = Math.max.apply(Math, arr.map(function (item) {
          return item.actionOverdue
        }))
        return maxDue
      },
      getThoiHanQuyDinh (val) {
        if (val > 0) {
          return val + ' ngày'
        } else {
          return ''
        }
      }
    }
  }
</script>
