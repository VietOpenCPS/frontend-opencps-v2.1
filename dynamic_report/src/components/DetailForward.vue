<template>
  <div>
    <tiep-nhan-ho-so-detail ref="tiepnhanhosodetail" :formCode="formCode" ></tiep-nhan-ho-so-detail>
  </div>
</template>

<script>
// import ChuyenPhatKetQuaDetail from './ChuyenPhatKetQuaDetail.vue'
// import FeeDetail from './FeeDetail.vue'
// import HoSoLienThongTinhTrangXuLyDetail from './HoSoLienThongTinhTrangXuLyDetail.vue'
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'
// import TiepNhanHoSoTrucTuyenDetail from './TiepNhanHoSoTrucTuyenDetail.vue'
// import TraKetQuaDetail from './TraKetQuaDetail.vue'
// import XemChiTietHoSoDetail from './XemChiTietHoSoDetail.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    // 'ho-so-lien-thong-tinh-trang-xu-ly-detail': HoSoLienThongTinhTrangXuLyDetail,
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail
  },
  data: () => ({
    initData: null,
    step: ''
  })
}
</script>
