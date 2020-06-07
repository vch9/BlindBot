const Discord = require('discord.js');
const CMD = require('./src/cmd.js');
const client = new Discord.Client();
const self = "BlindBot";

const config = require('./config.json');
const token = config.token;
const prefix = config.prefix;

if (!token) {
    console.log('The token must provided in BlindBot/config.json');
}

client.on('ready', () => {
    console.log(`Logged in as ${self}`);
});

CMD.listen(self, client);

client.login(token);