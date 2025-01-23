const { readData, deleteData, saveData } = require("../db");
const { getRankedResults } = require("./results");
const scrambleArgs = require("../scramble-args.json");
const fs = require("fs/promises");

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

  let week = guildInfo.week || guildInfo.initial_week - 1 || 0;

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
  console.log(guildInfo);

  if (resultsData) {
    await sendPodiums(resultsChannel, resultsData, week);
    if (guildInfo.results_file) {
      await sendResultsFile(
        resultsChannel,
        resultsData,
        week,
        guildInfo.guild_id
      );
    }
  }

  // delete all results
  await deleteData(`DELETE FROM results WHERE guild_id=?`, [guildId]);

  week++;
  await sendScrambles(scramblesChannel, eventsData, guildInfo.role_id, week);

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
      if (result.isDnf || result.rank > 3) break;
      console.log(result);
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

async function sendResultsFile(resultsChannel, resultsData, week, guildId) {
  try {
    if (!resultsData) return; // null if there is no results
    const eventsTexts = [];
    for (const eventResults of Object.values(resultsData)) {
      let text = "";
      text += eventResults[0]?.eventName;
      for (const result of eventResults) {
        text += `\n${result.toCr()}`;
      }
      eventsTexts.push(text);
    }

    const path = `${guildId}_week${week}_results.txt`;

    await fs.writeFile(path, eventsTexts.join("\n\n"));

    await resultsChannel.send({
      files: [path],
    });

    await fs.unlink(path);
  } catch (error) {
    console.error("Error sending results file:", error);
  }
}

module.exports = { handleComp };
