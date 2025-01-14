const { readData } = require("../db");
const { formats } = require("../formats");

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
    acc[cur] = {
      results: [],
      eventData: eventsData[cur],
    };
    return acc;
  }, {});

  // add result objects to the event arrays
  for (const r of resultsData) {
    eventArrays[r.event_id].results.push(
      new formats[eventsData[r.event_id].event_format].class(r)
    );
  }

  // sort and give placings
  for (const { results } of Object.values(eventArrays)) {
    if (results.length === 0) continue;
    results.sort((a, b) => a.compare(b));
    results[0].setRank(1);
    for (let i = 1; i < results.length; i++) {
      results[i].setRank(
        results[i - 1].compare(results[i]) === -1
          ? i + 1
          : results[i - 1].getRank()
      );
    }
  }

  return eventArrays;
}

module.exports = { getRankedResults };
