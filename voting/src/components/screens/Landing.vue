<template>
  <div style="height: 100%; background-color: #ffff; padding-top: 20px;">
    <v-layout row wrap>
      <v-flex xs12 sm12 class="text-xs-center" style="margin-bottom: 20px;">
        <h3 class="text-center" style="color:#065694">CHỌN CƠ QUAN ĐỂ ĐÁNH GIÁ CÁN BỘ</h3>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
      <v-flex xs12 sm8>
        <v-layout row wrap>
          <v-flex xs12 sm4 v-for="(item, index) in govAgencys" :key="index + 'gov'" style="padding-left: 5px; padding-right: 5px;">
            <!-- <v-chip class="text-xs-center" style="width: 100%; min-height: 40px; cursor: pointer;" label color="primary" text-color="white" @click="viewListEmployee(item)">
              <span style="cursor: pointer;">{{item.itemName}}</span>
            </v-chip> -->
            <v-btn outline flat color="primary" class="btn-select" @click="viewListEmployee(item)" style="width:100%;height:auto;min-height:38px;background-color:#b3d4fc5c!important">
              <span style="white-space: normal">{{item.itemName}}</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    govAgencys: [],
    btnLoading: false,
    donViDanhGia: []
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    let vm = this
    try {
      if (donViDanhGiaConfig) {
        vm.donViDanhGia = donViDanhGiaConfig.split(',')
      }
    } catch (error) {
    }
    vm.$nextTick(function () {
      let viewListEmployee = function (item) {
        vm.$router.push({
          path: '/danh-gia-can-bo/' + item.itemCode,
          query: {
            itemName: item.itemName
          }
        })
      }
      vm.$store.dispatch('loadGovAgencys', {}).then(result => {
        let agencyList = result
        let agencyLength = agencyList.length
        if (donViDanhGiaConfig) {
          vm.govAgencys = []
          for (let i = 0; i < agencyLength; i++) {
            let exits = vm.donViDanhGia.filter(function (item) {
              return item == agencyList[i]['itemCode']
            })
            if (exits && exits.length > 0) {
              vm.govAgencys.push(agencyList[i])
            }
          }
        } else {
          if (agencyLength > 1) {
            let count = 0
            for (let i = 0; i < agencyLength; i++) {
              let param = {
                headers: {
                  groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
                },
                params: {
                  start: 0,
                  end: 1,
                  jobposCode: 'DANHGIA_' + agencyList[i].itemCode
                }
              }
              axios.get('/o/rest/v2/employees/publish/' + agencyList[i].itemCode, param).then(result => {
                count += 1
                if (result.data.data) {
                  vm.govAgencys.push(agencyList[i])
                }
                if (count === agencyLength) {
                  if (vm.govAgencys.length === 1) {
                    viewListEmployee(vm.govAgencys[0])
                  }
                }
              }).catch(xhr => {
                count += 1
                if (count === agencyLength) {
                  if (vm.govAgencys.length === 1) {
                    viewListEmployee(vm.govAgencys[0])
                  }
                }
              })
            }
          } else if (agencyLength === 1) {
            vm.govAgencys = agencyList
            viewListEmployee(vm.govAgencys[0])
          }
        }
        
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    viewListEmployee (item) {
     this.$router.push({
        path: '/danh-gia-can-bo/' + item.itemCode,
        query: {
          itemName: item.itemName
        }
      })
    }
  },
  filters: {
  }
}
</script>
