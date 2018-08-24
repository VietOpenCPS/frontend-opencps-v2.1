<template>
  <div class="px-2 py-0 mt-5 text-center">
    <v-btn class="mr-5" color="primary"
      @click="goTraCuuHoSo"
    >
      Tra Cứu Hồ Sơ &nbsp;
      <v-icon size="18">arrow_forward</v-icon>
    </v-btn>
    <v-btn color="primary" class="mr-5"
      @click="goTraCuuThuTuc"
    >
      Tra Cứu Thủ Tục &nbsp;
      <v-icon size="18">arrow_forward</v-icon>
    </v-btn>
    <v-btn color="primary"
      @click="goDanhGiaCanBo"
    >
      Đánh Giá Cán Bộ &nbsp;
      <v-icon size="18">arrow_forward</v-icon>
    </v-btn>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
export default {
  props: [],
  components: {},
  data: () => ({
  }),
  methods: {
    goTraCuuHoSo () {
      router.push('/tra-cuu-ho-so')
    },
    goTraCuuThuTuc () {
      router.push('/tra-cuu-thu-tuc')
    },
    goDanhGiaCanBo () {
      router.push('/danh-gia-can-bo')
    }
  }
}
</script>
