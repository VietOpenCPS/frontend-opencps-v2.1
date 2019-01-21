<template>
  <div>
    <tiep-nhan-ho-so-detail 
      ref="tiepnhanhosodetail"
      :formCode="formCode"
    ></tiep-nhan-ho-so-detail>
  </div>
</template>

<script>
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail
  },
  data: () => ({
    initData: null,
    step: ''
  })
}
</script>
