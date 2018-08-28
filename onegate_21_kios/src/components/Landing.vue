<template>
  <div class="px-2 py-0 mt-5 text-center">
    <!-- <v-btn class="mr-5" color="primary"
      @click="goTraCuuHoSo"
    >
      Tra cứu hồ sơ &nbsp;
      <v-icon size="18">arrow_forward</v-icon>
    </v-btn>
    <v-btn color="primary" class="mr-5"
      @click="goTraCuuThuTuc"
    >
      Tra cứu thủ tục &nbsp;
      <v-icon size="18">arrow_forward</v-icon>
    </v-btn>
    <v-btn color="primary" class="mr-5"
      @click="goDanhGiaCanBo"
    >
      Đánh giá cán bộ &nbsp;
      <v-icon size="18">arrow_forward</v-icon>
    </v-btn> -->
    <div class="kios-wrapper kios-home">
      <div class="custom-row" @click="goTraCuuHoSo">
        <div class="col-7">
          <p>Hệ thống hỗ trợ người dùng tra cứu thông tin hồ sơ, người dùng sử dụng máy quét mã vạch để tra cứu nhanh thông tin hồ sơ</p>
        </div>
        <div class="col-5">
          <span>Tra cứu<br/>hồ sơ</span>
        </div>
      </div>
      <div class="custom-row" @click="goTraCuuThuTuc">
        <div class="col-5">
          <span>Tra cứu<br/>thủ tục</span>
        </div>
        <div class="col-7">
          <p>Hỗ trợ người sử dụng tra cứu, tìm hiểu thông tin thành phần hồ sơ, cách thức thực hiện của các thủ tục hành chính một cách nhanh chóng nhằm tạo điều kiện thuận lợi cho quá trình nộp hồ sơ ...</p>
        </div>
      </div>
      <div class="custom-row" @click="goDanhGiaCanBo">
        <div class="col-7">
          <p>Đánh giá cán bộ tiếp dân trong tại đơn vị hành chính công</p>
        </div>
        <div class="col-5">
          <span>Đánh giá<br/>cán bộ</span>
        </div>
      </div>
    </div>
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
    },
    goHoSoKetQua () {
      router.push('/ho-so-co-ket-qua')
    }
  }
}
</script>
