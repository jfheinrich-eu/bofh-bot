import { CommandInteraction, SlashCommandBuilder, ApplicationIntegrationType, InteractionContextType, EmbedBuilder, PermissionsBitField, AttachmentBuilder } from "discord.js";
import path from "node:path";
import { config } from "../../../config";

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('BOFH bot help')
    .addStringOption(option =>
        option.setName('category')
            .setDescription('Pick the help category')
            .addChoices(
                { name: 'Synopsis', value: 'synopsis'},
                { name: 'Administration', value: 'administration' },
                { name: 'Utilities', value: 'utilities' },
                {name: 'Common', value: 'common'},
        ))
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall);

async function execute(interaction: CommandInteraction) {
    const category: string = interaction.options.get('category')?.value?.toString() ?? "synopsis";
    const iconUrl: string = 'attachment://bofh-api-logo.png';
    const file = new AttachmentBuilder(path.join(config.BOT_BASE_DIR, '/assets/bofh-api-logo.png'));

    const helpEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setURL('https://jfheinrich.eu')
        .setAuthor({ name: 'Jörg Heinrich', iconURL: iconUrl, url: 'https://jfheinrich.eu' })
        .setTimestamp()
        .setFooter({ text: 'BOFH bot: <joerg@jfheinrich.eu>Jörg Heinrich', iconURL: iconUrl })
        .setThumbnail(iconUrl);

    switch (category) {
        case 'synopsis':
            await buildHelpSynopsis(helpEmbed, interaction);
            break;
        case 'administration':
            break;
        case 'utilities':
            break;
        case 'common':
            break;
    }

    return interaction.reply({ embeds: [helpEmbed], files: [file] });
}

async function buildHelpSynopsis(helpEmbed: EmbedBuilder, interaction: CommandInteraction): Promise<void>
{
    helpEmbed
        .setTitle('Synopsis')
        .setDescription('Lists all available commands')

        .addFields(
            { name: '\u200b', value: '\u200b' },
            { name: '/ping', value: 'Test command, responses with \'Pong\'' },
            { name: '/it-excues', value: 'Requests random quote form BOFH API' },
        );

    if (interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.Administrator) === true ||
        (await interaction.guild?.fetchOwner())?.user.username === interaction.user.username ) {
        helpEmbed.addFields(
            { name: 'reload-commands', value: 'Updated the commandlist' },
        );
    }
}

export default {
    data,
    execute,
}
