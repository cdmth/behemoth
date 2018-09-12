import Entry from '../entry/Entry'

const Project = 
  Entry + 
  `
  type Project {
    name: String
    entries: [Entry]
  }
`

export default Project