const common = require('./common.js');
const Discord = require('discord.js');
const fs = require('fs');

const themes_path = './musics/';
const games = new Map();

function getThemes() {
    return fs.readdirSync(themes_path);
}

function displayThemes (channel) {
    let themes = getThemes();
    let themes_str = '';
    themes.forEach(theme => {
        theme = theme.substr(0, theme.length-3);
        themes_str += `* ${theme}\n`;
    });

    const msg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Starting the blind test party!')
        .setDescription('Pick your theme and number of songs:\n' + themes_str + '\nuse ?pick [theme] [number]');
    
    channel.send(msg);
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

    let themes = getThemes();
    let theme = args[0];
    if (!themes.includes(theme + '.js')) {
        msg.channel.send(`${theme} is not a valid theme!`);
        return;
    }

    let number = parseInt(args[1]);
    if (!number) {
        msg.channel.send(`${args[1]} is not a valid number!`);
        return;
    }

    game.theme = theme;
    game.max = number;

    msg.channel.send(`Theme selected: ${theme}, \nNumber of songs: ${number}`);
}

exports.start = function (msg) {
    if (!common.checkVoiceChannel(msg)) {
        return;
    }

    let game = {
        textChannel: msg.channel,
        active: true,
        theme: null,
        max: -1
    };

    games.set(msg.guild.id, game);

    displayThemes(msg.channel);
}

exports.inGame = function (msg) {
    const game = games.get(msg.guild.id);
    return game;
}

exports.stop = function (msg) {
    games.delete(msg.guild.id);
    msg.channel.send('Blindtest has been stopped.');
}

exports.answer = function (msg) {
    let game = games.get(msg.guild.id);
    if (game && msg.channel === game.textChannel) {
        // TODO: Check answers.
    }
}