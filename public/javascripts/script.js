$(function () {
    const socket = io();
    const player = {nickname: '', isAdmin: false};
    const $users = $('#users');
    const $answer = $('#answer');
    const $login = $('#login');
    const $reset = $('#reset');

    socket.on('game.admin-login', () => {
        $login.hide();
        $answer.hide();
        $users.show();
        $reset.show();
        player.isAdmin = true;
    });

    socket.on('game.player', p => {
        $login.hide();
        $answer.show();
        $users.hide();
        player.nickname = p.nickname;
    });

    socket.on('game.login-failed', message => {
        $('#password').val('');
        alert(message);
    });

    socket.on('game.reset', () => {
        $answer.find('input').val('');
    });

    socket.on('game.players-update', players => {
        $users.html('');
        for (const player of players) {
            const $player = $(`<li>Player: <b>${player.nickname}</b> Answer: <b>${player.answer}</b></li>`);
            $users.append($player);
        }
    });

    socket.on('game.answer-failed', message => {
        alert(message);
    });

    $login.submit(e => {
        e.preventDefault();
        socket.emit('game.login', {
            nickname: $login.find('#nickname').val(),
            password: $login.find('#password').val(),
        });
    });

    $answer.submit(e => {
        e.preventDefault();
        socket.emit('game.answer', {
            message: $answer.find('input').val(),
        });
    });

    $reset.click(e => {
        e.preventDefault();
        socket.emit('game.reset');
    });
});
