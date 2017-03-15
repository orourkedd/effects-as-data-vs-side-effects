const { getUser } = require('./get-user')
const { deepEqual } = require('assert')
const sinon = require('sinon')

describe('getUser()', () => {
  describe('argument validation', () => {
    it('should return an error for invalid gender', () => {
      return getUser()
      .then(() => {
        fail('getUser did not throw error')
      })
      .catch((e) => {
        deepEqual(e.message, 'gender must be male or female.')
      })
    })
  })

  describe('on cache hit', () => {
    it('should return user from cache', () => {
      const user = { id: 123 }
      const readFile = sinon.stub().returns(Promise.resolve(JSON.stringify(user)))
      const fetch = sinon.stub()
      const writeFile = sinon.spy()
      const logError = sinon.spy()

      return getUser(fetch, readFile, writeFile, logError, 'male')
      .then((result) => {
        deepEqual(readFile.calledWith('/tmp/cached-user.json', { encoding: 'utf8' }), true)
        deepEqual(result, user)
      })
    })
  })

  describe('on cache miss', () => {
    it('should cache miss, fetch user, set user in cache', () => {
      const user = { id: 123 }
      const readFile = sinon.spy()
      const fetch = sinon.stub().returns(Promise.resolve({
        json: () => Promise.resolve(user)
      }))
      const writeFile = sinon.spy()
      const logError = sinon.spy()

      return getUser(fetch, readFile, writeFile, logError, 'male')
      .then(() => {
        deepEqual(readFile.calledWith('/tmp/cached-user.json', { encoding: 'utf8' }), true)
        deepEqual(fetch.firstCall.args[0], 'https://randomuser.me/api/?gender=male')
        deepEqual(writeFile.calledWith('/tmp/cached-user.json', JSON.stringify(user), { encoding: 'utf8' }), true)
      })
    })
  })
})
