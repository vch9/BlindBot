const Common = require('./common.js');
const ytdl = require('ytdl-core');

const queue = new Map();

function playQueue(id) {
    const servQueue = queue.get(id);
    const song = servQueue.songs[0];

    if (!song) {
        servQueue.voiceChannel.leave();
        queue.delete(id);
        return;
    }

    function playNext() {
        servQueue.songs.shift();
        playQueue(id);
    }

    Common.playMusic(servQueue.conn, servQueue.volume, song.url, playNext);
    servQueue.textChannel.send(`Start playing: ${song.title}`);

}

exports.play = async function (msg) {
    const voiceChannel = msg.member.voice.channel;
    const textChannel = msg.channel;


    let song = {
        title: '',
        url: ''
    };
    const args = msg.content.substr(6);
    try {
        const songInfo = await ytdl.getInfo(args);

        song.title =songInfo.title,
        song.url = songInfo.video_url
    } catch (err) {
        msg.reply(`${args} doesn't exist`);
        return;
    }

    if (!voiceChannel) {
        msg.reply("You need to be in a voice channel");
        return;
    }

    servQueue = queue.get(msg.guild.id);
    if (!servQueue) {
        let newQueue = {
            active: true,
            songs: [],
            volume: 5,
            voiceChannel: voiceChannel,
            textChannel: textChannel,
            conn: null
        };
        queue.set(msg.guild.id, newQueue);

        try {
            const conn = await voiceChannel.join();
            newQueue.conn = conn;
        } catch (err){
            console.log(err);
            msg.reply('I could not join your voice channel!');
        }

        newQueue.songs.push(song);

        playQueue(msg.guild.id);
    } else {
        servQueue.songs.push(song);
        msg.channel.send(`${song.title} has been added to the queue.`);
    }
}

exports.volume = async function (msg) {
    servQueue = queue.get(msg.guild.id);
    if(!servQueue) {
        msg.channel.send('You can\'t set volume if i\'m not in a voice channel!');
        return;
    }
    let args = msg.content.substr(8);
    let vol = parseInt(args);

    if (vol) {
        servQueue.volume = vol;
    }
}

exports.leave = async function (msg) {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) {
        msg.channel.send('You need to be in my voice channel to make me leave!');
        return;
    }

    voiceChannel.leave();
    queue.delete(msg.guild.id);
}

exports.skip = async function (msg) {
    if (!msg.member.voice.channel) {
        msg.reply('You have to be in a voice channel to skip the music');
        return;
    }
    let servQueue = queue.get(msg.guild.id);
    if (!servQueue) {
        msg.reply('There is no songs in the queue');
        return;
    }
    servQueue.conn.dispatcher.end();
}

exports.stop = async function (msg) {
    if (!msg.member.voice.channel) {
        msg.reply('You have to be in a voice channel to stop the music');
        return;
    }
    let servQueue = queue.get(msg.guild.id);
    if (servQueue) {
        servQueue.songs = [];
        servQueue.conn.dispatcher.end();
    }

    msg.channel.send('Music stopped.');
}