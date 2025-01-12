const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
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
      .setDescription("Unsubmit results")
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
      .setDescription("Set up channels and time")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
      .addStringOption((option) =>
        option
          .setName("scramble-channel-id")
          .setRequired(true)
          .setDescription("ID of the channel the bot will send scrambles to")
      )
      .addStringOption((option) =>
        option
          .setName("results-channel-id")
          .setRequired(true)
          .setDescription("ID of the channel the bot will send results to")
      )

      .addIntegerOption((option) =>
        option
          .setName("time")
          .setDescription(
            "When to send results and scrambles in 4-digit time in your timezone. Eg. 2330 is 11:30pm."
          )
          .setRequired(true)
          .setMaxValue(2359)
          .setMinValue(0)
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
      .setDescription("Add an event to the competition")
      .addStringOption((option) =>
        option
          .setName("event-name")
          .setRequired(true)
          .setDescription("Name of the event")
      )
      .addIntegerOption((option) =>
        option
          .setName("attempts")
          .setRequired(true)
          .setDescription("The number of attempts")
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
      );

    const removeEventCommand = new SlashCommandBuilder()
      .setName("remove-event")
      .setDescription("Remove an event from the weekly comp")
      .addStringOption((option) =>
        option
          .setName("event-id")
          .setRequired(true)
          .setDescription("ID of the event to delete")
      );

    // Register

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
    ]);
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }
}

module.exports = {
  registerCommands,
};
