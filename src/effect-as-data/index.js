const { runNode } = require('effects-as-data/node')
const { getUser } = require('./get-user')

runNode(getUser, 'female', { onFailure: console.error })
.then(r => r.payload)
.then(console.log)
.catch(console.error)
