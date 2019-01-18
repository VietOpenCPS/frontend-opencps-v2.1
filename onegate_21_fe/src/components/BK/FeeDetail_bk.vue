<template>
  <div style="position: relative;">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header" style="margin-top: 6px;">
      <div class="background-triangle-big"> CHI TIẾT PHÍ </div> 
      <div class="layout row wrap header_tools row-blue">
        <div class="flex solo text-ellipsis">

        </div> 
        <div class="flex text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <!-- <div slot="header"><div class="background-triangle-small"> V. </div>LỆ PHÍ</div> -->
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                <v-subheader v-else class="pl-0 text-right">Tổng tiền: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-text-field
                  v-else
                  v-model.lazy="lePhi.fee"
                  v-money="money"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>

              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-right">Ghi chú: </v-subheader>
              </v-flex>
              <v-flex xs12 sm10>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-text-field
                  v-else
                  v-model="lePhi.feeNote"
                  multi-line
                  rows="2"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
const COMPONENT_NAME = 'fee-detail'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String
  },
  data: () => ({
    lePhi: {
      fee: 1222222,
      feeNote: 'Le phi'
    }
  }),
  methods: {
    initData: function (data) {
      var vm = this
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.lePhi = resultDossier
      })
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
