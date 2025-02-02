const { readData, saveData, deleteData } = require("../db");
const { formats } = require("../formats");
const scrambleArgs = require("../scramble-args.json");
const fs = require("fs");

async function addEvent(int) {
  const events = await readData(`SELECT * FROM events WHERE guild_id=?`, [
    int.guild.id,
  ]);

  const eventName = int.options.getString("event-name");
  const format = int.options.getString("event-format");
  const scramble = int.options.getString("scramble-type");
  const attempts = int.options.getInteger("attempts");

  if (events.some((e) => e.event_name === eventName)) {
    return await int.reply({
      content: `There is already an event called ${eventName}!\nIf you want to modify it, delete it first.`,
      flags: 64,
    });
  }

  if (events.length >= 25) {
    return await int.reply({
      content: `You already have the maximum of 25 events!`,
      flags: 64,
    });
  }

  if (!scrambleArgs.hasOwnProperty(scramble)) {
    return await int.reply({
      content: `Invalid scramble code.`,
      flags: 64,
    });
  }

  await int.reply({
    content: `Added ${eventName}.`,
    flags: 64,
  });

  await saveData(
    `INSERT INTO events (event_name, event_format, event_attempts, scramble, guild_id) VALUES (?, ?, ?, ?, ?)`,
    [eventName, format, attempts, scramble, int.guild.id]
  );
}

async function removeEvent(int) {
  const eventId = int.options.getInteger("event-id");

  await deleteData(`DELETE FROM events WHERE event_id=? AND guild_id=?`, [
    eventId,
    int.guild.id,
  ]);
  await deleteData(`DELETE FROM results WHERE event_id=? AND guild_id=?`, [
    eventId,
    int.guild.id,
  ]);

  await int.reply({
    content: "Deleted",
    flags: 64,
  });
}

async function listEvents(int) {
  const events = await readData(`SELECT * FROM events WHERE guild_id=?`, [
    int.guild.id,
  ]);

  const text =
    events.length === 0
      ? "This server has no events!"
      : JSON.stringify(events, null, 2);

  if (text.length <= 2000) {
    await int.reply({
      content: text,
      flags: 64,
    });
  } else {
    const path = `${int.guild.id}_events`;
    fs.writeFileSync(path, text);
    await int.reply({
      content: text,
      flags: 64,
    });
    fs.unlinkSync(path);
  }
}

async function setEventsJson(int) {
  const eventsJsonArray = int.options.getString("json");

  // Check it is valid JSON and an array
  try {
    const result = JSON.parse(eventsJsonArray);
    if (!Array.isArray(result) || result.length > 25) {
      throw new Error("Must be an array with no more than 25 events.");
    }

    for (const event of result) {
      if (
        !(
          validateEventName(event) &&
          validateEventFormat(event) &&
          validateEventAttempts(event) &&
          validateScrambleArgs(event)
        )
      ) {
        {
          throw new Error(JSON.stringify(event) + " is invalid.");
        }
      }
    }

    await int.reply({
      content: "Ok",
      flags: 64,
    });

    // delete old events and results
    await deleteData(`DELETE FROM events WHERE guild_id=?`, [int.guild.id]);
    await deleteData(`DELETE FROM results WHERE guild_id=?`, [int.guild.id]);

    // save all new events
    for (const event of result) {
      await saveData(
        `INSERT INTO events (event_name, event_format, event_attempts, scramble, guild_id) VALUES (?, ?, ?, ?, ?)`,
        [
          event.event_name,
          event.event_format,
          event.event_attempts,
          event.scramble,
          int.guild.id,
        ]
      );
    }
  } catch (error) {
    return await int.reply({
      content: error.message,
      flags: 64,
    });
  }
}

function validateEventName(event) {
  if (!event.hasOwnProperty("event_name")) {
    return false;
  }
  const eventName = event.event_name.toString().trim();
  return eventName.length > 0 && eventName.length < 16;
}

function validateEventFormat(event) {
  if (!event.hasOwnProperty("event_format")) {
    return false;
  }
  const format = event.event_format.toString().trim();
  return Object.keys(formats).includes(format);
}

function validateEventAttempts(event) {
  if (!event.hasOwnProperty("event_attempts")) {
    return false;
  }
  const attempts = Number.parseInt(event.event_attempts.toString().trim());
  return attempts > 0 && attempts <= 25;
}

function validateScrambleArgs(event) {
  return Object.keys(scrambleArgs).includes(event.scramble);
}

module.exports = {
  listEvents,
  addEvent,
  removeEvent,
  setEventsJson,
};
