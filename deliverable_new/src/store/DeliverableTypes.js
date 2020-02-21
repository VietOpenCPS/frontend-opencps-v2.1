const getDeliverableTypes = `
    {
        getDeliverableTypes(start: -1, end: -1) {
            typeCode
            typeName
            formScriptFileId
            formReportFileId
            dataConfig
            tableConfig
            moderator
        }
    }
`

export default {
    getDeliverableTypes
}