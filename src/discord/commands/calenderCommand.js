const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");
const { getSkyblockCalendar } = require("../../../API/functions/getCalendar.js");

module.exports = {
  name: "calender",
  description: "Shows upcoming events.",
  options: [],

  execute: async (interaction) => {
    console.log("Executing upcomingEvents command...");

    const EVENTS = getSkyblockCalendar();
    console.log("Fetched Skyblock Calendar:", EVENTS);

    const embed = new EmbedBuilder()
      .setTitle('Upcoming Events')
      .setColor(0xff0000);

    console.log("Building embed message...");

    for (const event in EVENTS.data.events) {
      const eventData = EVENTS.data.events[event];
      let dates = eventData.events.map(e => new Date(e.start_timestamp).toLocaleString()).slice(0, 5);
      embed.addField(eventData.name, dates.join('\n'), true);
    }

    console.log("Embed message built:", embed);

    await interaction.followUp({ embeds: [embed] });
    console.log("Embed message sent.");
  },
};