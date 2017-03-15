const { run } = require('effects-as-data')
const standardHandlers = require('effects-as-data/lib/handlers/standard')
const nodeHandlers = require('effects-as-data/lib/handlers/node')
const httpHandlers = require('effects-as-data-http').handlers
const { getUser } = require('./get-user')

//  Combine handlers
const handlers = Object.assign({}, standardHandlers, nodeHandlers, httpHandlers)

run(handlers, getUser, 'female', { onFailure: console.error })
.then((result) => {
  console.log(result.payload)
})
.catch(console.error)
