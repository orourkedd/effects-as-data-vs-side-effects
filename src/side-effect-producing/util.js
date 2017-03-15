function isInvalidGender (gender) {
  return !['male', 'female'].includes(gender)
}

module.exports = {
  isInvalidGender
}
