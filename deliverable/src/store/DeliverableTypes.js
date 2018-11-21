const getDeliverableTypes = `
    {
        getDeliverableTypes(start: -1, end: -1) {
            typeCode
            typeName
            dataConfig
            tableConfig
        }
    }
`

export default {
    getDeliverableTypes
}