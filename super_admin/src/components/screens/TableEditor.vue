<template>
  <div>
    <bbat-table :table-name="tableName"></bbat-table>
  </div>
</template>

<script>
  import { BbatTable } from '@/components'

  export default {
    props: ['tableName'],
    components: {
      BbatTable
    },
    data () {
      return {
      }
    }
  }
</script>
