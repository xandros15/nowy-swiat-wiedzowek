//io
const createSocket = function (app) {
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    const ADMIN_NAME = process.env.ANSWER_ADMIN || 'admin';
    const ADMIN_PASSWORD = process.env.ANSWER_PASS || 'NajlepszeAtrakcje';

    const admin = {
        id: '',
        nickname: ADMIN_NAME,
        password: ADMIN_PASSWORD,
    };

    //app
    let players = [];

    function isAdminOnline() {
        return admin.id !== '';
    }


    function loginOrAddPlayer({nickname, password, id}) {
        if (nickname === admin.nickname && password === admin.password) {
            admin.id = id;

            return admin;
        } else {
            let player = players.find(player => player.nickname === nickname);
            if (player && player.password === password) {
                player.id = id;

                return player;
            } else if (!player && nickname !== ADMIN_NAME) {
                player = {
                    nickname,
                    password,
                    id,
                    answer: '',
                };
                players.push(player);

                return player;
            }
        }
        return false;
    }

    function submitAnswer(player, answer) {
        if (player && !player.answer) {
            player.answer = answer;

            return true;
        }
        return false;
    }

    function resetAnswers() {
        for (const player of players) {
            player.answer = '';
        }
    }

    function isAdmin(player) {
        return player && player.nickname === admin.nickname;
    }

    function sendToAdmin(namespace, elements) {
        if (isAdminOnline()) {
            io.to(admin.id).emit(namespace, elements);
        }
    }

    io.on('connection', socket => {
        let player = null;
        socket.on('game.login', ({nickname, password}) => {
            if (!nickname || !password) {
                socket.emit('game.login-failed', 'You need to fill these fields');
                return;
            }
            player = loginOrAddPlayer({
                nickname,
                password,
                id: socket.id,
            });

            if (!player) {
                socket.emit('game.login-failed', 'Player name exist or you type wrong password');
            } else if (isAdmin(player)) {
                socket.emit('game.admin-login');
                sendToAdmin('game.players-update', players);
            } else {
                socket.emit('game.player', player);
                sendToAdmin('game.players-update', players);
            }
        });
        socket.on('game.answer', ({message}) => {
            if (!isAdmin(player)) {
                if (submitAnswer(player, message)) {
                    sendToAdmin('game.players-update', players);
                } else {
                    socket.emit('game.answer-failed', 'You can send answer only once');
                }
            }
        });
        socket.on('game.reset', () => {
            if (isAdmin(player)) {
                resetAnswers();
                socket.broadcast.emit('game.reset');
                socket.emit('game.players-update', players);
            }
        });
    });

    http.listen(3000, () => {
        console.log('listening on *:3000');
    });
};

module.exports = createSocket;
