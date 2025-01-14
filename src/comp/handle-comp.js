const { readData } = require("../db");
const { getRankedResults } = require("./results");
const client = require("../client");

async function handleComp(guildId) {
  const guildInfo = (
    await readData(`SELECT * FROM guilds WHERE guild_id=?`, [guildId])
  )?.[0];

  if (!guildInfo) {
    return console.warn("Cannot handle comp which is not set up.");
  }

  const week = guildInfo.week || 1;

  const resultsData = await getRankedResults(guildId);
  const resultsChannel =
    client.channels.cache.get(guildInfo.results_channel) ||
    (await client.channels.fetch(guildInfo.results_channel));

  await sendPodiums(resultsChannel, resultsData, guildInfo, week);
  console.log(resultsData);

  // get week
  // send podiums
}

async function sendPodiums(resultsChannel, resultsData, guildInfo, week) {
  await resultsChannel.send(
    `${
      guildInfo.role_id ? `<@&${guildInfo.role_id}> ` : ""
    } Week ${week} results!`
  );
  for (const value of Object.values(resultsData)) {
    let eventPodiumText = `**${value.eventData.event_name}**`;
    console.log(value.results[0]?.isDnf);
    if (value.results[0]?.isDnf || value.results.length === 0) continue;
    for (const result of value.results) {
      if (result.isDnf || result.placing > 3) break;
      // add to podium text
      eventPodiumText += `\n${result.toPodiumString()}`;
    }
    console.log(eventPodiumText);
    await resultsChannel.send(eventPodiumText);
  }
}

module.exports = { handleComp };
