const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require("fs");
const { fetchPlayerAPI, fetchGuildAPI, isGuildMaster } = require("../../../API/functions/GuildAPI");

class TestPurgeCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);
        this.name = "testpurge";
    }

    async onCommand(player, message) {
        // Check if the player is a guild master
        if (!await isGuildMaster(player.uuid)) {
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
        const guildData = await fetchGuildAPI(config.minecraft.guild.guildID);

        // Get whitelist
        const whitelist = getWhitelist();

        // Iterate over guild members and check last login time
        for (const member of guildData.members) {
            const uuid = member.uuid;
            const playerData = await fetchPlayerAPI(uuid);
            const lastLogin = playerData.lastLogin;

            if ((Date.now() - lastLogin) > time) {
                // Check if the player is not whitelisted
                if (!whitelist.includes(uuid)) {
                    await this.send(`Player ${playerData.displayname} would be kicked for "${reason}"`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay between messages
                }
            }
        }
    }
}

module.exports = TestPurgeCommand;