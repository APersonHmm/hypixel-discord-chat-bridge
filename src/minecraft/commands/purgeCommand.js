// PurgeCommand.js
const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require("fs");
const fetch = require("node-fetch");

class PurgeCommand {
    constructor(minecraft) {
        this.minecraft = minecraft;
    }

    async onCommand(player, message) {
        const args = message.split(" ");
        const time = args[1];
        const reason = args.slice(2).join(" ") || "Inactive";

        try {
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
                        await this.minecraft.send(`/g kick ${playerData.player.displayname} "${reason}"`);
                        await delay(1000); // Add a delay between kicks
                    }
                }
            }
        } catch (error) {
            console.error("Error in PurgeCommand:", error);
            this.minecraft.send(`/gc An error occurred during the purge: ${error}`);
        }
    }
}

module.exports = PurgeCommand;
