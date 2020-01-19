const Discord = require('discord.js');
const fs = require('fs');
const { commands } = require('./config.json');

// Making the client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Getting commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Handling ready event
client.on('ready', () => {
    client.user.setActivity('with eggplant', 'PLAYING');
});

// Handling message event
client.on('message', message => {
    // Exit early
    if (message.author.bot) return;

    // Getting command name
    let commandName;
    for (const c of commands) {
        if (message.content.toLowerCase().startsWith(c)) {
            commandName = c;
            break;
        }
    }
    if (!commandName) return;

    // Getting arguments
    const args = message.content.slice(commandName.length).trim().split('\n').split(/ +/);
    console.log(args);
    // Getting command
    const command = client.commands.get(commandName);
    if (!command) return;

    // Executing command
    try {
		command.execute(message, args);
	} catch (error) {
        console.error(error);
    }
});

// Starting the client;
client.login(process.env.DISCORD_API);
