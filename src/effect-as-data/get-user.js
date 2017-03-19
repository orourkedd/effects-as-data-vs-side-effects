const { isFailure, isSuccess, failure, success } = require('effects-as-data')
const { readFile, httpGet, writeFile, jsonParse } = require('effects-as-data/node')
const { isInvalidGender } = require('./util')

function * getUser (gender) {
  if (isInvalidGender(gender)) return failure('gender must be male or female.')
  const cached = yield {
    type: 'node',
    module: 'fs',
    function: 'readFile',
    args: ['/tmp/cached-user.json', { encoding: 'utf8' }]
  }

  if (cached.payload) {
    const parsed = yield {
      type: 'jsonParse',
      payload: cached.payload
    }
    if (isSuccess(parsed)) return parsed
  }
  const user = yield {
    type: 'httpGet',
    url: `https://randomuser.me/api/?gender=${gender}`,
    headers: {},
    options: {}
  }
  yield {
    type: 'node',
    module: 'fs',
    function: 'writeFile',
    args: ['/tmp/cached-user.json', JSON.stringify(user.payload), { encoding: 'utf8' }]
  }
  return user
}

module.exports = {
  getUser
}
