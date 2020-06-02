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
        nextSound(game);
    });

}

async function nextSound (game) {
    if (game.nb >= game.max) {
        const scores = getStrPlayers(game);
        const description = '\n\n' + scores;

        const msg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('The game has ended!')
            .setDescription(description)

        game.textChannel.send(msg);
        return;
    }
    if (!game.conn) {
        try {
            const conn = await game.voiceChannel.join();
            game.conn = conn;
        } catch  (err) {
            console.log(err);
            return;
        }
    }
    playSong(game);
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
    nextSound(game);
}

function fetchPlayers (voiceChannel) {
    let players = [];

    voiceChannel.members.forEach(member => {
        if (!member.user.bot) {
            if (member.nickname) {
                players.push([member.nickname, 0]);
            } else {
                players.push([member.user.username, 0]);
            }
        }
    });

    return players;
}

function getStrPlayers (game) {
    let players_str = 'Players Score:\n';
    game.players.forEach(player => {
        players_str += `* ${player[0]}: ${player[1]}\n`;
    });
    return players_str;
}

function displayScores (game) {
    const msg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setDescription(getStrPlayers(game))

    game.textChannel.send(msg);
}

function displayGame (game, channel) {
    let themes_str = Theme.getStrThemes(channel);
    let players_str = getStrPlayers(game);


    const description = themes_str + '\n\n\n' + players_str;
    const msg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Starting the blind test party!')
        .setDescription(description)

    channel.send(msg);
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
        nb: 0,
        conn: null,
        done: [],
        current_song: null,
        players: fetchPlayers(msg.member.voice.channel)
    };

    games.set(msg.guild.id, game);

    displayGame(game, msg.channel);
}

exports.inGame = function (msg) {
    const game = games.get(msg.guild.id);
    return game;
}

exports.stop = function (msg) {
    games.delete(msg.guild.id);
    msg.channel.send('Blindtest has been stopped.');
}

function updateScores (game, player) {
    let name = '';
    if (player.nickname) {
        name = player.nickname;
    } else {
        name = player.user.username;
    }

    const index = game.players.indexOf(name);

    let found = false;
    game.players.forEach(pl => {
        if (pl[0] === name) {
            pl[1] += 1;
            found = true;
            return
        }
    });

    if (!found) {
        game.players.push([name, 1]);
    }
}

exports.answer = async function (msg) {
    let game = games.get(msg.guild.id);
    if (game && game.active && msg.channel === game.textChannel) {
        const song = game.current_song;
        if (song) {
            let answer = song[0].toUpperCase();
            let player_answer = msg.content.toUpperCase();

            if (answer === player_answer) {
                game.nb += 1;
                updateScores(game, msg.member);
                displayScores(game);
                game.conn.dispatcher.end();
            }
        }
    }
}