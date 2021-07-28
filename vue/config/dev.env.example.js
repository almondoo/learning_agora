'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  AGORA_ID: '""',
  AGORA_TOKEN: '""',
  AGORA_CHANNEL: '""'
})
