import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { slashcommands, filebaseCommandList } from "./commands/index";
import { config } from "./config";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
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

    if (config.ENVIRONMENT === 'develop') {
        const commandList = filebaseCommandList.filter(command => command.commandName === commandName);
        if (commandList.length !== 0)
        {
            commandList[0].declaration.execute(interaction);
        }
    } else {
        if (slashcommands[commandName as keyof typeof slashcommands]) {
            slashcommands[commandName as keyof typeof slashcommands].execute(interaction);
        }
    }
});

client.login(config.DISCORD_TOKEN);
