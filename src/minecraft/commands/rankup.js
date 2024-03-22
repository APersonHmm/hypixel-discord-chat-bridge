const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getWeight = require("../../../API/stats/weight.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { fetchPlayerRank } = require("../../../API/functions/GuildAPI");

class RankupCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "rankup";
        this.aliases = ["rankupp"];
        this.description = "Overview + Automatic Rank Up.";
        this.options = [
            {
                name: "username",
                description: "Minecraft username",
                required: false,
            },
        ];
    } 

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;
            const data = await getLatestProfile(username);

            username = formatUsername(data.profileData?.displayname || username);

            const profile = getWeight(data.profile, data.uuid);
            const dungeons = getDungeons(data.playerRes, data.profile);
            const skills = getSkills(data.profile);

            const skillAverage = (
                Object.keys(skills)
                    .filter((skill) => !["runecrafting", "social"].includes(skill))
                    .map((skill) => skills[skill].levelWithProgress || 0)
                    .reduce((a, b) => a + b, 0) /
                (Object.keys(skills).length - 2)
            ).toFixed(2);

            const senitherW = profile.senither.total;
            const catacombsLevel = dungeons && dungeons.catacombs && dungeons.catacombs.skill ? dungeons.catacombs.skill.levelWithProgress : 0;

            // Fetch the player's current rank
            const currentRank = await fetchPlayerRank(username);
        
            // Define the ranks in order of highest to lowest
            const ranks = ["Shadow Adviser", "Shadow Sentry"];
        
            // Check rank requirements and execute rank-up command if met
            if (skillAverage >= 42 && catacombsLevel >= 36 && senitherW >= 7000) {
                if (currentRank !== ranks[0]) {
                    const rankUpCommand = `/g setrank ${username} Shadow Adviser`;
                    this.send(rankUpCommand);
                } else {
                    this.send(`/gc ${username} already has the highest rank they meet requirements for.`);
                }
            } else if (skillAverage >= 28 && catacombsLevel >= 24 && senitherW >= 2000) {
                if (currentRank !== ranks[1]) {
                    const rankUpCommand = `/g setrank ${username} Shadow Sentry`;
                    this.send(rankUpCommand);
                } else {
                    this.send(`/gc ${username} already has the highest rank they meet requirements for.`);
                }
            } else {
                this.send(`/gc ${username} does not meet the requirements for a rank-up.`);
            }
        } catch (error) {
            this.send(`/gc [ERROR] ${error}`);
        }
    }
}

module.exports = RankupCommand;