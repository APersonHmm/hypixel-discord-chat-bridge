const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fetchGuildAPI = require("../../../API/functions/GuildAPI");  // Import the fetchGuildAPI function

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

    async onCommand(args) {
        console.log('onCommand started');  // Debugging line
    
        // Parse the time argument
        const timeArg = args[0];
        console.log('timeArg:', timeArg);  // Debugging line
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
                this.send('/oc Invalid time unit. Please use "w" for weeks or "m" for months.');
                return;
        }
        console.log('time:', time);  // Debugging line
    
        // Fetch guild data
        console.log('Fetching guild data...');  // Debugging line
        this.send('/oc Fetching guild data...');  // Debugging line
        const guildData = await fetchGuildAPI();
        console.log('Guild data fetched');  // Debugging line
        this.send('/oc Guild data fetched');  // Debugging lin

        // Iterate over guild members and check last login time
        console.log('Iterating over guild members...');  // Debugging line
        for (const member of guildData.guild.members) {
            const lastLogin = member.playerData.lastLogin;
            console.log(`Checking last login time for player ${member.playerData.displayname}`);  // Debugging line

            if ((Date.now() - lastLogin) > time) {
                const offlineTime = Date.now() - lastLogin;
                const offlineDays = Math.floor(offlineTime / (1000 * 60 * 60 * 24));
                console.log(`Player ${member.playerData.displayname} would be kicked for being offline for ${offlineDays} days`);
                await this.send(`/oc Player ${member.playerData.displayname} has been offline for ${offlineDays} days`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay between messages
            }
        }
        console.log('onCommand finished');  // Debugging line
    }
}

module.exports = TestPurgeCommand;