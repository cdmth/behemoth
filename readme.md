<h1 align="center">
  Behemoth starter
</h1>

Kick off your project with this default boilerplate.


## 🚀 Get started

1.  **yarn install**

    Recommend to install Typescript globally

    ```sh
    # install the Gatsby CLI globally
    npm install -g typescript
    ```

2.  **Launch app**

    ```sh
    yarn run dev
    ```

    "dev": "cross-env NODE_ENV=development tsc --watch | cross-env NODE_ENV=development nodemon ./build/src/app.js --watch build" WUUT?

    Okay launch script seems a bit hardcore, but try:
    
    cross-env = passes 'development' -variable to the app
    tsc --watch = typescript compiler watches the /src -folder for changes and compiles it to /build
    nodemon ... --watch build = Watches /build -folder and runs it :)

    You can find those separately with following commands for debugging:
    ```sh
    yarn run compile #"cross-env NODE_ENV=development tsc --watch",
    yarn run nodemon #"cross-env NODE_ENV=development nodemon ./build/src/app.js --watch build"
    ```

3.  **Start developing.**

