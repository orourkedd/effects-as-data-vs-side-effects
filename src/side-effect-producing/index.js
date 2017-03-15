const fetch = require('isomorphic-fetch');
const fs = require('fs')
const { promisify } = require('bluebird')
const { getUser } = require('./get-user')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const logError = console.error

getUser(fetch, readFile, writeFile, logError, 'female')
.then(console.log)
.catch(console.error)
