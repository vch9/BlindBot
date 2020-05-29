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
        .setDescription('Pick your theme:\n' + themes_str + '\nuse ?pick [theme]');
    
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

    let args = msg.content.substr(6);

    let themes = getThemes();
    let theme = args + '.js';
    if (!themes.includes(theme)) {
        msg.channel.send(`${args} is not a valid theme!`);
        return;
    }

    game.theme = theme;
}

exports.start = function (msg) {
    if (!common.checkVoiceChannel(msg)) {
        return;
    }

    let game = {
        active: true,
        theme: null
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