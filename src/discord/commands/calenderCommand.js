const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const { getSkyblockCalendar } = require("../../../API/functions/getCalendar.js");



module.exports = {
    name: "calendar",
    description: "Shows the upcoming events and their timestamps.",
    requiresBot: true,
  
    execute: async (interaction) => {
      const EVENTS = getSkyblockCalendar();
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Upcoming Events");
  
      // Election
      embed.addFields({ name: "Election", value: `Opens: ${EVENTS.data.events.ELECTION_OPEN?.start_timestamp || "Unknown"}\nCloses: ${EVENTS.data.events.ELECTION_CLOSE?.start_timestamp || "Unknown"}` });
  
      // Bank
      embed.addFields({ name: "Bank", value: `Interest: ${EVENTS.data.events.BANK_INTEREST?.start_timestamp || "Unknown"}\nDark Auction: ${EVENTS.data.events.DARK_AUCTION?.start_timestamp || "Unknown"}` });
  
      // Events
      embed.addFields({ name: "Events", value: `Spooky Festival: ${EVENTS.data.events.SPOOKY_FESTIVAL?.start_timestamp || "Unknown"}\nFear Mongerer: ${EVENTS.data.events.FEAR_MONGERER?.start_timestamp || "Unknown"}\nJacob Contest: ${EVENTS.data.events.JACOB_CONTEST?.map(event => event.start_timestamp).join(', ') || "Unknown"}\nFallen Star Cult: ${EVENTS.data.events.FALLEN_STAR_CULT?.map(event => event.start_timestamp).join(', ') || "Unknown"}\nTraveling Zoo: ${EVENTS.data.events.TRAVELING_ZOO?.start_timestamp || "Unknown"}` });
  
      // Jerry
      embed.addFields({ name: "Jerry", value: `Workshop Opens: ${EVENTS.data.events.JERRY_WORKSHOP_OPEN?.start_timestamp || "Unknown"}\nSeason of Jerry: ${EVENTS.data.events.SEASON_OF_JERRY?.start_timestamp || "Unknown"}\nWorkshop Closes: ${EVENTS.data.events.JERRY_WORKSHOP_CLOSE?.start_timestamp || "Unknown"}\nNew Year Celebration: ${EVENTS.data.events.NEW_YEAR_CELEBRATION?.start_timestamp || "Unknown"}` });
  
      // Special Events
      embed.addFields({ name: "Marina", value: `Fishing Festivals: ${EVENTS.data.events.FISHING_FESTIVAL?.map(event => event.start_timestamp).join(', ') || "Unknown"}` });
      embed.addFields({ name: "Cole", value: `Fiestas: ${EVENTS.data.events.FIESTA?.map(event => event.start_timestamp).join(', ') || "Unknown"}` });
  
      await interaction.reply({ embeds: [embed.build()] });
    },
  };