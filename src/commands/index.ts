import ping from "./slash/utilities/ping";
import it_excuses from "./slash/common/it_excuses";
import reload_commands from "./slash/administration/reload_commands";
import help from "./slash/utilities/help";
import { getSlashCommands, globalCommandList } from "../lib/getSlashCommands";
import { config } from "../config";

if (config.ENVIRONMENT === 'develop') {
    getSlashCommands();
}
export const filebaseCommandList = globalCommandList.commandList;

export const slashcommands = {
    ping,
    it_excuses,
    reload_commands,
    help,
};

export const commands = {

}
