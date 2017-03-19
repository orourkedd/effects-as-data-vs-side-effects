const { getUser } = require('./get-user')
const { actions, failure, success } = require('effects-as-data/node')
const { testIt } = require('effects-as-data/test')

const testGetUser = testIt(getUser)

describe('getUser()', () => {
  describe('argument validation', () => {
    it('should return an error for invalid gender', testGetUser(() => {
      return [
        [null, failure('gender must be male or female.')]
      ]
    }))
  })

  describe('on cache hit', () => {
    it('should return user from cache', testGetUser(() => {
      const user = { id: 123 }
      return [
        ['male', actions.readFile('/tmp/cached-user.json', { encoding: 'utf8' })],
        [JSON.stringify(user), actions.jsonParse(JSON.stringify(user))],
        [user, success(user)]
      ]
    }))

    it('should not return result from cache if invalid json', testGetUser(() => {
      const user = { id: 123 }
      return [
        ['male', actions.readFile('/tmp/cached-user.json', { encoding: 'utf8' })],
        ['invalid-json', actions.jsonParse('invalid-json')],
        [failure(), actions.httpGet(`https://randomuser.me/api/?gender=male`)],
        [user, actions.writeFile('/tmp/cached-user.json', JSON.stringify(user), { encoding: 'utf8' })],
        [null, success(user)]
      ]
    }))
  })

  describe('on cache miss', () => {
    it('should cache miss, fetch user, set user in cache', testGetUser(() => {
      const user = { id: 123 }
      return [
        ['male', actions.readFile('/tmp/cached-user.json', { encoding: 'utf8' })],
        [null, actions.httpGet(`https://randomuser.me/api/?gender=male`)],
        [user, actions.writeFile('/tmp/cached-user.json', JSON.stringify(user), { encoding: 'utf8' })],
        [null, success(user)]
      ]
    }))
  })
})
