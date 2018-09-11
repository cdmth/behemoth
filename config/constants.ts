const defaultConfig = {
  PORT: process.env.PORT || 3000,
  apiKey: "AIzaSyAkpJiNiJ8PX18ETSBfiidnA_FZIKXazbU",
  authDomain: "behemoth-1f3a5.firebaseapp.com",
  databaseURL: "https://behemoth-1f3a5.firebaseio.com",
  projectId: "behemoth-1f3a5",
  storageBucket: "behemoth-1f3a5.appspot.com",
  messagingSenderId: "1023358943709"
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