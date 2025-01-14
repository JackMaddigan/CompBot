const { readData, saveData } = require("../db");
const { formats } = require("../formats");

async function handleSubmitFor(int) {
  const member = int.options.getMember("user");
  handleSubmit(int, member);
}

async function handleSubmit(int, member = int.member) {
  const subEventName = int.options.getString("event").toLowerCase();
  const subText = int.options.getString("results");

  // check that eventName is valid for the guild
  const {
    event_id: eventId,
    event_format: eventFormat,
    event_attempts: eventAttempts,
  } = (
    await readData(
      `SELECT event_id, event_name, event_format, event_attempts FROM events WHERE guild_id=? AND event_name=?`,
      [int.guild.id, subEventName]
    )
  )[0] || {};

  if (!eventId) {
    // event does not exist
    return await int.reply({
      content: `${subEventName} is not a valid event!\nUse /list-events to see the events for this server.`,
      flags: 64,
    });
  }

  // validate characters and length here
  const invalidSolves = [];
  const pendingSolves = subText.split(/[ ,]+/);
  const regex = /^(dnf|dns|\d{1,2}(:\d{1,2}){0,2}(\.\d+)?)$/i;
  for (const chunk of pendingSolves) {
    if (!chunk.match(regex)) {
      invalidSolves.push(`Invalid time: ${chunk}`);
    }
  }

  const correctAttemptsQuantity = pendingSolves.length === eventAttempts;

  if (invalidSolves.length > 0 || !correctAttemptsQuantity) {
    let text = invalidSolves.length > 0 ? invalidSolves.join("\n") : "";
    text += !correctAttemptsQuantity
      ? `\nInvalid number of solves!\nExpected: ${eventAttempts},\nReceived: ${pendingSolves.length}`
      : "";
    return await int.reply({
      content: text,
      flags: 64,
    });
  }

  // Everything is valid
  const result = new formats[eventFormat].class();
  result.calculateStats(pendingSolves);
  const { average, best } = result.getStats();

  // reply
  const response = result.getResponse();
  await int.reply({
    content: `${response} for ${subEventName}`,
    flags: int.member.id !== member.id ? 64 : 0,
  });

  // save
  await saveData(
    `INSERT INTO results (event_id, guild_id, user_id, user_name, result_average, result_best) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(event_id, guild_id, user_id) DO UPDATE SET result_average=excluded.result_average, result_best=excluded.result_best`,
    [eventId, int.guild.id, member.id, member.displayName, average, best]
  );
}

module.exports = { handleSubmit, handleSubmitFor };
