const createDeliverable = `
    mutation OpenCPSDeliverable {
        createDeliverable(
            body: INPUTBODY
        ) {
            deliverableId
        }
    }
`

export default {
    createDeliverable
}