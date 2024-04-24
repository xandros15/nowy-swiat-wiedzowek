import escape from 'escape-html'

const CODES_DEFAULT = {
  'USER_NO_SET': 'There is a problem with the username. Please log in again.',
  'NO_ROOM': 'There is a problem with finding a room. Please log in again.',
  'ROOM_NO_EXISTS': 'Specified room doesn\'t exist..',
  'INVALID_NICKNAME': 'The team name is incorrect.',
  'ERROR_USER_EXISTS': 'This team name is already taken.',
  'CONFIRM_DELETE_ROOM': 'Are you sure to remove this room?',
  'CONFIRM_RESET_SCORE': 'Are you sure to reset score?',
  'VALIDATION_CREATE_ROOM': 'Room name can contains only A-Za-z0-9_- and 3 to 16 characters.',
  'RECONNECTED': 'Reconnected.',
  'TAKEOVER_LABEL': 'Takeover position',
  'MODE_TAKEOVER': 'Takeover mode',
  'MODE_ANSWER': 'Answering mode',
  'NO_ANSWERS': 'There is no answer',
  'NO_TEAMS': 'Teams not found',
  'NO_TAKEOVERS': 'There are no takeovers',
  'ANSWER_LABEL': 'Answer',
  'ANSWER_ALT_LABEL': 'Additional info',
  'SEND_TEXT': 'Send',
  'TOO_SHORT_ANSWER': 'Your answer is too short',
  'TOO_LONG_ANSWER': 'Your answer is too long',
  'ANSWER_PLACEHOLDER': 'e.g. anime name',
  'ANSWER_ALT_PLACEHOLDER': 'e.g. artist',
  'NO_ROOMS': 'Sorry, there are no open rooms at this moment.',
  'ROOM_LIST': 'Room list',
  'INVALID_TEAM_NAME': 'Team name can\'t be shorter than 1 character nor longer than 16 characters.',

  'CREATE_ROOM_ERROR': 'Creating new room failed',
  'CREATE_ROOM_SUCCESS': 'Created new room',
  'LOGIN_ERROR': 'Login error',
  'RESET_ANSWER_ERROR': 'Reset answers error',
  'ANSWER_SENT': 'You sent your answer',
  'ANSWER_ALREADY_SENT': 'You\'ve already sent your answer',

  'GENERATE_QR_CODE': 'Generate QR code for the room',

  'HOST.POINTS.TITLE': 'Scores',
  'HOST.POINTS.TEAM_ADD': 'Add team',
  'HOST.POINTS.TEAM_NUMBER': 'Team number',
  'HOST.POINTS.TEAM_NAME': 'Team',
  'HOST.POINTS.TEAM_NAME_LABEL': 'nazwa drużyny',
  'HOST.POINTS.TEAM_POINTS': 'Fever',
  'HOST.POINTS.TEAM_FEVER': 'Points',
  'HOST.POINTS.TEAM_TIEBREAKERS': 'Tiebreakers',
  'HOST.POINTS.TEAM_OPTIONS': 'Controls',
  'HOST.POINTS.RESET': 'Reset Points',
  'HOST.POINTS.NEW_CARD': 'Open scoreboard in new tab',
  'HOST.TAKEOVER.TITLE': 'Takeovers',
  'HOST.TAKEOVER.TEAM_NAME': 'Team',
  'HOST.TAKEOVER.TEAM_TIME': 'Time*',
  'HOST.TAKEOVER.RESET': 'RESET TAKEOVERS',
  'HOST.TAKEOVER.TEAM_TIME_HINT': 'Time from the first takeover',

  'LOGIN.TITLE': 'Admin panel',
  'LOGIN.PASSWORD_LABEL': 'password',
  'LOGIN.BUTTON_LABEL': 'Log in',

  'JOIN.TITLE': 'Enter your team name and press "Join".',
  'JOIN.NAME_LABEL': 'team name',
  'JOIN.BUTTON_LABEL': 'Join',
  'JOIN.LAST_NICKNAMES': 'Recently used',

  'LOGOUT.BUTTON_LABEL': 'Logout',

  'STATUS_BAR.STATUS_LABEL': 'Status',

  'HOST.SCORESHEET.ADD_POINT': '+1 pt.',
  'HOST.SCORESHEET.ADD_3_POINTS': '+3 pts.',
  'HOST.SCORESHEET.ADD_TIEBREAKER': '+1 tie',
  'HOST.SCORESHEET.DEL_TIEBREAKER': '-1 tie',
  'HOST.SCORESHEET.DEL_POINT': '-1 pt.',
  'HOST.SCORESHEET.SET_ZERO': 'Reset',
  'HOST.SCORESHEET.DELETE': 'Delete',

  'HOST.ANSWERSHEET.TITLE': 'Answers',
  'HOST.ANSWERSHEET.TEAM_NAME': 'Team',
  'HOST.ANSWERSHEET.ANSWER': 'Answer',
  'HOST.ANSWERSHEET.ALT_ANSWER': 'Additional',
  'HOST.ANSWERSHEET.OPTIONS': 'Options',
  'HOST.ANSWERSHEET.LAST_ANSWER': 'Previously',
  'HOST.ANSWERSHEET.RESET': 'Reset answers',
  'HOST.ANSWERSHEET.DELETE': 'Delete',

  'HOST.ROOM_LIST.ROOM_NAME_LABEL': 'Room name',
  'HOST.ROOM_LIST.CREATE_BUTTON': 'Create Room',

  'SCOREBOARD.TITLE': 'Scoreboard',

  'HOST.SCORE.BATCH_ACTION': 'You can select answers for batch actions',
  'HOST.SCORE.POINT_LABEL': 'Points',
  'HOST.SCORE.TIEBREAKER_LABEL': 'Tiebreakers',
  'HOST.SCORE.SUBMIT': 'Submit',

}

