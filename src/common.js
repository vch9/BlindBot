const Discord = require('discord.js');

exports.error_msg = function (msg) {
    const not_impl = "NOT_IMPLEMENTED";
    msg.reply(not_impl);
}

exports.checkVoiceChannel = function (msg) {
    if (!msg.member.voice.channel) {
        msg.reply('You have to be in a voice channel to execute that command!');
        return false;
    }
    return true;
}