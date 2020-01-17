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
    const input = args.join('%20').toLowerCase();
    console.log(args, input);

    const options = {
        host: 'api.pexels.com',
        path: `/v1/search?per_page=80&query=${input}`,
        headers: { 'Authorization': process.env.PEXELS_API }
    };
    const req = https.request(options, res => {
        let buffer = '';
        res.on('data', res => buffer += res);
        res.on('end', () => {
            const data = JSON.parse(buffer);
            const length = Math.min(data.per_page, data.total_results);
            const index = Math.floor(Math.random() * length);
            const photo = data.photos[index];

            if (photo) 
                message.channel.send(`:man_gesturing_ok: ${args.join(' ')} for you! ${photo.src.original}`);
            else
                message.channel.send(':man_gesturing_no: No photos found relating to your search!');
        });
        res.on('error', console.log);
    });
    req.end();
});

client.login(process.env.DISCORD_API);
