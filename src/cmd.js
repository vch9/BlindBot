const Discord = require('discord.js');
const Common = require('./common.js');

function exec (client, msg) {
    let cmd = msg.content.substr(1);
    cmd.trim();
    let cmds = cmd.split(' ');
    switch (cmds[0]) {
        case 'help':
            Common.error_msg(msg);
            break;
        default:
            msg.reply('Try `?help` for help');
            break;
    }
}

exports.listen = function (self, client) {
    client.on('message', msg => {
        if (msg.author.username != self &&
            msg.channel.name === "dev" &&
            msg.content[0] === "?") {
            exec(client, msg);
        }
    });
}