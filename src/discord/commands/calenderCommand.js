const { EmbedBuilder } = require("discord.js");
const { buildSkyblockCalendar } = require("../../API/constants/calendar.js");

// Call the function with your desired parameters
const calendar = buildSkyblockCalendar();

// Create a new embed builder
const embed = new EmbedBuilder()
  .setTitle("Skyblock Calendar")
  .setDescription(`Calendar from ${calendar.from} to ${calendar.to}`)
  .addField("Date", calendar.date, true)
  .addField("Year", calendar.year, true)
  .addField("Month", calendar.month, true)
  .addField("Day", calendar.day, true)
  .addField("Time", calendar.time, true)
  .addField("Hour", calendar.hour, true)
  .addField("Minute", calendar.minute, true)
  .addField("Next Day Countdown", calendar.next_day_countdown, true)
  .addField("Next Month Countdown", calendar.next_month_countdown, true)
  .addField("Next Year Countdown", calendar.next_year_countdown, true);

// Add fields for each event
Object.entries(calendar.events).forEach(([key, event]) => {
  embed.addField(event.name, `Duration: ${event.duration} ms\nEvents: ${event.events.length}`);
});

// Send the embed
channel.send(embed);