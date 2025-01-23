const { deleteData } = require("./db");

async function stopComp(guildId) {
  await deleteData(`DELETE FROM results WHERE guild_id=?`, [guildId]);
  await deleteData(`DELETE FROM guilds WHERE guild_id=?`, [guildId]);
  await deleteData(`DELETE FROM events WHERE guild_id=?`, [guildId]);
}

async function handleStopComp(int) {
  await int.deferReply({ flags: 64 });
  await stopComp(int.guild.id);
  await int.editReply("All data deleted.");
}

module.exports = { handleStopComp, stopComp };
