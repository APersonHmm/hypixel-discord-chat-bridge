const minecraftCommand = require("../../contracts/minecraftCommand.js");
const fs = require('fs');

class WhitelistCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "whitelist";
    this.aliases = ["wl"];
    this.description = "Manage whitelist for players to exclude them from getting kicked during purge.";
    this.options = [
      {
        name: "action",
        description: "Action to perform: add or remove",
        required: true,
        choices: [
          {
            name: "add",
            value: "add"
          },
          {
            name: "remove",
            value: "remove"
          }
        ]
      },
      {
        name: "player",
        description: "Player to whitelist",
        required: true
      }
    ];
  }

  async onCommand(player, message) {
    try {
      const args = this.getArgs(message);
      const action = args[0].toLowerCase();
      const playerName = args[1];

      if (action !== "add" && action !== "remove") {
        throw "Invalid action. Please use 'add' or 'remove'.";
      }

      const whitelistFile = "./whitelist.json";

      if (action === "add") {
        const whitelist = require(whitelistFile);
        if (!whitelist.includes(playerName)) {
          whitelist.push(playerName);
          fs.writeFileSync(whitelistFile, JSON.stringify(whitelist));
          this.send(`/gc Player ${playerName} added to whitelist.`);
        } else {
          this.send(`/gc Player ${playerName} is already whitelisted.`);
        }
      } else if (action === "remove") {
        const whitelist = require(whitelistFile);
        const index = whitelist.indexOf(playerName);
        if (index !== -1) {
          whitelist.splice(index, 1);
          fs.writeFileSync(whitelistFile, JSON.stringify(whitelist));
          this.send(`/gc Player ${playerName} removed from whitelist.`);
        } else {
          this.send(`/gc Player ${playerName} is not whitelisted.`);
        }
      }
    } catch (error) {
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}

module.exports = WhitelistCommand;
