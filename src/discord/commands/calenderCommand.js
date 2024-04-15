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

    // ELECTION
    embed.addFields('ELECTION', '');
    embed.addFields(
      { name: 'Election Opens', value: `<t:${Math.floor(EVENTS.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.ELECTION_BOOTH_OPENS.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Election Closes', value: `<t:${Math.floor(EVENTS.data.events.ELECTION_OVER.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.ELECTION_OVER.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    // BANK
    embed.addFields('BANK', '');
    embed.addFields(
      { name: 'Bank Interest', value: `<t:${Math.floor(EVENTS.data.events.BANK_INTEREST.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.BANK_INTEREST.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Dark Auction', value: `<t:${Math.floor(EVENTS.data.events.DARK_AUCTION.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.DARK_AUCTION.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    // EVENTS
    embed.addFields('EVENTS', '');
    embed.addFields(
      { name: 'Spooky Festival', value: `<t:${Math.floor(EVENTS.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.SPOOKY_FESTIVAL.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Fear Mongerer', value: `<t:${Math.floor(EVENTS.data.events.FEAR_MONGERER.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.FEAR_MONGERER.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Jacob Contest', value: EVENTS.data.events.JACOBS_CONTEST.events.slice(0, 3).map(e => `<t:${Math.floor(e.start_timestamp / 1000)}:f> (<t:${Math.floor(e.start_timestamp / 1000)}:R>)`).join('\n'), inline: true },
      { name: 'Fallen Star Cult', value: EVENTS.data.events.FALLEN_STAR_CULT.events.slice(0, 3).map(e => `<t:${Math.floor(e.start_timestamp / 1000)}:f> (<t:${Math.floor(e.start_timestamp / 1000)}:R>)`).join('\n'), inline: true },
      { name: 'Traveling Zoo', value: `<t:${Math.floor(EVENTS.data.events.TRAVELING_ZOO.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.TRAVELING_ZOO.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    // JERRY
    embed.addFields('JERRY', '');
    embed.addFields(
      { name: 'Jerrys Workshop opens', value: `<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Season of Jerry', value: `<t:${Math.floor(EVENTS.data.events.SEASON_OF_JERRY.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.SEASON_OF_JERRY.events[0].start_timestamp / 1000)}:R>)`, inline: true },
      { name: 'Jerrys Workshop closes', value: `<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].end_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.JERRYS_WORKSHOP.events[0].end_timestamp / 1000)}:R>)`, inline: true },
      { name: 'New Year Celebration (Cakes)', value: `<t:${Math.floor(EVENTS.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp / 1000)}:f> (<t:${Math.floor(EVENTS.data.events.NEW_YEAR_CELEBRATION.events[0].start_timestamp / 1000)}:R>)`, inline: true },
    );

    console.log("Embed message built:", embed);

    await interaction.followUp({ embeds: [embed] });
    console.log("Embed message sent.");
  },
};