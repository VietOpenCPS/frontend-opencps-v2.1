<template>
  <div>
    13123
  </div>
</template>

<script>
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'
import XemChiTietHoSoDetailCanBo from './XemChiTietHoSoDetailCanBo.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail,
    'xem-chi-tiet-ho-so-detail-can-bo': XemChiTietHoSoDetailCanBo
  },
  data: () => ({
    initData: null,
    step: ''
  })
}
</script>
