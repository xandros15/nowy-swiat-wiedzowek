import escape from 'escape-html'

const CODES = {
  'USER_NO_SET': 'Problem z nazwą użytkownika. Proszę, zaloguj się ponownie.',
  'NO_ROOM': 'Problem z odnalezieniem pokoju. Proszę, zaloguj się ponownie.',
  'ROOM_NO_EXISTS': 'Dany pokój nie istnieje.',
  'INVALID_NICKNAME': 'Nazwa drużyny jest niewłaściwa.',
  'ERROR_USER_EXISTS': 'Nazwa drużyny jest już w użyciu.',
  'CONFIRM_DELETE_ROOM': 'Are you sure to remove this room?',
  'CONFIRM_RESET_SCORE': 'Are you sure to reset score?',
  'VALIDATION_CREATE_ROOM': 'Room name can contains only A-Za-z0-9_- and 3 to 16 characters.',
  'RECONNECTED': 'Połączono ponownie.',
  'TAKEOVER_LABEL': 'Pozycja przejęcia',
  'MODE_TAKEOVER': 'Tryb przejęcia',
  'MODE_ANSWER': 'Tryb odpowiedzi',
  'NO_ANSWERS': 'Nie ma odpowiedzi',
  'NO_TEAMS': 'Nie znaleziono drużyn',
  'NO_TAKEOVERS': 'Nie ma przejęć',
  'ANSWER_LABEL': 'Odpowiedź',
  'ANSWER_ALT_LABEL': 'Dodatkowe dane',
  'SEND_TEXT': 'Wyślij',
  'TOO_SHORT_ANSWER': 'Twoja odpowiedź jest za krótka',
  'TOO_LONG_ANSWER': 'Twoja odpowiedź jest za długa',
  'ANSWER_PLACEHOLDER': 'np. nazwa anime',
  'ANSWER_ALT_PLACEHOLDER': 'np. wykonawca',
}

function t (input) {
  return CODES[input] || escape(input)
}

export default t
