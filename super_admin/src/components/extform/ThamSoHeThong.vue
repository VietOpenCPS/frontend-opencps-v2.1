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
          {{currentCertNumber.pattern}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <v-form ref="formAddCertNumber" v-model="validAddCertNumber" lazy-validation>
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
    props: ['id'],
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
        if (vm.id !== 0 && vm.id !== '0') {
          vm.getCertNumberDetail()
        } else {
          vm.currentCertNumber = {
            certId: '',
            pattern: '',
            initNumber: ''
          }
        }
      })
    },
    computed: {
    },
    watch: {
      '$route': function (newRoute) {
        let vm = this
        if (vm.id !== 0 && vm.id !== '0') {
          vm.getCertNumberDetail()
        } else {
          vm.currentCertNumber = {
            certId: '',
            pattern: '',
            initNumber: ''
          }
        }
      }
    },
    methods: {
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
        let vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push(currentPath.substring(0, currentPath.indexOf('/ext/editor/')))
      }
    },
    filters: {
    }
  }
</script>
