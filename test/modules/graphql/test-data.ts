export const testId = '1234'
export const testId2 = '4321'
export const testString = 'Dog'
export const testString2 = 'Cat'
export const testFloat = 12.23

const plainProject = {
  name: testString
}

const plainEntry = {
  description: testString
}

const plainWorker = {
  name: testString
}

export const mocks = {
  Float: () => testFloat,
  String: () => testString
}

export const nameObject = {
  name: testString
}

export const bill = {
  hours: testFloat
}

export const project = {
  name: testString,
  customerId: testString,
  bills: [bill, bill],
  entries: [plainEntry, plainEntry],
  workers: [nameObject, nameObject]
}

export const customer = { 
  name: testString,
  businessId: testString,
  projects: [nameObject, nameObject],
  bills: [bill, bill]
}

export const entry = {
  description: testString,
  bill: bill,
  project: plainProject,
  worker: plainWorker
}

export const worker = {
  name: testString,
  projects: [nameObject, nameObject],
  entries: [plainEntry, plainEntry]
}

