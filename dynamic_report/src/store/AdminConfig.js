const getDynamicReports = `
    {
        getDynamicReports(start: -1, end: -1) {
            dynamicReportId
            reportCode
            reportName
            filterConfig
            tableConfig
            userConfig
            sharing
        }
    }
`
const updateDynamicReport = `
    mutation {
        updateDynamicReport(
            body: "INPUTBODY"
        ) {
            dynamicReportId
        }
    }
`

export default {
    getDynamicReports,
    updateDynamicReport
}