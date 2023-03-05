function Takeovers () {
  /**
   * @type {[{name: string, place: number, time: number}]}
   */
  let takeovers = []
  let firstTakeoverTime = null

  this.hasTakeover = name => {
    for (const takeover of takeovers) {
      if (name === takeover.name) {
        return true
      }
    }
    return false
  }

  this.reset = () => {
    firstTakeoverTime = null
    takeovers = []
  }

  this.takeover = name => {
    if (this.hasTakeover(name)) {
      return false
    }

    let place = 1, time = null

    if (firstTakeoverTime === null) {
      firstTakeoverTime = Date.now()
    } else {
      place = takeovers.length + 1
      time = Date.now() - firstTakeoverTime
    }
    const takeover = {name, time, place}
    takeovers.push(takeover)

    return takeover
  }

  this.getList = () => takeovers
}

module.exports = Takeovers
