const { readData } = require("./db");
const { handleComp } = require("./comp/handle-comp");
const cron = require("node-cron");

const jobs = new Map();

function setJob(guildId, job) {
  console.log("setting job for", guildId);
  jobs.set(guildId, job);
}

function stopJob(guildId) {
  console.log("stopping job for", guildId);
  const job = jobs.get(guildId);
  if (!job) return;
  job.stop();
  jobs.delete(guildId);
}

async function startAllJobs() {
  const data = await readData("SELECT guild_id, cron FROM guilds");
  for (const item of data) {
    if (cron.validate(item?.cron)) {
      jobs.set(item.guild_id, makeJob(item.guild_id, item.cron));
    }
  }
}

function makeJob(guildId, cronExp) {
  console.log("Making job", guildId, cronExp);
  return cron.schedule(cronExp, async () => {
    try {
      await handleComp(guildId);
    } catch (error) {
      console.error("Error handling comp:", error);
    }
  });
}

module.exports = { setJob, stopJob, makeJob, startAllJobs };
