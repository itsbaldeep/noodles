const Discord = require('discord.js');
const https = require('https');
const prefix = "send ";

const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity("with eggplant", "PLAYING");
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const input = args.shift().toLowerCase();

    const photo_count = 30;
    const options = {
        host: 'api.pexels.com',
        path: `/v1/search?per_page=${photo_count}&query=${input}`,
        headers: { 'Authorization': process.env.PEXELS_API }
    };
    const req = https.request(options, res => {
        let buffer = '';
        res.on('data', res => buffer += res);
        res.on('end', () => {
            const data = JSON.parse(buffer);
            const index = Math.floor(Math.random() * photo_count);
            if (data.photos[index]) {
                const url = data.photos[index].src.original;
                message.reply(url);
            }
        })
    });
    req.end();
});

client.login(process.env.DISCORD_API);
