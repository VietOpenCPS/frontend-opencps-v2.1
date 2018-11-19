<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>1312312313</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          123123
          <v-fade-transition>
            <div
            class="adv__search_container"
            >
            </div>
          </v-fade-transition>
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
          <v-btn icon class="my-0 mx-2">
            <v-icon size="16">filter_list</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
  export default {
    props: ['index'],
    data () {
      return {
        dataSocket: {}
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
      })
    },
    methods: {
    }
  }
</script>
