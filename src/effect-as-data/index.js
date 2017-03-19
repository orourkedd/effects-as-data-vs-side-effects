const { run } = require('effects-as-data/node')
const { getUser } = require('./get-user')

run(getUser, 'female', { onFailure: console.error })
.then(r => r.payload)
.then(console.log)
.catch(console.error)
