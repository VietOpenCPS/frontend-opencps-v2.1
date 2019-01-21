<template>
  <div>
    <tiep-nhan-ho-so-detail 
      ref="tiepnhanhosodetail"
      :formCode="formCode"
    ></tiep-nhan-ho-so-detail>
  </div>
</template>

<script>
import ChamQuaHanDetail from './ChamQuaHanDetail.vue'
// import ChuyenPhatKetQuaDetail from './ChuyenPhatKetQuaDetail.vue'
// import FeeDetail from './FeeDetail.vue'
import HoanThienBoSungHoSoDetail from './HoanThienBoSungHoSoDetail.vue'
import HoSoLienThongDetail from './HoSoLienThongDetail.vue'
// import HoSoLienThongTinhTrangXuLyDetail from './HoSoLienThongTinhTrangXuLyDetail.vue'
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'cham-qua-han-detail': ChamQuaHanDetail,
    'hoan-thien-bo-sung-ho-so-detail': HoanThienBoSungHoSoDetail,
    'ho-so-lien-thong-detail': HoSoLienThongDetail,
    // 'ho-so-lien-thong-tinh-trang-xu-ly-detail': HoSoLienThongTinhTrangXuLyDetail,
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail,
    'chi-tiet-ho-so-lien-thong': HoSoLienThongDetail
  },
  data: () => ({
    initData: null,
    step: ''
  })
}
</script>
