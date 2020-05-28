const Discord = require('discord.js');
const Common = require('./common.js');
const Music = require('./music.js');

function exec (msg) {
    if (msg.content.startsWith("?help")) {
        Common.error_msg(msg);
    } else if (msg.content.startsWith("?play")) {
        Music.play(msg);
    } else if (msg.content.startsWith("?volume")) {
        Music.volume(msg);
    } else if (msg.content.startsWith("?leave")) {
        Music.leave(msg);
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