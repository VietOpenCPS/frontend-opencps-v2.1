<template>
  <v-expansion-panel :value="[true]" expand  class="expansion-pl ext__form">
    <v-expansion-panel-content>
      <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
      <!-- <span v-if="configNote && configNote.labelYKien">{{configNote.labelYKien}}</span> -->
      <span>Ý kiến chính thức</span> <span v-if="user_note === 2" class="red--text text--darken-3">*</span>
      </div>
      <v-card>
        <v-card-text class="py-2 px-4">
          <v-layout wrap>
            <v-flex xs12>
              <v-form v-model="valid" ref="userNoteForm">
                <v-text-field
                  v-model.lazy="noteYkien"
                  multi-line
                  :rows="4"
                  :rules="user_note === 2 ? [() => noteYkien !== '' || 'Trường dữ liệu bắt buộc'] : []"
                  box
                  label="Nhập ý kiến"
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
  export default {
    props: {
      user_note: {
        type: Number,
        required: true
      },
      configNote: {
        type: Object,
        required: false
      }
    },
    data: () => ({
      noteYkien: '',
      valid: false
    }),
    methods: {
      initData (data) {
        var vm = this
        vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
          vm.thongTinChiTietHoSo = resultDossier
        })
      },
      doExport () {
        let vm = this
        let exportData = {
          text: vm.noteYkien,
          valid: vm.$refs.userNoteForm.validate()
        }
        return exportData
      }
    }
  }
</script>
