import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { slashcommands } from "./commands/index";
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

    if (slashcommands[commandName as keyof typeof slashcommands]) {
        slashcommands[commandName as keyof typeof slashcommands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);
