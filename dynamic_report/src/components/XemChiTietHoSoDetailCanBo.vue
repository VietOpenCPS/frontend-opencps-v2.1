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
            <!-- Action button -->
            <div class="px-4 py-3" v-if="btnStateVisible" style="border-bottom: 1px solid #dddddd;">
              <v-btn color="primary" class="ml-0 mr-2" :class='{"deactive__btn": String(btnIndex) !== String(index)}' v-for="(item, index) in btnDossierDynamics" v-bind:key="index" 
                v-on:click.native="processPullBtnDetail(item, index)" 
                :loading="loadingAction && index === btnIndex"
                :disabled="loadingAction || item.enable === 2"
                v-if="item.enable > 0 || (item['autoEvent'] === 'special' && thongTinChiTietHoSo['permission'].indexOf('write') >= 0)"
              >
                {{item.actionName}}
                <span slot="loader">Loading...</span>
              </v-btn>
              <v-btn color="primary" class="ml-0 mr-2" v-for="(item, index) in btnPlugins" v-bind:key="index" 
                v-on:click.native="processPullBtnplugin(item, index)" 
                :loading="loadingPlugin"
                :disabled="loadingPlugin"
              >
                {{item.pluginName}}
                <span slot="loader">Loading...</span>
              </v-btn>
              <v-menu bottom offset-y v-if="btnStepsDynamics.length > 0 && thongTinChiTietHoSo['permission'].indexOf('write') >= 0" style="display: inline-block;position:relative !important">
                <v-btn slot="activator" class="deactive__btn" color="primary" dark>Khác &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                <v-list>
                  <v-list-tile v-for="(item, index) in btnStepsDynamics" :key="index" @click="btnActionEvent(item, index)">
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
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
