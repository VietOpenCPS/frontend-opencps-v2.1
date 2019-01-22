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
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    govAgencys: [],
    btnLoading: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    console.log('landing---------')
    vm.$nextTick(function () {
      vm.$store.dispatch('loadGovAgencys', {}).then(result => {
        vm.govAgencys = result
        console.log(vm.govAgencys)
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    viewListEmployee (item) {
     this.$router.push({
        path: '/danh-sach-can-bo/' + item.itemCode,
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
