<template>
  <div>
    9816313910231203 99 9 99 99 9 9 99 x11312312 31 31231
    <v-layout wrap>
      <div>
        <v-chip v-for="(item, index) in dossierCounting" v-bind:key="index">
          <v-avatar v-if="item.key === 'deleted'"><v-icon size="16">delete</v-icon></v-avatar>
          <v-avatar v-else>{{item.count}}</v-avatar>
          {{item.title}}
        </v-chip>
      </div>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: ['index'],
  data: () => ({
    dossierCounting: []
  })
}
</script>
