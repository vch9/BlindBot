const Discord = require('discord.js');
const CMD = require('./src/cmd.js');
const client = new Discord.Client();
const self = "BlindBot";

client.on('ready', () => {
    console.log(`Logged in as ${self}`);
});

CMD.listen(self, client);

/* 
    The private token must be in a file "./token.js"
    token.js ->
        const token = 'your_token';
        exports.token = token;
*/
const Token = require('./token.js');
client.login(Token.token);