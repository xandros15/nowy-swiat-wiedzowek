const CODES = {
  'ERROR_USER_NO_SET': 'Problem z nazwą użytkownika. Proszę, zaloguj się ponownie.',
  'ERROR_NO_ROOM': 'Problem z odnalezieniem pokoju. Proszę, zaloguj się ponownie.',
}

function t (input) {
  return CODES[input] || input
}

export default {t}
