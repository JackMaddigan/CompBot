require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { registerCommands } = require("./commands");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Event listener for commands
client.on("interactionCreate", async (int) => {
  if (!int.isCommand()) return;
});

client.once("ready", async (bot) => {
  console.log(bot.user.username + " is online!");
  await registerCommands(client);
});

client.login(process.env.token);
