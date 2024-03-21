const axios = require('axios');
const config = require('../../config');

const guildCache = new Map();
const playerCache = new Map();

async function fetchGuildAPI(guildId) {
    const hypixelAPIkey = config.minecraft.API.hypixelAPIkey;
    const guildAPIUrl = `https://api.hypixel.net/v2/guild?key=${hypixelAPIkey}&id=${guildId}`;

    try {
        const response = await axios.get(guildAPIUrl);

        if (response.data.success) {
            const guildData = response.data.guild;
            guildCache.set(guildId, guildData);

            // Fetch player data for each player in the guild
            for (const member of guildData.members) {
                await fetchPlayerAPI(member.uuid);
            }

            return guildData;
        } else {
            throw new Error("Failed to fetch guild data from Hypixel API.");
        }
    } catch (error) {
        throw new Error("Failed to fetch guild data: " + error.message);
    }
}

async function fetchPlayerAPI(uuid) {
    const hypixelAPIkey = config.minecraft.API.hypixelAPIkey;
    const playerAPIUrl = `https://api.hypixel.net/v2/player?key=${hypixelAPIkey}&uuid=${uuid}`;

    try {
        const response = await axios.get(playerAPIUrl);

        if (response.data.success) {
            const playerData = response.data.player;
            playerCache.set(uuid, playerData);
            return playerData;
        } else {
            throw new Error("Failed to fetch player data from Hypixel API.");
        }
    } catch (error) {
        throw new Error("Failed to fetch player data: " + error.message);
    }
}

function isGuildMaster(playerUUID) {
    const guildData = guildCache.get(config.minecraft.guild.guildID);
    if (!guildData) {
        console.error('Guild data not found in cache');
        return false;
    }

    for (const member of guildData.members) {
        if (member.uuid === playerUUID && member.rank === "Guild Master") {
            return true;
        }
    }

    return false;
}

module.exports = { fetchPlayerAPI, fetchGuildAPI, isGuildMaster };