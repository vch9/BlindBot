const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/* 
    The private token must be in a file "./token.js"
    token.js ->
        const token = 'your_token';
        exports.token = token;
*/
const Token = require('./token.js');
client.login(Token.token);