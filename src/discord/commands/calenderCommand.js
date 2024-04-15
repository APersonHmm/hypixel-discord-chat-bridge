const { Embed } = require("../../contracts/embedHandler.js");
const { getSkyblockCalendar } = require("../../../API/functions/getCalendar.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");

const fs = require('fs');
const path = require('path');

module.exports = {
  name: "calender",
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
  
      // Write the response to a file
      fs.writeFile(path.join(__dirname, 'debug.txt'), formattedData, (err) => {
        if (err) {
          console.error('Failed to write to file:', err);
        }
      });
  
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      throw new HypixelDiscordChatBridgeError("An error occurred while fetching the calendar data. Please try again.");
    }
  },
};