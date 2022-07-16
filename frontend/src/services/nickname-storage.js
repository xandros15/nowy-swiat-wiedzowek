const PREFIX = 'quiz-answer.'
const KEY = PREFIX + 'nicknames'
const MAX_NICKNAMES = 3

const jsonNicknames = localStorage.getItem(KEY)
let nicknames = jsonNicknames ? JSON.parse(jsonNicknames) : []

function addNickname (nickname) {
  if (nicknames.indexOf(nickname) === -1) {
    nicknames.unshift(nickname)
    while (nicknames.length > MAX_NICKNAMES) {
      nicknames.pop()
    }
    localStorage.setItem(KEY, JSON.stringify(nicknames))
  }
}

function getNicknames () {
  return nicknames
}

function forgotNickname (nickname) {
  nicknames = nickname.filter(n => n !== nickname)
  localStorage.setItem(KEY, JSON.stringify(nicknames))
}

export {
  getNicknames,
  addNickname,
  forgotNickname,
}
