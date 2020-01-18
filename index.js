const Discord = require('discord.js');
const https = require('https');
const { prefix } = require('./config.json');

// Making the client
const client = new Discord.Client();

// Handling ready event
client.on('ready', () => {
    client.user.setActivity('with eggplant', 'PLAYING');
});

// Handling message event
client.on('message', message => {
    // Exit early
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Getting the arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const input = args.join('%20').toLowerCase();

    // Options for API call
    const options = {
        host: 'api.pexels.com',
        path: `/v1/search?per_page=80&query=${input}`,
        headers: { 'Authorization': process.env.PEXELS_API }
    };

    // Making request
    const req = https.request(options, res => {
        // Getting the data
        let buffer = '';
        res.on('data', res => buffer += res);

        // Sending the message
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

        // Checking errors
        res.on('error', console.log);
    });

    req.end();
});

// Starting the client;
client.login(process.env.DISCORD_API);
