const Common = require('./common.js');
const ytdl = require('ytdl-core');

const queue = new Map();

async function connect (queue, msg, voiceChannel) {
    try {
        let conn = await voiceChannel.join();
        return conn;
    } catch (err){
        console.log(err);
        queue.delete(message.guild.id);
        msg.reply('I could not join your voice channel!');
    }
}

exports.play = async function (msg) {
    const voiceChannel = msg.member.voice.channel;
    const textChannel = msg.channel;

    const args = msg.content.substr(6);
    const songInfo = await ytdl.getInfo(args);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

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
            textChannel: textChannel,
            conn: null
        };
        newQueue.songs.push(args);
        newQueue.conn = connect(queue, msg, voiceChannel);

        queue.set(msg.guild.id, newQueue);

        playMusic(msg.guild.id);
    } else {
        servQueue.songs.push(song);
        msg.channel.send(`${song.title} has been added to the queue.`);
    }
}