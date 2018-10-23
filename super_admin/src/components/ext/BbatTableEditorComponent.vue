<template>
  <v-layout row wrap>
    <v-flex v-for="(item, index) in detailForm" v-bind:key="index" :class="item['class']">
      <v-text-field v-if="item.type === 'text-fields'"
        v-model="data[item.model]"
        :label="item['label']" 
        :placeholder="item['placeholder']"
        box 
        clearable
      >
      </v-text-field>
      <v-textarea v-if="item.type === 'textarea'"
        v-model="data[item.model]"
        :label="item['label']" 
        :placeholder="item['placeholder']"
        box 
        clearable
      ></v-textarea>
      <v-subheader class="px-0" v-if="item.type === 'codemirror'">{{item['label']}}</v-subheader>
      <codemirror v-if="item.type === 'codemirror'" v-model="data[item.model]" :options="cmOptions"></codemirror>
      <v-switch v-if="item.type === 'v-switch'"
        :label="item['label']" 
        v-model="data[item.model]"
      ></v-switch>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: ['tableConfig', 'detailData'],
    data() {
      return {
        data: {},
        detailForm: [],
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-light',
          lineNumbers: true,
          line: true,
        }
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function() {
        vm.detailForm = eval('( ' + eval('( ' + vm.tableConfig + ' )').detailColumns + ' )')
        vm.data = eval('( ' + vm.detailData + ' )')[0]
        console.log(vm.data)
      })
    },
    methods: {}
  }
</script>
