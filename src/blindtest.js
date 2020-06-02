const common = require('./common.js');
const Discord = require('discord.js');
const Theme = require('./theme.js');

const games = new Map();

function pickFromTheme (theme, done) {
    let songs = Theme.getSongsFromTheme(theme);

    let i = Math.floor(Math.random() * Math.floor(songs.length));
    while (done.includes(i)) {
       let i = Math.floor(Math.random() * Math.floor(songs.length));
    }

    return songs[i];
}

function showAnswer (channel, answer) {
    channel.send(`The answer was ${answer}`);
}

async function playSong (game) {
    let song = pickFromTheme(game.theme, game.done);
    game.current_song = song;

    common.playMusic (game.conn, 5, song[1], () => {
        showAnswer(game.textChannel, song[0]);
    });

}

async function startPlaying (game) {
    try {
        const conn = await game.voiceChannel.join();
        game.conn = conn;
    } catch  (err) {
        console.log(err);
        return;
    }

    let count = 0;
    while (count < game.max) {
        playSong(game);
        count++;
    }
}

exports.pick = function (msg) {
    if (!common.checkVoiceChannel(msg)) {
        return;
    }

    let game = games.get(msg.guild.id);
    if (game.theme) {
        msg.channel.send('The theme is already picked!');
        return;
    }

    let args = msg.content.substr(6).split(' ');
    if (args.length != 2) {
        msg.channel.send(`Invalid number of arguments:\n \`?pick [theme] [number]\``);
        return;
    }

    let theme_play = args[0];
    if (!Theme.checkTheme(msg, theme_play)) {
        return;
    }

    let number = parseInt(args[1]);
    if (!number) {
        msg.channel.send(`${args[1]} is not a valid number!`);
        return;
    }

    game.theme = theme_play;
    game.max = number;

    msg.channel.send(`Theme selected: ${theme_play}, \nNumber of songs: ${number}`);

    game.active = true;
    startPlaying(game);
}

exports.start = function (msg) {
    if (!common.checkVoiceChannel(msg)) {
        return;
    }

    let game = {
        textChannel: msg.channel,
        voiceChannel: msg.member.voice.channel,
        active: false,
        theme: null,
        max: -1,
        conn: null,
        done: [],
        current_song: null
    };

    games.set(msg.guild.id, game);

    Theme.displayThemes(msg.channel);
}

exports.inGame = function (msg) {
    const game = games.get(msg.guild.id);
    return game;
}

exports.stop = function (msg) {
    games.delete(msg.guild.id);
    msg.channel.send('Blindtest has been stopped.');
}

exports.answer = async function (msg) {
    let game = games.get(msg.guild.id);
    if (game && game.active && msg.channel === game.textChannel) {
        const song = game.current_song;
        if (song) {
            console.log(song);
            let answer = song[0].toUpperCase();
            let player_answer = msg.content.toUpperCase();

            if (answer === player_answer) {
                // TODO: update scores
            }
        }
    }
}