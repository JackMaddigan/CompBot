const { saveData } = require("../db");
const { makeJob, stopJob, setJob } = require("../cron");

async function handleSetup(int) {
  const scrambleChannel = int.options.getChannel("scramble-channel");
  const resultsChannel = int.options.getChannel("results-channel");
  const submitChannel = int.options.getChannel("submit-channel");
  const hour = int.options.getInteger("time-hour");
  const minute = int.options.getInteger("time-minute");
  const day = int.options.getInteger("time-day");
  const role = int.options.getRole("comp-ping-role"); // can be null
  const sendResultsFile = int.options.getBoolean("results-txt-file");
  const initialWeek = int.options.getInteger("start-week") || 1;

  const cronExp = `${minute} ${hour} * * ${day}`;
  const job = makeJob(int.guild.id, cronExp);

  // stop the previous time if the time was being changed
  stopJob(int.guild.id);
  setJob(int.guild.id, job);

  await int.reply({
    content: "Done",
    flags: 64,
  });
  await saveData(
    `INSERT INTO guilds (guild_id, guild_name, scramble_channel, results_channel, submit_channel, role_id, cron, week, results_file, initial_week) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(guild_id) DO UPDATE SET guild_name=excluded.guild_name, scramble_channel=excluded.scramble_channel, results_channel=excluded.results_channel, submit_channel=excluded.submit_channel, role_id=excluded.role_id, cron=excluded.cron, week=excluded.week, results_file=excluded.results_file, initial_week=excluded.initial_week`,
    [
      int.guild.id,
      int.guild.name,
      scrambleChannel.id,
      resultsChannel.id,
      submitChannel.id,
      role?.id || null,
      cronExp,
      0,
      sendResultsFile,
      initialWeek,
    ]
  );
}

module.exports = { handleSetup };
