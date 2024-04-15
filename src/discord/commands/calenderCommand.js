const { Embed } = require("../../contracts/embedHandler.js");
const { getSkyblockCalendar } = require("./getCalendar.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

module.exports = {
  name: "upcomingEvents",
  description: "Shows upcoming events.",
  requiresBot: true,

  execute: async (interaction) => {
    try {
      const calendarData = await getSkyblockCalendar();

      const formattedData = calendarData.map(event => {
        const eventDates = event.events.slice(0, 5).map(e => `Start: ${new Date(e.start_timestamp).toLocaleString()}, End: ${new Date(e.end_timestamp).toLocaleString()}`).join('\n');
        return `**${event.name}**\n${eventDates}\n`;
      }).join('\n');

      const embed = new Embed("#2ECC71", "Upcoming Events", formattedData);

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      throw new HypixelDiscordChatBridgeError("An error occurred while fetching the calendar data. Please try again.");
    }
  },
};