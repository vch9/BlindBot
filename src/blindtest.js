const common = require('./common.js');

const games = new Map();


exports.start = function (msg) {
    if (!common.checkVoiceChannel(msg)) {
        return;
    }

    let game = {
        active: true
    };

    games.set(msg.guild.id, game);
}

exports.inGame = function (msg) {
    const game = games.get(msg.guild.id);
    return game;
}

exports.stop = function (msg) {
    games.delete(msg.guild.id);
    msg.channel.send('Blindtest has been stopped.');
}