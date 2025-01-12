const { readData } = require("../db");
const { formats } = require("../formats");

async function handleSubmitFor(int) {
  // can check later if it is submit for by comparing int.member.id to member.id
  const member = int.options.getMember("user");
  handleSubmit(int, member);
}

async function handleSubmit(int, member = int.member) {
  const subEventName = int.options.getString("event").toLowerCase();
  const subText = int.options.getString("results");

  // check that eventName is valid for the guild
  const {
    event_id: eventId,
    event_name: eventName,
    event_format: eventFormat,
    event_attempts: eventAttempts,
  } = (
    await readData(
      `SELECT event_id, event_nae, event_format, event_attempts FROM events WHERE guild_id=? AND event_name=?`,
      [int.guild.id, subEventName]
    )
  )[0] ?? -1;

  if (eventId === -1) {
    // event does not exist
    return await int.reply({
      content: `${eventName} is not a valid event!\nUse /list-events to see the events for this server.`,
      flags: 64,
    });
  }

  // validate characters here instead of in the classes

  const result = new formats[eventFormat].class();
  result.validate(subText, eventName, eventAttempts);
}
