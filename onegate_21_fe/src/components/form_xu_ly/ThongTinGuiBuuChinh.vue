<template>
  <v-expansion-panel class="expansion-pl">
    <v-expansion-panel-content hide-actions value="1">
      <div slot="header">
        <div class="background-triangle-small"> 
          <v-icon size="18" color="white">star_rate</v-icon> 
        </div>Thông tin gửi bưu chính
      </div>
      <v-card>
        <v-layout wrap class="my-2">
          <v-flex xs12 sm2>
            <v-subheader class="pl-0">Dịch vụ đăng ký: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <p class="mt-1 mb-0">VNPOST</p>
          </v-flex>
          <v-flex xs12 sm2>
            <v-subheader class="pl-0">Bưu cục: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <p class="mt-1 mb-0">{{postName}}</p>
          </v-flex>
          <v-flex xs12 sm2>
            <v-subheader class="pl-0">Tên người nhận: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <p class="mt-1 mb-0">{{postalService.applicantName}}</p>
          </v-flex>
          <v-flex xs12 sm2>
            <v-subheader class="pl-0">Số điện thoại: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <p class="mt-1 mb-0">{{postalService.postalTelNo}}</p>
          </v-flex>
          <v-flex xs12 sm2>
            <v-subheader class="pl-0">Địa chỉ: </v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <p class="mt-1 mb-0">{{postalService.postalAddress}}</p>
          </v-flex>
        </v-layout>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>

</template>

<script>

export default {
  props: {
    postalService: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    postName: ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let vm = this
      vm.$store.dispatch('getVNPOSTcode').then(result => {
        let postItem = result.filter(function (item) {
          return Number(item.itemCode) === Number(vm.postalService.postalCityCode)
        })
        if (postItem.length > 0) {
          vm.postName = postItem[0].itemName
        }
      })
    })
  },
  methods: {
  }
}
</script>
