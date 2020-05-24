function error_msg (msg) {
    const not_impl = "NOT_IMPLEMENTED";
    msg.reply(not_impl);
}

exports.listen = function (self, client) {
    client.on('message', msg => {
        if (msg.author.username != self &&
            msg.channel.name === "dev" &&
            msg.content[0] === ":") {
            error_msg(msg);
        }
    });
}