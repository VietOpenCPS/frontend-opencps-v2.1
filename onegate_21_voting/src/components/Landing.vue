<template>
  <div style="height: 100%; background-color: #ffff; padding-top: 20px;">
    <v-layout row wrap>
      <v-flex xs12 sm12 class="text-xs-center" style="margin-bottom: 20px;">
        <h3 class="text-center">CHỌN CƠ QUAN ĐỂ ĐÁNH GÍA CÁN BỘ</h3>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
      <v-flex xs12 sm8>
        <v-layout row wrap>
          <v-flex xs12 sm4 v-for="(item, index) in govAgencys" :key="index + 'gov'" style="padding-left: 5px; padding-right: 5px;">
            <v-chip class="text-xs-center" style="width: 100%; min-height: 40px; cursor: pointer;" label color="primary" text-color="white" @click="viewListEmployee(item)">
              <span style="cursor: pointer;">{{item.administrationName}}</span>
            </v-chip>
            <!-- <v-btn style="width: 100%;" color="success" @click="viewListEmployee(item)">{{item.administrationName}}</v-btn> -->
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
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
      router.push({
        path: '/danh-sach-can-bo/' + item.administrationCode,
        query: {
          administrationName: item.administrationName
        }
      })
    }
  },
  filters: {
  }
}
</script>
