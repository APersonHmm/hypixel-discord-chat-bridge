const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getLatestProfile } = require("../../../API/functions/getLatestProfile.js");
const getSkills = require("../../../API/stats/skills.js");
const { formatUsername } = require("../../contracts/helperFunctions.js");

class BlameCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "blame";
        this.aliases = ["blamee"];
        this.description = "Blames the player if their stats are too low.";
        this.options = [
            {
                name: "username",
                description: "Minecraft username",
                required: false,
            },
        ];

        // Thresholds for each stat
        this.thresholds = {
            farming: 50,
            mining: 50,
            combat: 60,
            foraging: 60,
            fishing: 30,
            enchanting: 60,
            alchemy: 40,
            carpentry: 40,
            runecrafting: 20,
            social: 10,
            taming: 50,
        };

        // Array of possible blame messages
        this.blameMessages = [
            "Your ${stat} is too low! Stop being lazy! Imagine being only ${statLevel} ",
            "You need to work on your ${stat} u monke! ${statLevel} Only ....",
            "Your ${stat} is not up to par! Get to work! its only ${statLevel} ",
            // Add more messages as needed
        ];
    } 

    // Function to get a random blame message
    getRandomBlameMessage(stat, statLevel) {
        const randomIndex = Math.floor(Math.random() * this.blameMessages.length);
        return this.blameMessages[randomIndex].replace('${stat}', stat).replace('${statLevel}', statLevel);
    }

    async onCommand(username, message) {
        try {
            username = this.getArgs(message)[0] || username;
            console.log(`Username: ${username}`); // Debug: print the username
    
            const data = await getLatestProfile(username);
            console.log(`Data: ${JSON.stringify(data)}`); // Debug: print the data
    
            username = formatUsername(data.profileData?.displayname || username);
            console.log(`Formatted Username: ${username}`); // Debug: print the formatted username
    
            const skills = getSkills(data.profile);
            console.log(`Skills: ${JSON.stringify(skills)}`); // Debug: print the skills
    
            // Collect all stats that are below their thresholds
            let lowStats = [];
            for (let stat in this.thresholds) {
                if (skills[stat] && skills[stat].level < this.thresholds[stat]) {
                    lowStats.push({ stat: stat, level: skills[stat].level });
                }
            }
    
            // If there are any low stats, randomly select one and send a blame message for it
            if (lowStats.length > 0) {
                const randomIndex = Math.floor(Math.random() * lowStats.length);
                const { stat, level } = lowStats[randomIndex];
                const blameMessage = this.getRandomBlameMessage(stat, level);
                console.log(`Blame Message: ${blameMessage}`); // Debug: print the blame message
                this.send(`/gc ${username}, ${blameMessage}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`); // Debug: print the error
        }
    }
}

module.exports = BlameCommand;