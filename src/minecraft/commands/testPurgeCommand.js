// TestPurgeCommand.js
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require("fs");
const fetch = require("node-fetch");
const config = require("../../../config"); // Assuming your config is in this location
const { fetchPlayerAPI } = require("../../../API/functions/GuildAPI"); // Assuming your fetchPlayerAPI function is exported from this location

class TestPurgeCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);
        this.name = "testpurge";
    }

    async isGuildMaster(playerUUID) {
        const guildResponse = await fetch(`https://api.hypixel.net/guild?key=${config.minecraft.API.hypixelAPIkey}&id=${config.minecraft.guild.guildID}`);
        const guildData = await guildResponse.json();

        for (const member of guildData.guild.members) {
            if (member.uuid === playerUUID && member.rank === "Guild Master") {
                return true;
            }
        }

        return false;
    }

    async onCommand(player, message) {
        // Check if the player is a guild master
        if (!await this.isGuildMaster(player.uuid)) {
            await this.send("You must be a Guild Master to use this command.");
            return;
        }

        const args = this.getArgs(message);
        const time = Number(args[0]); // Convert time to a number
        const reason = args.slice(1).join(" ") || "Inactive";

        // Function to read the whitelist file
        const getWhitelist = () => {
            try {
                const whitelistData = fs.readFileSync("./whitelist.json", "utf8");
                return JSON.parse(whitelistData);
            } catch (error) {
                console.error("Error reading whitelist file:", error);
                return [];
            }
        };

        // Fetch guild data
        const guildResponse = await fetch(`https://api.hypixel.net/guild?key=${config.minecraft.API.hypixelAPIkey}&id=${config.minecraft.guild.guildID}`);
        const guildData = await guildResponse.json();

        // Get whitelist
        const whitelist = getWhitelist();

        // Iterate over guild members and check last login time
        for (const member of guildData.guild.members) {
            const uuid = member.uuid;
            const playerData = await fetchPlayerAPI(uuid);
            const lastLogin = playerData.player.lastLogin;

            if ((Date.now() - lastLogin) > time) {
                // Check if the player is not whitelisted
                if (!whitelist.includes(uuid)) {
                    await this.send(`Player ${playerData.player.displayname} would be kicked for "${reason}"`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay between messages
                }
            }
        }
    }
}

module.exports = TestPurgeCommand;