const httpActions = require('effects-as-data-http').actions
const nodeActions = require('effects-as-data/lib/actions/node')
const standardActions = require('effects-as-data/lib/actions/standard')

module.exports = Object.assign({}, httpActions, nodeActions, standardActions)
