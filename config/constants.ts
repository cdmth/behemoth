const defaultConfig = {
  PORT: process.env.PORT || 3000,
}

const config = {
  development: {
    JWT_SECRET: 'secret'
  },
  test: {
    JWT_SECRET: 'secret'
  }
}

function getEnv(env:string) {
  return config[env]
}

export default {
  ...defaultConfig,
  ...getEnv(process.env.NODE_ENV)
}