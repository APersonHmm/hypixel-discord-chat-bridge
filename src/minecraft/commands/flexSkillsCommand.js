const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const getDungeons = require("../../../API/stats/dungeons.js");

class FlexSkillsCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "flex";
        this.aliases = ["flexx"];
        this.description = "Compliments the player if their stats are high.";
        this.options = [
            {
                name: "username",
                description: "Minecraft username",
                required: false,
            },
        ];

        // Thresholds for each stat
        this.thresholds = {
            farming: 60,
            mining: 60,
            combat: 60,
            foraging: 40,
            fishing: 50,
            enchanting: 60,
            alchemy: 50,
            carpentry: 50,
            runecrafting: 20,
            social: 15,
            taming: 55,
            catacombs: 45,
        };

        // Array of possible flex messages
        this.flexMessages = [
            "Your ${stat} is impressive! Keep up the good work! You're at ${statLevel} ",
            "You're doing great with your ${stat}! Keep it up! You're at ${statLevel} ",
            "Your ${stat} is top-notch! Don't stop now! You're at ${statLevel} ",
            "You're really good at ${stat}! Keep going! You're at ${statLevel} ",
            "Your ${stat} level is ${statLevel}! That's amazing!",
            "Wow, ${statLevel} in ${stat}? You're really good at this!",
            "Your ${stat} level is so high, it's impressive. It's ${statLevel}.",
            "Is your ${stat} level ${statLevel}? You must be a pro!",
            "Your ${stat} level is ${statLevel}. You're doing great!",
        ];
    } 

    // Function to get a random flex message
    getRandomFlexMessage(stat, statLevel) {
        const randomIndex = Math.floor(Math.random() * this.flexMessages.length);
        return this.flexMessages[randomIndex].replace('${stat}', stat).replace('${statLevel}', statLevel);
    }

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;
            console.log(`Username: ${username}`); // Debug: print the username
    
            const data = await getLatestProfile(username);

            username = formatUsername(data.profileData?.displayname || username);
    
            const skills = getSkills(data.profile);
            console.log(`Skills: ${JSON.stringify(skills)}`); // Debug: print the skills

            const dungeons = getDungeons(data.profile);
            console.log(`Dungeons: ${JSON.stringify(dungeons)}`); // Debug: print the dungeons
    
            // Collect all stats that are above their thresholds
            let highStats = [];
            for (let stat in this.thresholds) {
                if (skills[stat] && skills[stat].level > this.thresholds[stat]) {
                    highStats.push({ stat: stat, level: skills[stat].level });
                }
                else if (dungeons[stat] && dungeons[stat].level > this.thresholds[stat]) {
                    highStats.push({ stat: stat, level: dungeons[stat].level });
                }
            }
    
            // If there are any high stats, randomly select one and send a flex message for it
            if (highStats.length > 0) {
                const randomIndex = Math.floor(Math.random() * highStats.length);
                const { stat, level } = highStats[randomIndex];
                const flexMessage = this.getRandomFlexMessage(stat, level);
                console.log(`Flex Message: ${flexMessage}`); // Debug: print the flex message
                this.send(`/gc ${username}, ${flexMessage}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`); // Debug: print the error
        }
    }
}

module.exports = FlexSkillsCommand;