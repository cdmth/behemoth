const entryBillSchema = 
`
  type EntryBill {
    entryId: String!
    billId: String!
  }

  type Query {
    getBillByEntryId(entryId: String!) : Bill
  } 

  type Mutation {
    createBillEntry(entryId: String!, billId: String!): EntryBill
    updateEntryBill(entryId: String!, billId: String!): EntryBill
    deleteEntryBill(_id: String!): Status
  }
`

export default entryBillSchema