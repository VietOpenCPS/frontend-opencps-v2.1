<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>

    </v-breadcrumbs>

    <v-card class="px-2 mx-1" style="overflow: hidden;">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-toolbar-title class="ml-3">
          Import dữ liệu
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon>
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <div style="overflow: hidden;overflow-x: scroll;">
        sdf
      </div>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: ['tableName'],
    data () {
      return {
        showFilter: false,
        breadCrumbsitems: [
          {
            text: 'Import',
            disabled: false
          },
          {
            text: 'XML/ZIP',
            disabled: false
          }
        ]
      }
    }
  }
</script>
