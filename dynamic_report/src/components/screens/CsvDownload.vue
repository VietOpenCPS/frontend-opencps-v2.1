<template>
    <v-btn flat class="mx-0 my-0" v-on:click.native="doDownloadXlsx">
       <v-icon>receipt</v-icon> &nbsp; Tải xuống XLSX
    </v-btn>
</template>

<script>
import json2csv from 'json2csv';
export default {
    props: {
        fields: undefined,
        data: undefined,
        downloadname: 'export.pdf',
        pdfblob: null
    },
    data: () => ({
        dataToExport: '',
        myPdfToConvert: null
    }),
    created () {
        var vm = this
        vm.$nextTick(function () {
            vm.myPdfToConvert = new File([vm.pdfblob], vm.downloadname, {lastModified: new Date().getTime()})
        })
    },
    computed: {
        downloadUrl() {
            return this.data.length > 0 ? "data:text/csv;charset=UTF-8,%EF%BB%BF" + encodeURIComponent(this.dataToExport) : 'javascript:void(0);';
        }
    },
    methods: {
        doDownloadXlsx () {
            let vm = this
            let filter = {
                file: vm.myPdfToConvert
            }
            console.log(filter)
            vm.$store.dispatch('doExportXlsx', filter)
        }
    }
}
</script>