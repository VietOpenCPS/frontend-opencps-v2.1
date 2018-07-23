<template>  
  <div class="phancong" style="background-color: white;width:100%">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>Duyệt hồ sơ
        </div>
        <v-card >
          <v-card-text class="px-0 py-0">
            <v-tabs icons-and-text class="mb-4">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab :key="1" href="#tabs-1">
                <v-btn flat class="px-0 py-0 mx-0 my-0">Ký kết quả hồ sơ</v-btn>
              </v-tab>
              <v-tab :key="2" href="#tabs-3">
                <v-btn flat class="px-0 py-0 mx-0 my-0">Không ký duyệt</v-btn>
              </v-tab>
              <v-tab :key="3" href="#tabs-4">
                <v-btn flat class="px-0 py-0 mx-0 my-0">Yêu cầu trình lại</v-btn>
              </v-tab>
              <v-tabs-items class="px-3 py-3">
                <v-tab-item id="tabs-1" :key="1" reverse-transition="fade-transition" transition="fade-transition">
                  <v-checkbox 
                    v-model="activeKS"
                    label="Sử dụng chữ ký số"
                  ></v-checkbox>
                </v-tab-item>
                <v-tab-item id="tabs-3" :key="2" reverse-transition="fade-transition" transition="fade-transition">
                  Lý do:
                  <v-text-field
                    placeholder="Lý do không ký hồ sơ"
                    v-model="noteReason"
                    textarea
                    :rows="2"
                    class="pt-2"
                  ></v-text-field>
                </v-tab-item>
                <v-tab-item id="tabs-4" :key="3" reverse-transition="fade-transition" transition="fade-transition">
                  <p class="mb-2">Trình lại: <span class="text-bold">{{detailDossier['govAgencyName']}}</span></p>
                  Lý do:
                  <v-text-field
                    placeholder="Lý do trình lại hồ sơ"
                    v-model="noteReason"
                    textarea
                    :rows="2"
                    class="pt-2"
                  ></v-text-field>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  props: {
    detailDossier: {}
  },
  data: () => ({
    activeKS: true,
    noteReason: '',
    thongTinHoSo: {}
  }),
  created () {},
  mounted () {},
  methods: {}
}
</script>
