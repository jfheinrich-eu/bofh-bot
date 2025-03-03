import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Client, REST, Routes } from "discord.js";
import { deployCommands } from "../../../deploy-commands";
import { slashcommands } from "../../index";
import { config } from "../../../config";
import path from "node:path";
import fs from "node:fs";

export const data = new SlashCommandBuilder()
    .setName("reload-commands")
    .setDescription("Reload the slash command list of this bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: CommandInteraction) {
    const commandsList = [];
    const foldersPath = path.join(config.BOT_BASE_DIR, 'commands/slash');
    const commandsFolders = fs.readdirSync(foldersPath).filter(folder => {
        const checkPath = path.join(foldersPath, folder);
        try {
            return fs.lstatSync(checkPath).isDirectory();
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

    const rest = new REST().setToken(config.DISCORD_TOKEN);

    (async () => {
        try {
            const guildId = interaction.guildId ?? "";

            console.log(`Started refreshing ${commandsList.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
                {body: commandsList},
            );

            console.log(`Successfully reloaded ${(data as typeof slashcommands[]).length} of ${commandsList.length} application (/) commands.`);
            return interaction.reply(`Successfully ${(data as typeof slashcommands[]).length} of ${commandsList.length} application (/) commands reloaded.`);
        } catch (error) {
            console.error(error);
            return interaction.reply("An error occurred when the slash-commands updated. Contact the bot publisher.");
        }
    })();
}