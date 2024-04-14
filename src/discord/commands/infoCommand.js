const HypixelDiscordChatBridgeError = require("../../contracts/errorHandler.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../../config.json");
const fs = require("fs");

function splitIntoChunks(str, chunkSize) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < str.length) {
    chunks.push(str.substr(startIndex, chunkSize));
    startIndex += chunkSize;
  }

  return chunks;
}

module.exports = {
  name: "info",
  description: "Shows information about the bot.",
  requiresBot: true,

  execute: async (interaction) => {
    if (bot === undefined || bot._client.chat === undefined) {
      throw new HypixelDiscordChatBridgeError("Bot doesn't seem to be connected to Hypixel. Please try again.");
    }

    const commands = interaction.client.commands;

    const { discordCommands, minecraftCommands } = getCommands(commands);

    const chunkSize = 1024; // Adjust this value based on your needs

    const discordChunks = splitIntoChunks(discordCommands, chunkSize);
    const minecraftChunks = splitIntoChunks(minecraftCommands, chunkSize);

    const infoEmbed = new MessageEmbed()
      .setColor(0x0099ff)
      .setTitle("Hypixel Bridge Bot Commands");

    discordChunks.forEach((chunk, index) => {
      infoEmbed.addField(`Discord Commands ${index + 1}`, chunk, true);
    });

    minecraftChunks.forEach((chunk, index) => {
      infoEmbed.addField(`Minecraft Commands ${index + 1}`, chunk, true);
    });

    infoEmbed
      .addField("\u200B", "\u200B")
      .addField(
        "Minecraft Information",
        `Bot Username: \`${bot.username}\`\nPrefix: \`${config.minecraft.bot.prefix}\`\nSkyBlock Events: \`${
          config.minecraft.skyblockEventsNotifications.enabled ? "enabled" : "disabled"
        }\`\nAuto Accept: \`${
          config.minecraft.guildRequirements.autoAccept ? "enabled" : "disabled"
        }\`\nGuild Experience Requirement: \`${config.minecraft.guild.guildExp.toLocaleString()}\`\nUptime: Online since <t:${Math.floor(
          (Date.now() - client.uptime) / 1000
        )}:R>\nVersion: \`${require("../../../package.json").version}\`\n`,
        true
      )
      .addField(
        "Discord Information",
        `Guild Channel: ${
          config.discord.channels.guildChatChannel ? `<#${config.discord.channels.guildChatChannel}>` : "None"
        }\nOfficer Channel: ${
          config.discord.channels.officerChannel ? `<#${config.discord.channels.officerChannel}>` : "None"
        }\nGuild Logs Channel: ${
          config.discord.channels.loggingChannel ? `<#${config.discord.channels.loggingChannel}>` : "None"
        }\nDebugging Channel: ${
          config.discord.channels.debugChannel ? `<#${config.discord.channels.debugChannel}>` : "None"
        }\nCommand Role: <@&${config.discord.commands.commandRole}>\nMessage Mode: \`${
          config.discord.other.messageMode
        }\`\nFilter: \`${config.discord.other.filterMessages ? "enabled" : "disabled"}\`\nJoin Messages: \`${
          config.discord.other.joinMessage ? "enabled" : "disabled"
        }\``,
        true
      )
      .setFooter("help [command] for more information", "https://imgur.com/tgwQJTX.png");

    await interaction.followUp({ embeds: [infoEmbed] });
  },
};

function getCommands(commands) {
  const discordCommands = commands
    .map(({ name, options }) => {
      const optionsString = options?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`)).join("");
      return `- \`${name}${optionsString ? optionsString : ""}\`\n`;
    })
    .join("");

  const minecraftCommands = fs
    .readdirSync("./src/minecraft/commands")
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = new (require(`../../minecraft/commands/${file}`))();
      const optionsString = command.options
        ?.map(({ name, required }) => (required ? ` (${name})` : ` [${name}]`))
        .join("");

      return `- \`${command.name}${optionsString}\`\n`;
    })
    .join("");

  return { discordCommands, minecraftCommands };
}
