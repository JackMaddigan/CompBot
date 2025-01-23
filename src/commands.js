const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const { formats } = require("./formats");

async function registerCommands(client) {
  try {
    const submitCommand = new SlashCommandBuilder()
      .setName("submit")
      .setDescription("Submit results for the weekly comp")
      .addStringOption((option) =>
        option
          .setName("event")
          .setDescription("The event to submit results for")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("results")
          .setDescription("Results separated by a space")
          .setRequired(true)
      );

    const submitForCommand = new SlashCommandBuilder()
      .setName("submit-for")
      .setDescription(
        "[ADMIN] Submit results for the weekly comp for someone else"
      )
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addUserOption((option) =>
        option
          .setName("user")
          .setRequired(true)
          .setDescription("The user to submit for")
      )
      .addStringOption((option) =>
        option
          .setName("event")
          .setDescription("The event to submit results for")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("results")
          .setDescription("Results separated by a space")
          .setRequired(true)
      );

    const unsubmitCommand = new SlashCommandBuilder()
      .setName("unsubmit")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .setDescription("[ADMIN] Unsubmit results")
      .addUserOption((option) =>
        option.setName("user").setRequired(true).setDescription("The user")
      )
      .addStringOption((option) =>
        option
          .setName("event")
          .setRequired(true)
          .setDescription("Event to unsubmit")
      );

    const currentRankingsCommand = new SlashCommandBuilder()
      .setName("cr")
      .setDescription("See the current competition rankings");

    const viewCommand = new SlashCommandBuilder()
      .setName("view")
      .setDescription("See your results for the weekly comp");

    const setupCommand = new SlashCommandBuilder()
      .setName("setup")
      .setDescription("[ADMIN] Set up channels and time")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addChannelOption((option) =>
        option
          .setName("scramble-channel")
          .setRequired(true)
          .setDescription("ID of the channel the bot will send scrambles to")
          .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
        option
          .setName("results-channel")
          .setRequired(true)
          .setDescription("The channel the bot will send results to")
          .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
        option
          .setName("submit-channel")
          .setRequired(true)
          .setDescription(
            "The channel the bot will send the new week number to"
          )
          .addChannelTypes(ChannelType.GuildText)
      )
      .addIntegerOption((option) =>
        option
          .setName("time-hour")
          .setDescription("Hour in UTC to run comp at")
          .setRequired(true)
          .setMaxValue(23)
          .setMinValue(0)
      )
      .addIntegerOption((option) =>
        option
          .setName("time-minute")
          .setDescription("Minute in UTC to run comp at")
          .setRequired(true)
          .setMaxValue(59)
          .setMinValue(0)
      )
      .addIntegerOption((option) =>
        option
          .setName("time-day")
          .setDescription("Day in UTC to run comp at")
          .setRequired(true)
          .setChoices(
            {
              name: "Sunday",
              value: 0,
            },
            {
              name: "Monday",
              value: 1,
            },
            {
              name: "Tuesday",
              value: 2,
            },
            {
              name: "Wednesday",
              value: 3,
            },
            {
              name: "Thursday",
              value: 4,
            },
            {
              name: "Friday",
              value: 5,
            },
            {
              name: "Saturday",
              value: 6,
            }
          )
      )
      .addBooleanOption((option) =>
        option
          .setName("results-txt-file")
          .setDescription(
            "Send a txt file with the podiums with the full results"
          )
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("start-week")
          .setDescription("Initial week number for the next scrambles")
          .setMinValue(1)
      )
      .addRoleOption((option) =>
        option
          .setName("comp-ping-role")
          .setDescription("Role the bot will mention when sending scrambles")
      );

    const listEventsCommand = new SlashCommandBuilder()
      .setName("list-events")
      .setDescription("List all events of this servers competition");

    const addEventCommand = new SlashCommandBuilder()
      .setName("add-event")
      .setDescription("[ADMIN] Add an event to the competition")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addStringOption((option) =>
        option
          .setName("event-name")
          .setRequired(true)
          .setDescription("Name of the event")
          .setMaxLength(16)
      )
      .addIntegerOption((option) =>
        option
          .setName("attempts")
          .setRequired(true)
          .setDescription("The number of attempts")
          .setMaxValue(25)
          .setMinValue(1)
      )
      .addStringOption((option) =>
        option
          .setName("event-format")
          .setRequired(true)
          .setDescription("Format of the event")
          .setChoices(
            Object.entries(formats).reduce((acc, [formatId, formatData]) => {
              acc.push({
                name: formatData.name + " " + formatData.description,
                value: formatId,
              });
              return acc;
            }, [])
          )
      )
      .addStringOption((option) =>
        option
          .setName("scramble-type")
          .setDescription("The type of scramble to be sent")
      );

    const removeEventCommand = new SlashCommandBuilder()
      .setName("remove-event")
      .setDescription("[ADMIN] Remove an event from the weekly comp")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addIntegerOption((option) =>
        option
          .setName("event-id")
          .setRequired(true)
          .setDescription("ID of the event to delete")
      );

    const setEventsJsonCommand = new SlashCommandBuilder()
      .setName("set-events-json")
      .setDescription("[ADMIN] Set the comp events with a json object")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addStringOption((option) =>
        option
          .setName("json")
          .setRequired(true)
          .setDescription("JSON object. Use /help to see how")
      );

    const helpCommand = new SlashCommandBuilder()
      .setName("help")
      .setDescription("Info on how to use the bot");

    const stopCompCommand = new SlashCommandBuilder()
      .setName("stop-comp")
      .setDescription("[ADMIN] Stop comp, delete all results and settings")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers);

    await client.application.commands.set([
      submitCommand,
      submitForCommand,
      unsubmitCommand,
      currentRankingsCommand,
      viewCommand,
      setupCommand,
      listEventsCommand,
      addEventCommand,
      removeEventCommand,
      setEventsJsonCommand,
      helpCommand,
      stopCompCommand,
    ]);
    console.log("Slash commands registered successfully");
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }
}

module.exports = {
  registerCommands,
};
