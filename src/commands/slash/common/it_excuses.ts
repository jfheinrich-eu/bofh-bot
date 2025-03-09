import { ApplicationIntegrationType, CommandInteraction, InteractionContextType, SlashCommandBuilder } from "discord.js";
import { bofhApiCall, bofhExcuse } from "../../../lib/bofhApiCall";
import { translateMessage } from "../../../lib/translateMessage";

const data = new SlashCommandBuilder()
    .setName("it-excuses")
    .setDescription("Get IT excuses via BOFH REST API")
    .addStringOption(option =>
        option.setName('language')
            .setDescription('Pick the labnguage')
            .addChoices(
                { name: 'English', value: 'en' },
                { name: 'German', value: 'de' },
                { name: 'France', value: 'fr' },
            ))
    .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall);

async function execute(interaction: CommandInteraction) {
    const language:string = interaction.options.get('language')?.value?.toString() ?? "en";
    const resItExcuse = await bofhApiCall();
    let jsonResponse: bofhExcuse = JSON.parse('{"id": 0, "quote": "no response from REST API", "source": "na", "date": "na"}');

    if (resItExcuse !== undefined && resItExcuse.length > 0) {
        jsonResponse = resItExcuse[0];
    }

    let responseContent = `IT excuse: ${jsonResponse.quote}`;
    if (language !== 'en') {
        responseContent = (await translateMessage(responseContent, language)).toString();
    }

    responseContent += "📟";

    return interaction.reply(responseContent);
}

export default {
    data,
    execute,
}
