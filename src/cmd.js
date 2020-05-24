const Discord = require('discord.js');
const Common = require('./common.js');
const Music = require('./music.js');

function exec (msg) {
    if (msg.content.startsWith("?help")) {
        Common.error_msg(msg);
    } else if (msg.content.startsWith("?play")) {
        Music.play(msg);
    } else {
        msg.reply('Try `?help` for help');
    }
}

exports.listen = function (self, client) {
    client.on('message', msg => {
        if (msg.author.username != self &&
            msg.channel.name === "dev" &&
            msg.content[0] === "?") {
            exec(msg);
        }
    });
}