const MAX_HISTORY = 30;

function RoomHistory() {
    const historyList = [];

    this.push = function (type, data) {
        historyList.push({data: Object.assign({}, data), type, timestamp: Date.now()})
        if (historyList.length > MAX_HISTORY) {
            historyList.shift()
        }
    }

    this.getList = function () {
        return [...historyList]
    }
}

module.exports = RoomHistory
