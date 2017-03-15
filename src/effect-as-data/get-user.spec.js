const { getUser } = require('./get-user')
const { failure, success } = require('effects-as-data')
const { testIt } = require('effects-as-data/test')
const { readFile, writeFile } = require('effects-as-data/lib/actions/node')
const { httpGet } = require('effects-as-data-http').actions
const { logError, jsonParse } = require('effects-as-data/lib/actions/standard')

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
        ['male', readFile('/tmp/cached-user.json', { encoding: 'utf8' })],
        [JSON.stringify(user), jsonParse(JSON.stringify(user))],
        [user, success(user)]
      ]
    }))

    it('should not return result from cache if invalid json', testGetUser(() => {
      const user = { id: 123 }
      return [
        ['male', readFile('/tmp/cached-user.json', { encoding: 'utf8' })],
        ['invalid-json', jsonParse('invalid-json')],
        [failure(), httpGet(`https://randomuser.me/api/?gender=male`)],
        [user, writeFile('/tmp/cached-user.json', JSON.stringify(user), { encoding: 'utf8' })],
        [null, success(user)]
      ]
    }))
  })

  describe('on cache miss', () => {
    it('should cache miss, fetch user, set user in cache', testGetUser(() => {
      const user = { id: 123 }
      return [
        ['male', readFile('/tmp/cached-user.json', { encoding: 'utf8' })],
        [null, httpGet(`https://randomuser.me/api/?gender=male`)],
        [user, writeFile('/tmp/cached-user.json', JSON.stringify(user), { encoding: 'utf8' })],
        [null, success(user)]
      ]
    }))
  })
})
