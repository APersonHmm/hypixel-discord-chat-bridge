const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { fetchPlayerAPI } = require("../../../API/functions/GuildAPI");
const fs = require("fs");

class WhitelistCommand extends minecraftCommand {
    constructor(minecraft) {
        super(minecraft);

        this.name = "whitelist";
        this.description = "Add or remove players from the whitelist.";
        this.options = [
            {
                name: "action",
                description: "Action to perform (add or remove)",
                required: true,
            },
            {
                name: "playername",
                description: "Name of the player",
                required: true,
            },
        ];
    }

    async onCommand(username, message) {
        try {
            const args = this.getArgs(message);
            const action = args[0].toLowerCase();
            const playerName = args[1];

            if (action !== "add" && action !== "remove") {
                throw "Invalid action. Please use 'add' or 'remove'.";
            }

            const whitelistFile = "./whitelist.json";
            let whitelist = [];

            // Check if the whitelist file exists
            if (fs.existsSync(whitelistFile)) {
                whitelist = JSON.parse(fs.readFileSync(whitelistFile, 'utf8'));
            }

            if (action === "add") {
                const playerData = await fetchPlayerAPI(playerName);
                if (!whitelist.includes(playerData.uuid)) {
                    whitelist.push(playerData.uuid);
                    fs.writeFileSync(whitelistFile, JSON.stringify(whitelist));
                    await this.send(`Player ${playerName} has been added to the whitelist.`);
                } else {
                    await this.send(`Player ${playerName} is already in the whitelist.`);
                }
            } else if (action === "remove") {
                const playerData = await fetchPlayerAPI(playerName);
                const index = whitelist.indexOf(playerData.uuid);
                if (index !== -1) {
                    whitelist.splice(index, 1);
                    fs.writeFileSync(whitelistFile, JSON.stringify(whitelist));
                    await this.send(`Player ${playerName} has been removed from the whitelist.`);
                } else {
                    await this.send(`Player ${playerName} is not in the whitelist.`);
                }
            }
        } catch (error) {
            console.error("Error executing whitelist command:", error);
            await this.send("An error occurred while executing the command.");
        }
    }
}

module.exports = WhitelistCommand;