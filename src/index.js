require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { registerCommands } = require("./commands");
const { handleSubmit, handleSubmitFor } = require("./handle-commands/submit");
const { handleSetup } = require("./handle-commands/setup");
const {
  listEvents,
  addEvent,
  removeEvent,
} = require("./handle-commands/manage-events");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Event listener for commands
client.on("interactionCreate", async (int) => {
  try {
    switch (int.commandName) {
      case "submit":
        await handleSubmit(int);
        break;
      case "submit-for":
        await handleSubmitFor(int);
        break;
      case "setup":
        await handleSetup(int);
        break;
      case "list-events":
        await listEvents(int);
        break;
      case "add-event":
        await addEvent(int);
        break;
      case "remove-event":
        await removeEvent(int);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Error handling command", error);
  }
});

client.once("ready", async (bot) => {
  console.log(bot.user.username + " is online!");
  // await registerCommands(client);
});

client.login(process.env.token);
