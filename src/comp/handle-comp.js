const { readData, deleteData, saveData } = require("../db");
const { getRankedResults } = require("./results");
const scrambleArgs = require("../scramble-args.json");

var cstimer = require("cstimer_module");
const crypto = require("crypto");
const client = require("../client");

async function handleComp(guildId) {
  const guildInfo = (
    await readData(`SELECT * FROM guilds WHERE guild_id=?`, [guildId])
  )?.[0];

  if (!guildInfo) {
    return console.warn("Cannot handle comp which is not set up.");
  }

  let week = guildInfo.week || 0;

  const eventsData = await readData(`SELECT * FROM events WHERE guild_id=?`, [
    guildId,
  ]);

  const resultsData = await getRankedResults(guildId);

  const resultsChannel =
    client.channels.cache.get(guildInfo.results_channel) ||
    (await client.channels.fetch(guildInfo.results_channel));
  const scramblesChannel =
    client.channels.cache.get(guildInfo.scrambles_channel) ||
    (await client.channels.fetch(guildInfo.scramble_channel));

  if (week > 0) {
    await sendPodiums(resultsChannel, resultsData, week);
    // send results txt file
  }

  week++;
  await sendScrambles(scramblesChannel, eventsData, guildInfo.role_id, week);

  // delete all results
  //await deleteData(`DELETE FROM results WHERE guild_id=?`, [guildId]);

  // save new week
  await saveData(
    `UPDATE guilds
SET week = week + 1
WHERE guild_id=?`,
    [guildId]
  );
}

async function sendPodiums(resultsChannel, resultsData, week) {
  if (!resultsData) return; // null if there is no results
  await resultsChannel.send(`Week ${week} results!`);
  for (const results of Object.values(resultsData)) {
    let eventPodiumText = `**${results[0]?.eventName}**`;
    if (results[0]?.isDnf || results.length === 0) continue;
    for (const result of results) {
      if (result.isDnf || result.placing > 3) break;
      // add to podium text
      eventPodiumText += `\n${result.toPodiumString()}`;
    }
    await resultsChannel.send(eventPodiumText);
  }
}

async function sendScrambles(scramblesChannel, eventsData, roleId, week) {
  cstimer.setSeed(crypto.randomBytes(16).toString("hex"));
  await scramblesChannel.send(
    `${roleId ? `<@&${roleId}> ` : ""}Week ${week} scrambles! `
  );
  for (const event of eventsData) {
    let text = `**-\n${event.event_name}**\n`;
    for (let i = 0; i < event.event_attempts; i++) {
      text += `\n> ${i + 1}) ${cstimer.getScramble(
        event.scramble,
        scrambleArgs[event.scramble]
      )}\n`;
    }
    await scramblesChannel.send(text);
  }
}

module.exports = { handleComp };
