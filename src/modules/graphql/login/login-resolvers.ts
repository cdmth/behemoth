import { createAccount, login } from '../../firebase/index'

const loginResolvers = {
  Mutation: {
    createAccount: (_, args) => createAccount(args),
    login: (_, args) => login(args)
  }
}

export default loginResolvers