const CODES_PL = {
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
  'NO_ROOMS': 'Przepraszam, nie ma aktualnie otwartych pokoi.',
  'ROOM_LIST': 'Lista pokoi',
  'INVALID_TEAM_NAME': 'Nazwa nie może być krótsza niż 1 znaki i dłuższa niż 16 znaków.',

  'CREATE_ROOM_ERROR': 'Błąd przy tworzeniu pokoju.',
  'CREATE_ROOM_SUCCESS': 'Pokój został stworzony.',
  'LOGIN_ERROR': 'Błąd przy logowaniu',
  'RESET_ANSWER_ERROR': 'Błąd przy resetowaniu odpowiedzi.',
  'ANSWER_SENT': 'Odpowiedź została wysłana.',
  'ANSWER_ALREADY_SENT': 'Wysłałeś już swoją odpowiedź.',


  'GENERATE_QR_CODE': 'Wygeneruj kod QR do pokoju',

  'HOST.POINTS.TITLE': 'Punktacja',
  'HOST.POINTS.TEAM_ADD': 'Dodaj drużynę',
  'HOST.POINTS.TEAM_NUMBER': 'Drużyna',
  'HOST.POINTS.TEAM_NAME': 'Drużyna',
  'HOST.POINTS.TEAM_NAME_LABEL': 'team name',
  'HOST.POINTS.TEAM_POINTS': 'Fever',
  'HOST.POINTS.TEAM_FEVER': 'Punkty',
  'HOST.POINTS.TEAM_TIEBREAKERS': 'Tiebreakery',
  'HOST.POINTS.TEAM_OPTIONS': 'Dodatki',
  'HOST.POINTS.RESET': 'Resetuj Punkty',
  'HOST.POINTS.NEW_CARD': 'Otwórz punktacje w innej karcie',

  'HOST.TAKEOVER.TITLE': 'Przejęcia',
  'HOST.TAKEOVER.TEAM_NAME': 'Drużyna',
  'HOST.TAKEOVER.TEAM_TIME': 'Czas*',
  'HOST.TAKEOVER.RESET': 'RESETUJ PRZEJĘCIA',
  'HOST.TAKEOVER.TEAM_TIME_HINT': 'Czas od pierwszego przejęcia',

  'LOGIN.TITLE': 'Admin panel',
  'LOGIN.PASSWORD_LABEL': 'hasło',
  'LOGIN.BUTTON_LABEL': 'Zaloguj się',

  'JOIN.TITLE': 'Wprowadź swoją nazwę drużyny i wciśnij "dołącz".',
  'JOIN.NAME_LABEL': 'nazwa drużyny',
  'JOIN.BUTTON_LABEL': 'Dołącz',
  'JOIN.LAST_NICKNAMES': 'Ostatnio używane',

  'LOGOUT.BUTTON_LABEL': 'Logout',

  'STATUS_BAR.STATUS_LABEL': 'Logout',

  'HOST.SCORESHEET.ADD_POINT': '+1 pkt',
  'HOST.SCORESHEET.ADD_3_POINTS': '+3 pkt',
  'HOST.SCORESHEET.ADD_TIEBREAKER': '+1 tie',
  'HOST.SCORESHEET.DEL_TIEBREAKER': '-1 tie',
  'HOST.SCORESHEET.DEL_POINT': '-1 pkt',
  'HOST.SCORESHEET.SET_ZERO': 'Wyzeruj',
  'HOST.SCORESHEET.DELETE': 'Usuń',

  'HOST.ANSWERSHEET.TITLE': 'Odpowiedzi',
  'HOST.ANSWERSHEET.TEAM_NAME': 'Drużyna',
  'HOST.ANSWERSHEET.ANSWER': 'Odpowiedź',
  'HOST.ANSWERSHEET.ALT_ANSWER': 'Dodatkowo',
  'HOST.ANSWERSHEET.OPTIONS': 'Opcje',
  'HOST.ANSWERSHEET.LAST_ANSWER': 'Ostatnio',
  'HOST.ANSWERSHEET.RESET': 'Resetuj Odpowiedzi',
  'HOST.ANSWERSHEET.DELETE': 'Usuń',

  'HOST.ROOM_LIST.ROOM_NAME_LABEL': 'Room name',
  'HOST.ROOM_LIST.CREATE_BUTTON': 'Create Room',

  'SCOREBOARD.TITLE': 'Punktacja',

  'HOST.SCORE.BATCH_ACTION': 'Możesz wybrać odpowiedzi do zbiorowych akcji',
  'HOST.SCORE.POINT_LABEL': 'Punkty',
  'HOST.SCORE.TIEBREAKER_LABEL': 'Tiebreaker',
  'HOST.SCORE.SUBMIT': 'Dodaj',
}

const getDictionary = () => {
  if (navigator.language) {
    let lang = navigator.language.split('-')[0]
    switch (lang){
      case 'pl':
        return CODES_PL
    }
  }
  return CODES_DEFAULT;
}

const dictionary = getDictionary();
const t = input => dictionary[input] || escape(input);

export default t
