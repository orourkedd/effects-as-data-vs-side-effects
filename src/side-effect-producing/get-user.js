async function getUser (fetch, readFile, writeFile, logError, gender) {
  if (isNotValidGender(gender)) {
    return Promise.reject(new TypeError('gender must be male or female.'));
  }

  let cached
  try {
    cached = await readFile('/tmp/cached-user.json', { encoding: 'utf8' })
  } catch (e) {
    //  Do nothing for cache miss
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

function isNotValidGender (gender) {
  return !['male', 'female'].includes(gender)
}

module.exports = {
  getUser
}
