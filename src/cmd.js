const Discord = require('discord.js');
const Common = require('./common.js');
const Music = require('./music.js');
const Blindtest = require('./blindtest.js');

function exec (msg) {
    // Blind test dedicated command
    if (Blindtest.inGame(msg)) {
        if (msg.content.startsWith("?stop")) {
            Blindtest.stop(msg);
        } else if (msg.content.startsWith("?pick")) {
            Blindtest.pick(msg);
        }
        Blindtest.answer(msg);
        return;
    }

    if (msg.content.startsWith("?help")) {
        Common.error_msg(msg);
    } else if (msg.content.startsWith("?play")) {
        Music.play(msg);
    } else if (msg.content.startsWith("?volume")) {
        Music.volume(msg);
    } else if (msg.content.startsWith("?leave")) {
        Music.leave(msg);
    } else if (msg.content.startsWith("?skip")) {
        Music.skip(msg);
    } else if (msg.content.startsWith("?stop") || msg.content.startsWith("?skip all")) {
        Music.stop(msg);
    } else if (msg.content.startsWith("?blindtest")) {
        Blindtest.start(msg);
    } else if (msg.content.startsWith("?")) {
        msg.reply('Try `?help` for help');
    }
}

exports.listen = function (self, client) {
    client.on('message', async msg => {
        if (msg.author.bot) return;
        if (msg.channel.name === "dev") {
            exec(msg);
        }
    });
}