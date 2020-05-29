const common = require('./common.js');

const games = new Map();


exports.start = function (msg) {
    if (!common.checkVoiceChannel(msg)) {
        return;
    }
}