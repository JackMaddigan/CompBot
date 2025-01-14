const { EmbedBuilder } = require("discord.js");
const { readData } = require("../db");
const { display } = require("../helpers");

async function handleView(int) {
  const results = await readData(
    `SELECT 
    results.*,
    events.event_name
FROM 
    results
INNER JOIN 
    events 
ON 
    results.event_id = events.event_id
WHERE 
    results.guild_id = ? AND results.user_id = ?`,
    [int.guild.id, int.member.id]
  );

  console.log(results);
  const embed = new EmbedBuilder()
    .setTitle(`Results for ${int.member.displayName}`)
    .addFields(
      ...results.reduce((acc, cur) => {
        acc.push({
          name: `${cur.event_name}`,
          value: `avg: ${display(cur.result_average)}\nbest: ${display(
            cur.result_best
          )}`,
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
