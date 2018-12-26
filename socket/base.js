//io
const createSocket = function (app) {
    const http = require('http').Server(app);
    const io = require('socket.io')(http);

    const ADMIN_NAME = process.env.ANSWER_ADMIN || 'admin';
    const ADMIN_PASSWORD = process.env.ANSWER_PASS || 'NajlepszeAtrakcje';

    const adminPlayer = {
        id: '',
        nickname: ADMIN_NAME,
        password: ADMIN_PASSWORD,
        answer: '',
    };

    //app
    let players = [adminPlayer];

    function isAdminOnline() {
        const player = players.find(player => player.nickname === ADMIN_NAME);

        return player.id !== '';
    }


    function loginOrAddPlayer({nickname, password, id}) {
        let player = players.find(player => player.nickname === nickname);
        if (player && player.password !== password) {
            return false;
        }

        if (!player) {
            player = {
                nickname,
                password,
                id,
                answer: '',
            };
            players.push(player);
        } else {
            player.id = id;
        }


        return player;
    }

    function submitAnswer({nickname, answer}) {
        const player = players.find(player => player.nickname === nickname);
        if (player.answer === '') {
            player.answer = answer;
        }
    }

    function resetAnswers() {
        for (const player of players) {
            player.answer = '';
        }
    }

    function sendToAdmin(namespace, elements) {
        if (isAdminOnline()) {
            const player = players.find(player => player.nickname === ADMIN_NAME);
            io.to(player.id).emit(namespace, elements);
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
            } else {
                socket.emit('game.player', player);
                if (players.find(player => player.id === socket.id && player.nickname === ADMIN_NAME)) {
                    socket.emit('game.admin-login');
                }
                sendToAdmin('game.players-update', players);
            }
        });
        socket.on('game.answer', ({message}) => {
            if (player && player.nickname !== ADMIN_NAME) {
                submitAnswer({nickname: player.nickname, answer: message});
                sendToAdmin('game.players-update', players);
            }
        });
        socket.on('game.reset', () => {
            if (player && player.nickname === ADMIN_NAME) {
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
