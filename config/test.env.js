'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_URL : '"/"',
  VUE_APP_BASE_API: '"/prod-api"'
})
