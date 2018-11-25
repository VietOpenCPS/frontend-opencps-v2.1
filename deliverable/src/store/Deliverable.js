const createDeliverable = `
    mutation {
        createDeliverable(
            body: "INPUTBODY"
        ) {
            deliverableId
        }
    }
`

export default {
    createDeliverable
}