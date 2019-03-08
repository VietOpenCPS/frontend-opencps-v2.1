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
    </v-breadcrumbs>

    <v-card class="px-2 mx-1" style="overflow: hidden;">
      <v-card-text v-if="exportLoading">
        <v-flex xs12 sm12>
          <v-flex color="primary" class="text-xs-center">
            <span>Đang thực hiện export dữ liệu ...</span>
          </v-flex>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-flex>
      </v-card-text>
      <v-btn
        v-else
        color="primary"
        class="white--text"
        @click="exportData()"
      >
        EXPORT DỮ LIỆU &nbsp;
        <v-icon right dark>cloud_download</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
  import axios from 'axios'
  
  export default {
    props: ['tableName'],
    data () {
      return {
        exportLoading: false,
        breadCrumbsitems: [
          {
            text: 'Export',
            disabled: false
          },
          {
            text: 'ZIP',
            disabled: false
          }
        ]
      }
    },
    methods: {
      exportData () {
        let vm = this
        vm.exportLoading = true
        vm.$store.dispatch('doExportData').then(function (result) {
          vm.exportLoading = false
          alert('Export dữ liệu thành công')
        }).catch(function () {
          vm.exportLoading = false
          alert('Export dữ liệu không thành công')
        })
      }
    }
  }
</script>
