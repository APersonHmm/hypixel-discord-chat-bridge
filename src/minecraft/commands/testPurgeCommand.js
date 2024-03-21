const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require("fs");
const { fetchPlayerAPI, fetchGuildAPI } = require("../../../API/functions/GuildAPI");

class TestPurgeCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);
        this.name = "testpurge";
    }

    async onCommand(player, message) {
        const args = this.getArgs(message);
        if (!args[0]) {
            return this.send("You must provide a time argument in the format '6w' or '1m'.");
        }

        const timeStr = args[0]; // Get the time string
        const reason = args.slice(1).join(" ") || "Inactive for too long"; // Get the reason or use the default

        // Function to convert time string to milliseconds
        const convertTimeStrToMs = (timeStr) => {
            const timeValue = Number(timeStr.slice(0, -1));
            const timeUnit = timeStr.slice(-1);

            switch (timeUnit) {
                case 'w': return timeValue * 7 * 24 * 60 * 60 * 1000; // weeks to milliseconds
                case 'm': return timeValue * 30 * 24 * 60 * 60 * 1000; // months to milliseconds
                default: throw new Error(`Invalid time unit: ${timeUnit}`);
            }
        };

        // Convert the time string to milliseconds
        const time = convertTimeStrToMs(timeStr);

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
        const guildData = await fetchGuildAPI();

        // Get whitelist
        const whitelist = getWhitelist();

        // Iterate over guild members and check last login time
        for (const member of guildData.guild.members) {
            const uuid = member.memberData.uuid;
            const lastLogin = member.playerData.lastLogin;

            console.log(`Player: ${member.playerData.displayname}, Last Login: ${new Date(lastLogin).toISOString()}`);

            if ((Date.now() - lastLogin) > time) {
                // Check if the player is not whitelisted
                if (!whitelist.includes(uuid)) {
                    const offlineTime = Date.now() - lastLogin;
                    const offlineDays = Math.floor(offlineTime / (1000 * 60 * 60 * 24));
                    console.log(`Player ${member.playerData.displayname} would be kicked for being offline for ${offlineDays} days`);
                    await this.send(`/oc Player ${member.playerData.displayname} has been offline for ${offlineDays} days`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay between messages
                }
            }
        }
    }
}

module.exports = TestPurgeCommand;