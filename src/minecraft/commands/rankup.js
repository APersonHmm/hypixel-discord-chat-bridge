const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const getDungeons = require("../../../API/stats/dungeons.js");
const getWeight = require("../../../API/stats/weight.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

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

        // Initialize debug mode flag
        this.debugMode = false;
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
            const catacombsLevel = dungeons.catacombs.skill.levelWithProgress || 0;

            // Check if debug mode is enabled
            if (this.debugMode) {
                console.log(`[DEBUG] Skill Average: ${skillAverage}, Catacombs Level: ${catacombsLevel}, Senither Weight: ${senitherW}`);
            }

            // Check rank requirements and execute rank-up command if met
            if (skillAverage >= 42 && catacombsLevel >= 36 && senitherW >= 7000) {
                // Execute rank-up command
                const rankUpCommand = `/g setrank ${username} Shadow Adviser`;
                // Assuming this.send executes the command
                this.send(rankUpCommand);
            } else if (skillAverage >= 28 && catacombsLevel >= 24 && senitherW >= 2000) {
                const rankUpCommand = `/g setrank ${username} Shadow Sentry`;
                this.send(rankUpCommand);
            } else {
                // If no rank-up conditions are met, display a message
                this.send(`[INFO] ${username} does not meet the requirements for a rank-up.`);
            }
        } catch (error) {
            this.send(`[ERROR] ${error}`);
        }
    }

    // Method to toggle debug mode
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}.`);
    }
}

module.exports = RankupCommand;
