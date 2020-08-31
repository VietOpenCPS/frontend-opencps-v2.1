<template>
    <v-container class="pa-2">
        <div class="row-header no__hidden_class">
            <div class="background-triangle-big">
                <span>DANH SÁCH CÔNG DÂN</span>
            </div> 
        </div>
        <v-layout wrap class="white pt-3">
            <v-flex xs12>
                <v-layout wrap align-center>
                    <v-flex xs12 md3 class="pa-2">
                        <v-text-field
                            label="CMND"
                            v-model="applicantIdNo"
                            box
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4 class="pa-2">
                        <v-text-field
                            label="Tên công dân"
                            box
                            v-model="applicantName"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md4 class="pa-2">
                        <v-text-field
                            label="Email"
                            box
                            v-model="contactEmail"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 md1>
                      <v-btn small color="primary" @click="getList()">
                        <v-icon dark>search</v-icon>
                        Tìm kiếm
                      </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="px-2">
                <v-data-table
                    id="table-dossier"
                    no-data-text="Không có dữ liệu"
                    hide-actions
                    item-key="dossierId"
                    class="table-landing table-bordered"
                    :headers="headers"
                    :items="desserts"
                    style="border-left: solid 0.5px;"
                >
                  <template slot="headers" slot-scope="props">
                    <tr>
                      <th v-for="header in props.headers" :key="header.text">{{header.text}}</th>
                    </tr>
                  </template>
                    <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{  page*pageSize - pageSize + props.index + 1 }}</td>
                            <td>{{ props.item.applicantName }}</td>
                            <td>{{ props.item.applicantIdNo }}</td>
                            <td>{{ props.item.contactEmail }}</td>
                            <td style="width: 100px;"><v-btn small color="primary" dark @click="active(props.item.applicantId)">Kích hoạt</v-btn></td> 
                    </template>
                </v-data-table>
                <TinyPagination :total="total" :page="page" @tiny:change-page="paggingData"></TinyPagination>
            </v-flex>
        </v-layout> 

    </v-container>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  import TinyPagination from './TinyPagination'
  Vue.use(toastr)
  export default {
      components: {
          TinyPagination 
      },
      data () {
          return {
            applicantName: '',
            applicantIdNo: '',
            contactEmail: '',
            total: 0,
            page: 1,
            pageSize: 20,
            headers: [
                { text: 'STT', align: 'left', sortable: false},
                { text: 'Tên công dân', sortable: false },
                { text: 'Số CMND', sortable: false },
                { text: 'Email', sortable: false  },
                { text: 'Thao tác', sortable: false },
            ],
            desserts: []
          }
      },
      created () {
        let vm = this
        vm.$nextTick(function(){
          vm.getList()
        })
      },
      methods: {
        getList () {
          let vm = this
          let config = {
            headers: {
              'groupId': window.themeDisplay.getScopeGroupId(),
            }
          }
          let textPost = {
            applicantName: vm.applicantName,
            idNo: vm.applicantIdNo,
            contactEmail: vm.contactEmail,
            verification: '0,2',
            haveAccount: true,
            start: vm.page*vm.pageSize -vm.pageSize,
            end: vm.page*vm.pageSize
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'GET')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('url', '/applicants')
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result1) {
            if (result1.data) {
              vm.desserts = result1.data.data
              vm.total = result1.data.total
            } else {
              vm.desserts = []
            }
          }).catch(() => {
            
          })
        },
        active (applicantId) {
          let vm = this
          let config = {
            headers: {
              'groupId': window.themeDisplay.getScopeGroupId(),
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'POST')
          dataPost.append('url', '/applicants/' + applicantId + '/verify')
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function () {
            toastr.success('Kích hoạt thành công.')
            vm.getList()
          }).catch(() => {
            toastr.error('Kích hoạt thất bại.')
          })
        },
        paggingData(config) {
          let vm = this
          vm.page = config.page
          vm.getList()
        }
      }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
