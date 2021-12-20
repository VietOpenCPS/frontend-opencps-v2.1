<template>
  <div>
    <bbat-table-editor :table-name="tableName" :id="id"></bbat-table-editor>
  </div>
</template>

<script>
  import { BbatTableEditor } from '@/components'

  export default {
    props: ['tableName', 'id'],
    components: {
      BbatTableEditor
    },
    data () {
      return {
      }
    }
  }
</script>
