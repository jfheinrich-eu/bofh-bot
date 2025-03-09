import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { REST, Routes } from "discord.js";
import { slashcommands, filebaseCommandList } from "../../index";
import { config } from "../../../config";

const data = new SlashCommandBuilder()
    .setName("reload-commands")
    .setDescription("Reload the slash command list of this bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction: CommandInteraction) {
    const commandsList = config.ENVIRONMENT === 'develop'
        ? Object.values(filebaseCommandList).map((command) => command.declaration.data)
        : Object.values(slashcommands).map((command) => command.data);
    const rest = new REST().setToken(config.DISCORD_TOKEN);

    (async () => {
        try {
            const guildId = interaction.guildId ?? "";

            console.log(`Started refreshing ${commandsList.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
                {body: commandsList},
            );

            console.log(`Successfully reloaded ${(data as typeof filebaseCommandList[]).length} of ${commandsList.length} application (/) commands.`);
            return interaction.reply(`Successfully ${(data as typeof filebaseCommandList[]).length} of ${commandsList.length} application (/) commands reloaded.`);
        } catch (error) {
            console.error(error);
            return interaction.reply("An error occurred when the slash-commands updated. Contact the bot publisher.");
        }
    })();
}

export default {
    data,
    execute,
}
