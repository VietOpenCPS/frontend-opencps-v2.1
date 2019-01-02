<template>
    <a :download="downloadname" :href="downloadUrl" :disabled="this.data.length === 0">
       <v-icon>receipt</v-icon> &nbsp; Export CSV
    </a>
</template>

<script>
import json2csv from 'json2csv';
export default {
    props: {
        fields: undefined,
        data: undefined,
        downloadname: 'export.csv'
    },
    data: () => ({
        dataToExport: ''
    }),
    created () {
        var vm = this
        vm.$nextTick(function () {
            let rawHeader = json2csv({fields: this.fields}) + '\n'
            let rawData = json2csv({data: this.data})
            let lines = rawData.split('\n');
            lines.splice(0,1);
            let newtext = rawHeader + lines.join('\n');
            vm.dataToExport = newtext
            console.log('dataToExport', vm.dataToExport)
        })
    },
    computed: {
        downloadUrl() {
            return this.data.length > 0 ? "data:text/csv;charset=UTF-8,%EF%BB%BF" + encodeURIComponent(this.dataToExport) : 'javascript:void(0);';
        }
    }
}
</script>