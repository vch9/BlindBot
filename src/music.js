const Common = require('./common.js');

const queue = new Map();

async function connect (queue, msg, voiceChannel) {
    try {
        let conn = await voiceChannel.join();
    } catch (err){
        console.log(err);
        queue.delete(message.guild.id);
        msg.reply('I could not join your voice channel!');
    }
}

exports.play = async function (msg) {
    let args = msg.content.substr(6);
    const voiceChannel = msg.member.voice.channel;
    const textChannel = msg.channel;

    if (!voiceChannel) {
        msg.reply("You need to be in a voice channel");
        return;
    }

    servQueue = queue.get(msg.guild.id);
    if (!servQueue) {
        let newQueue = {
            active: true,
            songs: [],
            voiceChannel: voiceChannel,
            textChannel: textChannel
        };
        queue.set(msg.guild.id, newQueue);
        connect(queue, msg, voiceChannel);
    } else {
        servQueue.songs.push(args);
    }
}