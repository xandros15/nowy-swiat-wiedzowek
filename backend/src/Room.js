function Room({name, scores, answers, owner, takeovers, history}) {
    const room = {
        name: name,
        scores: scores,
        answers: answers,
        owner: owner,
        takeovers: takeovers,
        history: history,
    }

    this.name = () => room.name
    this.getScore = () => room ? room.scores.getScore() : false
    this.removeNickname = nickname => room ? room.scores.removeNickname(nickname) : false
    this.resetScore = () => {
        if (!room) {
            return;
        }
        room.scores.reset()
        room.history?.push('resetScore', {})
    }
    this.removeTiebreaker = (nickname, points) => {
        if (!room) {
            return;
        }
        room.scores.removeTiebreaker(nickname, points)
        room.history?.push('removeTiebreaker', {nickname, points})
    }
    this.addTiebreaker = (nickname, points) => {
        if (!room) {
            return;
        }
        room.scores.addTiebreaker(nickname, points)
        room.history?.push('addTiebreaker', {nickname, points})
    }
    this.addPoints = (nickname, points) => {
        if (!room) {
            return;
        }
        room.scores.addPoints(nickname, points)
        room.history?.push('addPoints', {nickname, points})
    }
    this.removePoints = (nickname, points) => {
        if (!room) {
            return;
        }
        room.scores.removePoints(nickname, points)
        room.history?.push('removePoints', {nickname, points})
    }

    this.hasAnswer = nickname => room ? room.answers.hasAnswer(nickname) : false
    this.getAnswers = () => room ? room.answers.getAnswers() : false
    this.resetAnswers = () => {
        if (!room) {
            return;
        }
        room.answers.resetRoom()
        room.history?.push('resetRoom', {})
    }
    this.resetSingleAnswer = nickname => {
        if (!room) {
            return;
        }
        room.answers.resetSingle(nickname)
        room.history.push('resetSingle', {nickname})
    }
    this.putAnswer = answer => {
        if (!room) {
            return;
        }
        room.answers.putAnswer(answer)
        room.history?.push('putAnswer', {...answer})
    }

    this.isOwner = ownerId => room.owner === ownerId

    this.takeover = nickname => room ? room.takeovers.takeover(nickname) : false
    this.getTakeovers = () => room ? room.takeovers.getList() : []
    this.resetTakeover = () => room ? room.takeovers.reset() : false
    this.hasTakeover = nickname => room ? room.takeovers.hasTakeover(nickname) : false
    this.getTakeover = nickname => room ? room.takeovers.getTakeover(nickname) : false

    this.getHistory = () => room ? room.history?.getList() || [] : []
}

module.exports = Room
