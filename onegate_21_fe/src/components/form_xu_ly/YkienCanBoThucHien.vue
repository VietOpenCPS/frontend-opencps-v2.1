<template>
  <v-expansion-panel :value="[true]" expand  class="expansion-pl ext__form">
    <v-expansion-panel-content>
      <div slot="header">
        <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
        <span>Ý kiến của cán bộ</span> <span v-if="user_note === 2" class="red--text">&nbsp; *</span>
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
                  :rules="user_note === 2 ? [() => noteYkien !== '' || 'Trường dữ liệu bắt buộc', rules.varchar5000] : [rules.varchar5000]"
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
      valid: false,
      rules: {
        required: (value) => !!value || 'Thông tin bắt buộc',
        cmndHoChieu: (value) => {
          const pattern = /^(?![0-9]{4,12})[0-9a-zA-Z]{4,12}$/
          return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 4-12 ký tự'
        },
        email: (value) => {
          value = value.trim()
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
        },
        passWord: (value) => {
          const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
          return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
        },
        telNo: (value) => {
          const pattern = /^([0-9]{0,})$/
          if(typeof value === 'string'){
            value = value.trim()
          }
          return pattern.test(value) || 'Gồm các ký tự 0-9'
        },
        varchar50: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
          } else {
            return true
          }  
        },
        varchar100: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 100 ? true : 'Không được nhập quá 100 ký tự'   
          } else {
            return true
          }
        },
        varchar255: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 255 ? true : 'Không được nhập quá 255 ký tự'   
          } else {
            return true
          }  
        },
        varchar500: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 500 ? true : 'Không được nhập quá 500 ký tự'   
          } else {
            return true
          }  
        },
        varchar5000: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
          } else {
            return true
          }
        },
      },
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
