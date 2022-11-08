import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";

// dotenv config
config();

// Making the client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

// Getting commands
const commandFiles = readdirSync("./commands").filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  import(`./commands/${file}`)
    .then((command) => {
      const name = file.substring(0, file.indexOf("."));
      client.commands.set(name, command);
    })
    .catch(console.error);
}

// Handling ready event
client.once(Events.ClientReady, () => {
  console.log("Client ready!");
  client.user.setActivity("with eggplant", "PLAYING");
});

// Handling message event
client.on(Events.MessageCreate, (message) => {
  // Exit early
  if (message.author.bot) return;

  // Getting command name
  let commandName;
  for (const file of commandFiles) {
    const name = file.substring(0, file.indexOf("."));
    if (message.content.toLowerCase().startsWith(name)) {
      commandName = name;
      break;
    }
  }
  if (!commandName) return;

  // Getting arguments
  const args = message.content
    .slice(commandName.length)
    .replace(/^\s+|\s+$/g, "")
    .split(/\s+/);

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

// Starting the client
client
  .login(process.env.DISCORD_API)
  .then(() => {
    console.log("Client started!");
  })
  .catch(console.error);
