const themes_path = './musics/';

const Discord = require('discord.js');
const fs = require('fs');

function getSongsFromTheme (theme) {
    switch(theme) {
        case 'movies':
            const movies = require('./movies.js');
            return movies.list;
    }
    return null;
}

function getThemes () {
    return fs.readdirSync(themes_path);
}

exports.displayThemes = function (channel) {
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

exports.checkTheme = function (msg, theme) {
    let themes = getThemes();
    if (!themes.includes(theme + '.js')) {
        msg.channel.send(`${theme} is not a valid theme!`);
        return false;
    }
    return true;
}