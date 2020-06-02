const themes_path = './musics/';

const Discord = require('discord.js');
const fs = require('fs');

function getSongsFromTheme (theme) {
    let file = '../musics/' + theme;
    switch(theme) {
        case 'movies':
            const movies = require(file);
            return movies.list;
    }
    return null;
}

exports.getSongsFromTheme = getSongsFromTheme;

function getThemes () {
    return fs.readdirSync(themes_path);
}

exports.songsInTheme = function (theme) {
    return getSongsFromTheme(theme).length;
}

exports.getStrThemes = function () {
    let themes = getThemes();
    let themes_str = 'Pick your theme and number of songs:\n';
    themes.forEach(theme => {
        theme = theme.substr(0, theme.length-3);
        themes_str += `* ${theme}\n`;
    });
    themes_str += '\nuse ?pick [theme] [number]';
    return themes_str;
}

exports.checkTheme = function (msg, theme) {
    let themes = getThemes();
    if (!themes.includes(theme + '.js')) {
        msg.channel.send(`${theme} is not a valid theme!`);
        return false;
    }
    return true;
}