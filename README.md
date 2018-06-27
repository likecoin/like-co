# likecoin-store

[![Greenkeeper badge](https://badges.greenkeeper.io/likecoin/likecoin-store.svg)](https://greenkeeper.io/)

[![CircleCI](https://circleci.com/gh/likecoin/likecoin-store.svg?style=svg)](https://circleci.com/gh/likecoin/likecoin-store) [![NSP Status](https://nodesecurity.io/orgs/likecoin/projects/00271dff-3cf8-4b38-8f70-ab2252205c4a/badge)](https://nodesecurity.io/orgs/likecoin/projects/00271dff-3cf8-4b38-8f70-ab2252205c4a)[![codecov](https://codecov.io/gh/likecoin/likecoin-store/branch/master/graph/badge.svg)](https://codecov.io/gh/likecoin/likecoin-store)

> Like.co, official site of LikeCoin Foundation

## Essential Folder structure
```bash
├── components # Vue components
├── layouts # nuxt layouts
├── locales # i18n locale files
│   ├── client # client side i18n handled by vue-i18n
│   └── server # server side i18n handled by i18n
├── middleware # nuxt middleware
├── pages # actual with automated router pages
├── plugins # nuxt plugins
├── server # express server
│   ├── api # server apis
│   ├── config # server config and credentials
│   └── util # misc server side libraries
├── static # static asset
├── store # vuex store
├── backpack.config.js # server builder config
└── nuxt.config.js # nuxt config
```

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Backpack

We use [backpack](https://github.com/palmerhq/backpack) to watch and build the application, so you can use the latest ES6 features (module syntax, async/await, etc.).
