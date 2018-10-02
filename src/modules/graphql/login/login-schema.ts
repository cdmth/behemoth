const loginSchema = `
  type Token {
    token: String
  }

  type Mutation {
    createAccount(
      email: String!,
      password: String!
    ): Token

    login(
      email: String!,
      password: String!
    ): Token
  }
`

export default loginSchema