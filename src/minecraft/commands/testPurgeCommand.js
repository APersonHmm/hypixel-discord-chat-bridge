const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { fetchPlayerAPI, fetchGuildAPI } = require("../../../API/functions/GuildAPI");

class TestPurgeCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "testpurge";
        this.aliases = [];
        this.description = "Test purge of members based on last login time.";
        this.options = [
            {
                name: "time",
                description: "Time duration (e.g., '6w' for 6 weeks, '1m' for 1 month)",
                required: true,
            },
            {
                name: "reason",
                description: "Reason for the purge",
                required: true,
            },
        ];
    }

    async onCommand(username, message) {
        // Parse the arguments
        const args = this.getArgs(message);
        const timeArg = args[0] || '1m';  // Default to '1m' if no time argument is provided
        const reason = args[1] || 'No reason provided';  // Default to 'No reason provided' if no reason is provided

        const timeUnit = timeArg.slice(-1);
        let time;
        switch (timeUnit) {
            case 'w':
                time = parseInt(timeArg) * 7 * 24 * 60 * 60 * 1000;  // Convert weeks to milliseconds
                break;
            case 'm':
                time = parseInt(timeArg) * 30 * 24 * 60 * 60 * 1000;  // Convert months to milliseconds
                break;
            default:
                console.log('Invalid time unit. Please use "w" for weeks or "m" for months.');
                return;
        }

        // Fetch guild data
        const guildData = await fetchGuildAPI();

        // Fetch player data for each member
        const membersData = await Promise.all(guildData.members.map(async (member) => {
            const playerData = await fetchPlayerAPI(member.uuid);
            return {
                memberData: {
                    uuid: member.uuid,
                    rank: member.rank,
                    joined: member.joined,
                    expHistory: member.expHistory
                },
                playerData: {
                    id: playerData._id,
                    uuid: playerData.uuid,
                    displayname: playerData.displayname,
                    firstLogin: playerData.firstLogin,
                    lastLogin: playerData.lastLogin
                }
            };
        }));

        // Iterate over guild members and check last login time
        for (const member of membersData) {
            const lastLogin = member.playerData.lastLogin;

            if ((Date.now() - lastLogin) > time) {
                const offlineTime = Date.now() - lastLogin;
                const offlineDays = Math.floor(offlineTime / (1000 * 60 * 60 * 24));
                console.log(`Player ${member.playerData.displayname} would be kicked for being offline for ${offlineDays} days`);
                await this.minecraft.send(`/oc Player ${member.playerData.displayname} has been offline for ${offlineDays} days`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay between messages
            }
        }
    }
}

module.exports = TestPurgeCommand;