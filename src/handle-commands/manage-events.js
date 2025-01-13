const { readData, saveData, deleteData } = require("../db");

async function addEvent(int) {
  const events = await readData(`SELECT * FROM events WHERE guild_id=?`, [
    int.guild.id,
  ]);
  const eventName = int.options.getString("event-name");
  const format = int.options.getString("event-format");
  const attempts = int.options.getInteger("attempts");
  console.log(eventName, attempts, format);
  if (events.some((e) => e.event_name === eventName)) {
    return await int.reply({
      content: `There is already an event called ${eventName}!\nIf you want to modify it, delete it first.`,
      flags: 64,
    });
  }

  await int.reply({
    content: `Added ${eventName}.`,
    flags: 64,
  });

  await saveData(
    `INSERT INTO events (event_name, event_format, event_attempts, guild_id) VALUES (?, ?, ?, ?)`,
    [eventName, format, attempts, int.guild.id]
  );
}

async function removeEvent(int) {
  const eventId = int.options.getInteger("event-id");

  const deleteEvent = await deleteData(
    `DELETE FROM events WHERE event_id=? AND guild_id=?`,
    [eventId, int.guild.id]
  );
  const deleteResults = await deleteData(
    `DELETE FROM results WHERE event_id=? AND guild_id=?`,
    [eventId, int.guild.id]
  );

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
      : events
          .map(
            (e) =>
              `${e.event_id} ${e.event_name} ${e.event_format} ${e.event_attempts}`
          )
          .join("\n");

  await int.reply({
    content: text,
    flags: 64,
  });
}

module.exports = {
  listEvents,
  addEvent,
  removeEvent,
};
