<template>
  <div>
    13123
  </div>
</template>

<script>
import XemChiTietHoSoDetailCanBo from './XemChiTietHoSoDetailCanBo.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'xem-chi-tiet-ho-so-detail-can-bo': XemChiTietHoSoDetailCanBo
  },
  data: () => ({
    initData: null,
    step: ''
  })
}
</script>
