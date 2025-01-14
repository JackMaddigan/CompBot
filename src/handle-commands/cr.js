const { EmbedBuilder } = require("discord.js");
const { getRankedResults } = require("../comp/results");

async function handleCr(int) {
  const data = await getRankedResults(int.guild.id);
  console.log(data);
  const lines = [];
  for (const [, event] of Object.entries(data)) {
    const eventResults = event.results;
    if (eventResults.length === 0) continue;
    lines.push(
      `**${event.eventData.event_name}**`,
      ...eventResults.slice(0, 10).map((r) => r.toCr())
    );
  }

  const texts = [];
  let currentText = "";
  for (const line of lines) {
    if (currentText.size + line.length + 1 > 4096) {
      texts.push(currentText);
      currentText = "";
    }
    currentText += (currentText ? "\n" : "") + line;
  }

  if (currentText) {
    texts.push(currentText);
  }

  const embeds = texts.map((text) =>
    new EmbedBuilder()
      .setDescription(text.length > 0 ? text : "No results yet!")
      .setTitle("Current Rankings")
      .setColor(process.env.color)
  );

  await int.reply({
    embeds: embeds,
    flags: 64,
  });
}

module.exports = { handleCr };
