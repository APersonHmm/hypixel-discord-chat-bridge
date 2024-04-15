const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { EmbedBuilder } = require("discord.js");
const { getSkyblockCalendar } = require("../../../API/functions/getCalendar.js");
const axios = require('axios');

const yearZero = 1560275700000;
const dayMs = 50 * 60 * 1000;
const monthLength = 31;
const yearLength = 12 * monthLength;

function getSkyblockYear(time) {
  return Math.floor((time - yearZero) / (dayMs * yearLength));
}

function getSkyblockDay(time) {
  return Math.floor((time - yearZero) / dayMs) % (yearLength);
}

module.exports = {
  name: "calender",
  description: "Shows upcoming events.",
  options: [],

  execute: async (interaction) => {
    console.log("Executing upcomingEvents command...");

    const EVENTS = getSkyblockCalendar();
    console.log("Fetched Skyblock Calendar:", EVENTS);

    const events = new EmbedBuilder()
      .setTitle('Upcoming Events')
      .setColor(0xff0000);

    console.log("Building embed message...");

    // Fetch the active mayor
    const mayorResponse = await axios.get('https://api.hypixel.net/v2/resources/skyblock/election');
    const activeMayor = mayorResponse.data.mayor.name;

    const currentYear = getSkyblockYear(Date.now());
    const currentDay = getSkyblockDay(Date.now());

    // ELECTION
    events.addFields(
      { name: 'Election Opens', value: `<t:${Math.floor(EVENTS.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Election Closes', value: `<t:${Math.floor(EVENTS.data.events.ELECTION_OVER.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.ELECTION_OVER.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    // BANK
    events.addFields(
      { name: 'Bank Interest', value: `<t:${Math.floor(EVENTS.data.events.BANK_INTEREST.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.BANK_INTEREST.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Dark Auction', value: `<t:${Math.floor(EVENTS.data.events.DARK_AUCTION.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.DARK_AUCTION.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    // EVENTS
    events.addFields(
      { name: 'Spooky Festival', value: `<t:${Math.floor(EVENTS.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Fear Mongerer', value: `<t:${Math.floor(EVENTS.data.events.FEAR_MONGERER.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.FEAR_MONGERER.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Jacob Contest', value: EVENTS.data.events.JACOBS_CONTEST.events.slice(0, 3).map(e => `<t:${Math.floor(e.start_timestamp / 1000)}:f> (<t:${Math.floor(e.start_timestamp / 1000)}:R>)`).join('\n'), inline: true },
      { name: 'Fallen Star Cult', value: EVENTS.data.events.FALLEN_STAR_CULT.events.slice(0, 3).map(e => `<t:${Math.floor(e.start_timestamp / 1000)}:f> (<t:${Math.floor(e.start_timestamp / 1000)}:R>)`).join('\n'), inline: true },
      { name: 'Traveling Zoo', value: `<t:${Math.floor(EVENTS.data.events.TRAVELING_ZOO.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.TRAVELING_ZOO.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    // Add fields for Fishing Festival and Mining Fiesta
    if (activeMayor === 'Marina') {
      const nextMonthStart = yearZero + ((currentYear * yearLength + currentDay + (monthLength - currentDay % monthLength)) * dayMs);
      events.addFields(
        { name: 'Fishing Festival', value: `<t:${Math.floor(nextMonthStart / 1000)}:f> (<t:${Math.floor(nextMonthStart / 1000)}:R>)`, inline: true },
      );
    } else if (activeMayor === 'Cole') {
      events.addFields(
        { name: 'Mining Fiesta', value: `<t:${Math.floor(EVENTS.data.events.MINING_FIESTA.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.MINING_FIESTA.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      );
    }

    // JERRY
    events.addFields(
      { name: 'Jerrys Workshop opens', value: `<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Season of Jerry', value: `<t:${Math.floor(EVENTS.data.events.SEASON_OF_JERRY.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.SEASON_OF_JERRY.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Jerrys Workshop closes', value: `<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].end_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].end_timestamp / 1000)}:R>)`, inline: true },
      { name: 'New Year Celebration (Cakes)', value: `<t:${Math.floor(EVENTS.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    console.log("Embed message built:", events);

    events.setFooter({
      text: "/help [command] for more information",
      iconURL: "https://i.imgur.com/vt9IRtV.png",
    });

    await interaction.followUp({ embeds: [events] });
    console.log("Embed message sent.");
  },
};