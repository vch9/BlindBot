const Discord = require('discord.js');
const ytdl = require('ytdl-core');

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

exports.playMusic = function (connection, volume, url, on_finish) {
    const dispatcher = connection.play(ytdl(url));
    dispatcher.on('error', err => console.log(err));
    dispatcher.setVolumeLogarithmic(volume / 5);
    dispatcher.on('finish', () => {
        on_finish();
    });
}

exports.wait = function (ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }