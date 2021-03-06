const { isInvalidGender } = require('./util')

async function getUser (fetch, readFile, writeFile, logError, gender) {
  if (isInvalidGender(gender)) {
    throw new TypeError('gender must be male or female.');
  }

  let cached
  try {
    cached = await readFile('/tmp/cached-user.json', { encoding: 'utf8' })
  } catch (e) {
    logError(e)
  }

  try {
    if (cached) return JSON.parse(cached)
  } catch (e) {
    logError(e)
  }

  const res = await fetch(`https://randomuser.me/api/?gender=${gender}`)
  const user = await res.json()

  try {
    await writeFile('/tmp/cached-user.json', JSON.stringify(user), { encoding: 'utf8' })
  } catch (e) {
    logError(e)
  }

  return user
}

module.exports = {
  getUser
}
