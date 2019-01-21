<template>
  <div class="form-chitiet">
    
    <div>
      <v-tabs icons-and-text v-model="activeTab">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabs-1" @click="getNextActions()"> 
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            <span v-if="originality === 3">XỬ LÝ HỒ SƠ</span> <span v-else>CHUẨN BỊ HỒ SƠ</span>
          </v-btn>
        </v-tab>
        <v-tabs-items v-model="activeTab" reverse-transition="fade-transition" transition="fade-transition" style="overflow: visible!important">
          <v-tab-item value="tabs-1" :key="1" reverse-transition="fade-transition" transition="fade-transition">
            <div style="position: relative;" v-if="checkInput !== 0 && filterNextActionEnable(btnDossierDynamics)">
              <v-expansion-panel :value="[true]" class="expansion-pl">
                <v-expansion-panel-content hide-actions :key="1">
                  <div slot="header">
                    <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                    <span v-if="checkInput === 2">Chỉnh sửa thành phần hồ sơ</span> 
                    <span v-else>Kiểm tra thành phần hồ sơ</span>&nbsp;&nbsp;&nbsp;&nbsp; 
                  </div>
                  <thanh-phan-ho-so ref="thanhphanhoso" :checkInput="checkInput" :onlyView="false" :id="'ci'" :partTypes="inputTypes"></thanh-phan-ho-so>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
  </div>
</template>

<script>

import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'

export default {
  props: ['index', 'id'],
  components: {
    'thanh-phan-ho-so': ThanhPhanHoSo
  },
  data: () => ({})
}
</script>
