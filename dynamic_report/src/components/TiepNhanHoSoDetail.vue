<template>
  <div>
    uuuttttttttttt 12312 3123  1231
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
