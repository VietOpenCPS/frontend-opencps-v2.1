const getDynamicReports = `
    {
        getDynamicReports(start: -1, end: -1) {
            reportCode
            reportName
            filterConfig
            tableConfig
            userConfig
        }
    }
`

export default {
    getDynamicReports
}