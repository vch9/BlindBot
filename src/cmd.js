const Discord = require('discord.js');
const Common = require('./common.js');
const Music = require('./music.js');
const Blindtest = require('./blindtest.js');

function exec (prefix, msg) {
    // Blind test dedicated command
    if (Blindtest.inGame(msg)) {
        if (msg.content.startsWith(prefix + "stop")) {
            Blindtest.stop(msg);
        } else if (msg.content.startsWith(prefix + "pick")) {
            Blindtest.pick(msg);
        } else if (msg.content.startsWith(prefix + "skip")) {
            Blindtest.skip(msg);
        }
        Blindtest.answer(msg);
        return;
    }

    if (msg.content.startsWith(prefix + "help")) {
        Common.error_msg(msg);
    } else if (msg.content.startsWith(prefix + "play")) {
        Music.play(msg);
    } else if (msg.content.startsWith(prefix + "volume")) {
        Music.volume(msg);
    } else if (msg.content.startsWith(prefix + "leave")) {
        Music.leave(msg);
    } else if (msg.content.startsWith(prefix + "skip")) {
        Music.skip(msg);
    } else if (msg.content.startsWith(prefix + "stop") || msg.content.startsWith(prefix + "skip all")) {
        Music.stop(msg);
    } else if (msg.content.startsWith(prefix + "blindtest")) {
        Blindtest.start(msg);
    } else if (msg.content.startsWith(prefix)) {
        msg.reply('Try `?help` for help');
    }
}

exports.listen = function (prefix, client) {
    client.on('message', async msg => {
        if (msg.author.bot) return;
        exec(prefix, msg);
    });
}