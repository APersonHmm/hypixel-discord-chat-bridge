const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { fetchPlayerAPI, fetchGuildAPI } = require("../../../API/functions/GuildAPI");
const fs = require("fs");

class TestAPICommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "testapi";
        this.description = "Fetches data from the GuildAPI and writes the response to a file.";
    }

    async onCommand(username, message) {
        try {
            const guildData = await fetchGuildAPI();

            const membersData = await Promise.all(guildData.members.map(async member => {
                const playerData = await fetchPlayerAPI(member.uuid);
                return {
                    guildMember: {
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

            const output = {
                guild: {
                    id: guildData._id,
                    name: guildData.name,
                    members: membersData
                }
            };

            fs.writeFileSync('./apiOutput.json', JSON.stringify(output, null, 2));
            await this.send("API data has been written to apiOutput.json.");
        } catch (error) {
            console.error("Error fetching API data:", error);
            await this.send("An error occurred while fetching API data.");
        }
    }
}

module.exports = TestAPICommand;

