require("dotenv").config();
const client = require("./client");
const { registerCommands } = require("./commands");
const cron = require("node-cron");
const { handleSubmit, handleSubmitFor } = require("./handle-commands/submit");
const { handleSetup } = require("./handle-commands/setup");
const {
  listEvents,
  addEvent,
  removeEvent,
  setEventsJson,
} = require("./handle-commands/manage-events");
const { handleCr } = require("./handle-commands/cr");
const { handleView } = require("./handle-commands/view");
const { handleComp } = require("./comp/handle-comp");
const { startAllJobs } = require("./cron");
const { stopComp, handleStopComp } = require("./stop-comp");
const { handleHelp } = require("./handle-commands/help");

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
      case "cr":
        await handleCr(int);
        break;
      case "view":
        await handleView(int);
        break;
      case "set-events-json":
        await setEventsJson(int);
        break;
      case "help":
        await handleHelp(int);
        break;
      case "stop-comp":
        await handleStopComp(int);
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
  try {
    await startAllJobs();
    // await registerCommands(client);
    // await handleComp("1140194673403646042");
  } catch (error) {
    console.error(error);
  }
});

client.on("guildDelete", async (guild) => {
  console.info("Left guild", guild.name, guild.id);
  await stopComp(guild.id);
});

client.login(process.env.token);
