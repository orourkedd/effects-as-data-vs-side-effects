const { actions, isFailure, isSuccess, failure, success } = require('effects-as-data/node')
const { isInvalidGender } = require('./util')

function * getUser (gender) {
  if (isInvalidGender(gender)) return failure('gender must be male or female.')
  const cached = yield actions.readFile('/tmp/cached-user.json', { encoding: 'utf8' })
  if (cached.payload) {
    const parsed = yield actions.jsonParse(cached.payload)
    if (isSuccess(parsed)) return parsed
  }
  const user = yield actions.httpGet(`https://randomuser.me/api/?gender=${gender}`)
  yield actions.writeFile('/tmp/cached-user.json', JSON.stringify(user.payload), { encoding: 'utf8' })
  return user
}

module.exports = {
  getUser
}
