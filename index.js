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
    const input = args.join(" ").toLowerCase();

    const options = {
        host: 'api.pexels.com',
        path: `/v1/search?per_page=40&query=${input}`,
        headers: { 'Authorization': process.env.PEXELS_API }
    };
    const req = https.request(options, res => {
        let buffer = '';
        res.on('data', res => buffer += res);
        res.on('end', () => {
            const data = JSON.parse(buffer);
            if (data.photos) {
                const index = Math.floor(Math.random() * 40);
                const url = data.photos[index].src.original;
                message.channel.send(`Here's ${input} for you!`, {file: url});
            } else {
                message.channel.send(`Couldn't find any images relating to your search ${input}`)
            }
        });
        res.on('error', console.log);
    });
    req.end();
});

client.login(process.env.DISCORD_API);
