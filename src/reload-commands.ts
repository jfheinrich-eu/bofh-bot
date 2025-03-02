import { Client, REST, Routes } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { slashcommands } from "./commands/index";
import { config } from "./config";
import path from "node:path";
import fs, { lstatSync } from "node:fs";

const commandsList = [];
const foldersPath = path.join(__dirname, 'commands');
const commandsFolders = fs.readdirSync(foldersPath).filter(folder => {
    const checkPath = path.join(foldersPath, folder);
    try {
        return lstatSync(checkPath).isDirectory();
    } catch (err) {
        return false;
    }
});

for (const folder of commandsFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commandsList.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
    await deployCommands({ guildId: config.GUILD_ID });
    console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const commandName = interaction.commandName.replace('-', '_');

    if (slashcommands[commandName as keyof typeof slashcommands]) {
        slashcommands[commandName as keyof typeof slashcommands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);
