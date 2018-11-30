<template>
  <div>
    <div class="list_history_style" v-for="(item, indexHistory) in logs" v-bind:key="indexHistory">
      <td class="px-2 pt-2 col-tien-trinh-2">{{indexHistory}}</td>
      <td class="text-xs-left px-2 py-2">
        <p class="mb-1"><span>{{item.actionDate}}</span> - <b>{{item.author}}</b> : <span style="color: rgb(11, 114, 186);">{{support['state_' + item.deliverableAction]}}</span></p>
      </td>
    </div>
  </div>
</template>

<script>
  import support from '../../store/support'
  export default {
    props: ['id', 'datainput'],
    data() {
      return {
        support: support.deliverableState,
        dialogPDFLoading: true,
        isCallBack: true,
        pdfBlob: null,
        logs: []
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function() {
        setTimeout(() => {
          console.log(vm.support.deliverableState)
          vm.pullLogs()
        }, 100)
      })
    },
    methods: {
      pullLogs() {
        let vm = this
        vm.$store.dispatch('viewLogs', vm.id).then(function(result) {
          vm.logs = result
        })
      }
    }
  }
</script>
