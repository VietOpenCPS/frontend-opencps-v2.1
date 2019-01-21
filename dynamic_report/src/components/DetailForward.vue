<template>
  <div>
    <tiep-nhan-ho-so-detail 
      ref="tiepnhanhosodetail"
      :formCode="formCode"
    ></tiep-nhan-ho-so-detail>
  </div>
</template>

<script>
// import ChuyenPhatKetQuaDetail from './ChuyenPhatKetQuaDetail.vue'
// import FeeDetail from './FeeDetail.vue'
import HoSoLienThongDetail from './HoSoLienThongDetail.vue'
// import HoSoLienThongTinhTrangXuLyDetail from './HoSoLienThongTinhTrangXuLyDetail.vue'
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'
// import TiepNhanHoSoTrucTuyenDetail from './TiepNhanHoSoTrucTuyenDetail.vue'
// import TraKetQuaDetail from './TraKetQuaDetail.vue'
// import XemChiTietHoSoDetail from './XemChiTietHoSoDetail.vue'
import XemChiTietHoSoDetailCanBo from './XemChiTietHoSoDetailCanBo.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'ho-so-lien-thong-detail': HoSoLienThongDetail,
    // 'ho-so-lien-thong-tinh-trang-xu-ly-detail': HoSoLienThongTinhTrangXuLyDetail,
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail,
    'xem-chi-tiet-ho-so-detail-can-bo': XemChiTietHoSoDetailCanBo,
    // 'chi-tiet-tinh-trang-lien-thong': HoSoLienThongTinhTrangXuLyDetail,
    'chi-tiet-ho-so-lien-thong': HoSoLienThongDetail
  },
  data: () => ({
    initData: null,
    step: ''
  })
}
</script>
