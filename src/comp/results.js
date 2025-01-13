const { readData } = require("../db");
const { formats } = require("../formats");

getRankedResults("1140194673403646042");
async function getRankedResults(guildId) {
  // fetch all results from db
  const resultsData = await readData(`SELECT * FROM results WHERE guild_id=?`, [
    guildId,
  ]);

  // fetch all events from db
  const eventsData = (
    await readData(`SELECT * FROM events WHERE guild_id=?`, [guildId])
  ).reduce((acc, cur) => {
    acc[cur.event_id] = cur;
    return acc;
  }, {});

  // Return null if no events or results
  if (resultsData.length === 0 || eventsData.length === 0) {
    return null;
  }

  // make array with a key for each event id
  const eventArrays = Object.keys(eventsData).reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
  }, {});

  // add result objects to the event arrays
  for (const r of resultsData) {
    eventArrays[r.event_id].push(
      new formats[eventsData[r.event_id].event_format].class(r)
    );
  }

  // sort
  for (const results of Object.values(eventArrays)) {
    results.sort((a, b) => a.compare(b));
  }

  // give placings

  console.log(eventArrays, eventsData);
}
