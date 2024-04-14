const { Embed } = require("../../contracts/embedHandler.js");
const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { buildSkyblockCalendar } = require("../../../API/constants/calendar.js");

module.exports = {
  name: "calendar",
  description: "Get Skyblock calendar.",
  requiresBot: true,

  execute: async (interaction) => {
    try {
      const calendar = buildSkyblockCalendar();

      if (!calendar || !calendar.events) {
        throw new HypixelDiscordChatBridgeError("Error getting Skyblock calendar. Please try again.");
      }

      const fields = Object.entries(calendar.events).map(([key, event]) => {
        if (!event.name || !event.duration || !event.events) {
          throw new HypixelDiscordChatBridgeError("Invalid event data. Please check the event structure.");
        }

        return {
          name: event.name,
          value: `Duration: ${event.duration} ms\nEvents: ${event.events.length}`,
          inline: true
        };
      });

      const embed = new Embed("#2ECC71", "Skyblock Calendar", `Calendar from ${calendar.from} to ${calendar.to}`, fields);

      return await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      throw new HypixelDiscordChatBridgeError("Error getting Skyblock calendar. Please try again.");
    }
  },
};