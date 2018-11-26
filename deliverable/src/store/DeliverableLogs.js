const getDeliverableLogs = `
    {
        getDeliverableLogs(fk: INPUTBODY,start: -1, end: -1) {
            actionDate
            author
            deliverableAction
        }
    }
`

export default {
    getDeliverableLogs
}