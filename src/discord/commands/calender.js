const { Embed } = require("../../contracts/embedHandler.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { getSkyblockCalendar } = require("../../../API/functions/getCalendar.js");

module.exports = {
  name: "calendar",
  description: "Get Skyblock calendar.",
  requiresBot: true,

  execute: async (interaction) => {
    try {
      const response = getSkyblockCalendar();
      console.log(response);

      if (!response || response.status !== 200 || !response.data || !response.data.events) {
        throw new HypixelDiscordChatBridgeError("Error getting Skyblock calendar. Please try again.");
      }

      const calendar = response.data;

      const fields = calendar.events.map(event => {
        if (!event || !event.start || !event.end || !event.title || !event.type) {
          console.log(`Invalid event data. Please check the event structure.`, event);
          return null;
        }

        return {
          name: event.title,
          value: `Start: ${new Date(event.start)}\nEnd: ${new Date(event.end)}\nType: ${event.type}`,
          inline: true
        };
      }).filter(field => field !== null);

      const embed = new Embed("#2ECC71", "Skyblock Calendar", `Calendar from ${calendar.from} to ${calendar.to}`, fields);

      return await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      throw new HypixelDiscordChatBridgeError("Error getting Skyblock calendar. Please try again.");
    }
  },
};