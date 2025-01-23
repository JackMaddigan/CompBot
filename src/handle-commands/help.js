const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const scrambleArgs = require("../scramble-args.json");

async function handleHelp(int) {
  const isAdmin = int.member.permissions.has(
    PermissionsBitField.Flags.KickMembers
  );

  const adminEmbed = new EmbedBuilder()
    .setTitle("How to set up")
    .setColor("ed6f4e")
    .setDescription(
      `**Step 1**\nUse /setup and fill out the fields. If you wish to make changes later, you can use this command again and it will save the changes.\n
      **Step 2**\nTo add events, you can either add them individually with /add-event, or with /set-events-json.\n\n*/add-event*\nIt is best to make the event name short so you don't have to type much when submitting. It will also work when submitting if you only type the first few letters of the event. The scramble type should be one of:\n\n${Object.keys(
        scrambleArgs
      ).join(
        ", "
      )}.\n\nYou can see what these mean [here](<https://github.com/cs0x7f/cstimer/blob/master/src/lang/en-us.js>).\n\n*/set-events-json*\nYou can use this command to set all the events at once as a JSON file. Below is an example for one event only, you can add more into the array. The options are the same as in the /add-event command.
      [
        {
            "event_name": "3x3",
            "event_format": "aon",
            "event_attempts": 5,
            "scramble": "333",
        },
      ]`
    );

  const helpEmbed = new EmbedBuilder()
    .setTitle("Help")
    .setDescription(
      `**How to submit**\nTo submit, use /submit and type the event name, or the first few letters of it so that it can be distinguished. You can see all events by using /list-events. Add your results separated by spaces (or spaces and commas). DNF and DNS can be used (case insensitive).\n\n**How to see my results**\nUse /view to see your results, and /cr to see the current rankings.`
    )
    .setColor(process.env.color);

  const embeds = [adminEmbed, helpEmbed];
  await int.reply({ embeds: embeds, flags: 64 });
}

module.exports = { handleHelp };
