const { EmbedBuilder } = require("discord.js");
const { readData } = require("../db");
const { formats } = require("../formats");

async function handleView(int) {
  const results = await readData(
    `SELECT 
    results.event_id, results.user_name, results.result_average, results.result_best,
    events.event_name, events.event_format, events.event_attempts
FROM 
    results
INNER JOIN 
    events 
ON 
    results.event_id = events.event_id
WHERE 
    results.guild_id = ? AND results.user_id=?`,
    [int.guild.id, int.member.id]
  );

  const embed = new EmbedBuilder()
    .setTitle(`Results for ${int.member.displayName}`)
    .addFields(
      ...results.reduce((acc, cur) => {
        const resultObj = new formats[cur.event_format].class(cur);
        acc.push({
          name: cur.event_name,
          value: resultObj.toView(),
          inline: true,
        });
        return acc;
      }, [])
    )
    .setColor(process.env.color);

  await int.reply({
    embeds: [embed],
    flags: 64,
  });
}

module.exports = { handleView };
