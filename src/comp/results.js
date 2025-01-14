const { readData } = require("../db");
const { formats } = require("../formats");

async function getRankedResults(guildId) {
  // fetch all results from db
  const resultsData = await readData(
    `SELECT 
    results.result_id, results.event_id, results.user_id, results.user_name, results.result_average, results.result_best,
    events.event_name, events.event_format, events.event_attempts
FROM 
    results
INNER JOIN 
    events 
ON 
    results.event_id = events.event_id
WHERE 
    results.guild_id = ?`,
    [guildId]
  );

  // Return null if no events or results
  if (resultsData.length === 0) {
    return null;
  }

  // make array with a key for each event id
  const eventArrays = {};

  // add result objects to the event arrays
  for (const r of resultsData) {
    if (!eventArrays[r.event_id]) eventArrays[r.event_id] = [];
    eventArrays[r.event_id].push(new formats[r.event_format].class(r));
  }

  // sort and give placings
  for (const results of Object.values(eventArrays)) {
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
