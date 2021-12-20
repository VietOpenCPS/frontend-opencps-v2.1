<template>
  <div>
    <!-- <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      ">{{tableName}}</a>
    </v-breadcrumbs> -->

    <v-card class="px-2 mx-1" style="overflow: hidden;">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>merge_type</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{nameScreen}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-2">
        <div id="mermaid_dossier" class="mermaid"></div>
      </div>
      <v-alert v-if="noDetail"
        :value="true"
        color="warning"
        icon="priority_high"
        outline
      >
      Không tìm thấy dữ liệu
    </v-alert>
    </v-card>
  </div>
</template>

<script>
  import mermaid from 'mermaid'
  mermaid.initialize({
    theme: 'forest',
    startOnLoad: false
  })
  export default {
    props: ['tableName', 'id'],
    data () {
      return {
        breadCrumbsitems: [
          {
            text: 'Bảng dữ liệu',
            disabled: false
          },
          {
            text: '',
            disabled: false
          }
        ],
        nameScreen: 'Chi tiết biểu đồ quy trình',
        showDetailForm: false,
        noDetail: false,
        dataSocket: {}
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.noDetail = false
        vm.loadMermaidgraph()
      })
    },
    methods: {
      backToList () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let currentPath = current.path
        let queryString = '?'
        newQuery['state_change'] = '0'
        newQuery['renew'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
        vm.$router.push({
          path: currentPath.substring(0, currentPath.indexOf('/flowchart/')) + queryString
        })
      },
      loadMermaidgraph () {
        var vm = this
        vm.showDetailForm = false
        document.getElementById('mermaid_dossier').innerHTML = ''
        vm.$store.dispatch('loadMermaidgraph', vm.id).then(chartData => {
          mermaid.render('theGraph', chartData, function (svgCode) {
            document.getElementById('mermaid_dossier').innerHTML = svgCode
            vm.showDetailForm = true
          })
          setTimeout(function () {
            window.svgPanZoom('#theGraph', {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1
            })
          }, 500)
        })
      }
    }
  }
</script>
