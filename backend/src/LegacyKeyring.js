/**
 * @param keyRooms {[{room: string, key: string}]}
 */
function LegacyKeyring(keyRooms) {
    this.getRooms = () => keyRooms.map(kr => kr.room);
    this.hasRoom = roomName => !!keyRooms.find(kr => kr.room === roomName)
    this.isCorrectKey = (key, roomName) => {
        const room = keyRooms.find(kr => kr.room === roomName);
        if (!room) {
            return false;
        }
        return room.key === key
    }
}


module.exports = LegacyKeyring
