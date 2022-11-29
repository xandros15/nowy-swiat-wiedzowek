import escape from 'escape-html'

const CODES = {
  'USER_NO_SET': 'Problem z nazwą użytkownika. Proszę, zaloguj się ponownie.',
  'NO_ROOM': 'Problem z odnalezieniem pokoju. Proszę, zaloguj się ponownie.',
  'ROOM_NO_EXISTS': 'Dany pokój nie istnieje.',
  'INVALID_NICKNAME': 'Nazwa drużyny jest niewłaściwa.',
  'USER_EXISTS': 'Nazwa drużyny jest już w użyciu.',
  'CONFIRM_DELETE_ROOM': 'Are you sure to remove this room?',
  'CONFIRM_RESET_SCORE': 'Are you sure to reset score?',
  'VALIDATION_CREATE_ROOM': 'Room name can contains only A-Za-z0-9_- and 3 to 16 characters.',
  'RECONNECTED': 'Połączono ponownie.',
}

function t (input) {
  return CODES[input] || escape(input)
}

export default t
