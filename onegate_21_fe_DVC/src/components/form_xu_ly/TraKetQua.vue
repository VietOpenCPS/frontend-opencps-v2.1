<template>
  <div class="traketqua">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>GIẤY TỜ KẾT QUẢ
        </div>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="resultFiles|filterFileResult"
              item-key="no"
              class="table-bordered"
              hide-actions
              :no-data-text="'Không có giấy tờ kết quả'"
            >
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center" style="width:5%"> {{ props.index + 1 }} </td>
                <td class="text-xs-left" style="width:10%"> {{ props.item.deliverableCode }} </td>
                <td class="text-xs-left" style="width:10%"> {{ props.item.createDate|dateTimeView }} </td>
                <td class="text-xs-left" style="width:75%"> {{props.item.displayName}} </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
  <!-- <v-dialog v-model="dialog_add_dined" persistent max-width="500px">
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="note_reason" placeholder="Nhập lý do từ chối" multi-line></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click.native="submitAddReason(note_reason)"
          :loading="loadingAction"
          :disabled="loadingAction"
        >
          Chấp nhận &nbsp;
          <span slot="loader">Loading...</span>
        </v-btn>
        <v-btn color="red darken-3" flat="flat" @click.native="dialog_add_dined = false"
          :loading="loadingAction"
          :disabled="loadingAction"
        >
          Bỏ qua &nbsp;
          <span slot="loader">Loading...</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>

<script>

export default {
  props: {
    resultFiles: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dossierId: '',
    loadingAction: false,
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số giấy',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày cấp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên giấy tờ',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {})
  },
  methods: {},
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
      } else {
        return ''
      }
    },
    filterFileResult (arg) {
      if (arg.length > 0) {
        let resultFilter = []
        resultFilter = arg.filter((val, index) => {
          return (val.dossierPartType === 2 && val.eForm === false)
        })
        return resultFilter
      }
    }
  }
}
</script>
