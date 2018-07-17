<template>  
  <div class="phancong" style="background-color: white">
    <div xs12>
      <div class="mb-2">{{title_asign[type]}}:</div>
      <div class="ml-3" v-for="(item, index) in data_phancong" v-bind:key="item.userId" style="display: inline-block">
        <v-layout wrap v-if="type === 1">
          <v-flex>
            <v-checkbox v-model="item.assigned"
            @change = 'changeAssigned($event, index)'
            ></v-checkbox>
          </v-flex>
          <v-flex class="pt-1">
            <span>{{item.userName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </v-flex>
        </v-layout>

        <v-layout wrap v-else class="my-1">
          <v-flex class="pt-1">{{item.userName}}</v-flex> &nbsp; &nbsp;
          <v-flex>
            <v-select
              :items="assignedtype_items[type]"
              :value="item.assigned"
              item-text="text"
              item-value="value"
              return-object
              hide-selected
              @change = 'changeAssigned($event, index)'
              style="max-width: 160px"
            ></v-select>
          </v-flex>
          &nbsp; &nbsp;
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    assign_items: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: () => 1
    }
  },
  model: {
    prop: 'assign_items'
  },
  data: () => ({
    data_phancong: [],
    assignedtype_items: {
      '2': [
        {text: 'Không có phân công', value: 0},
        {text: 'Thực hiện chính', value: 1},
        {text: 'Thực hiện phối hợp', value: 2}
      ],
      '3': [
        {text: 'Không có phân công', value: 0},
        {text: 'Thực hiện chính', value: 1},
        {text: 'Thực hiện phối hợp', value: 2},
        {text: 'Theo dõi', value: 3}
      ]
    },
    title_asign: {
      '1': 'Phân công người thực hiện',
      '2': 'Phân công thực hiện và phối hợp',
      '3': 'Phân công thực hiện, phối hợp và theo dõi'
    }
  }),
  mounted () {
    this.data_phancong = this.assign_items
  },
  methods: {
    changeAssigned (event, index) {
      var vm = this
      if (vm.type === 1) {
        if (event === true) {
          vm.assign_items[index].assigned = 1
        } else {
          vm.assign_items[index].assigned = 0
        }
      } else {
        vm.assign_items[index].assigned = event.value
      }
      // vm.data_pc = vm.assign_items
      // vm.$emit('change', vm.data_pc)
    }
  }
}
</script>

