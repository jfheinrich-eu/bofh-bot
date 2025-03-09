import path from "node:path";
import fs from "node:fs";
import { config } from "../config";
import { CommandInteraction, InteractionResponse, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
}

export interface CommandList {
    commandName: string;
    declaration: SlashCommand;
}

interface GlobalCommandList {
    commandList: CommandList[];
}

export const globalCommandList = {
    commandList: [],
} as GlobalCommandList;

export async function getSlashCommands(): Promise<CommandList[]>
{
        const commandsList: CommandList[] = [];
        const foldersPath = path.join(config.BOT_BASE_DIR, 'commands/slash');
        const commandsFolders = fs.readdirSync(foldersPath).filter(folder => {
            const checkPath = path.join(foldersPath, folder);
            try {
                return fs.lstatSync(checkPath).isDirectory();
            } catch (err) {
                console.log(err);
                return false;
            }
        });

        for (const folder of commandsFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const dynamicImport = await import(filePath);
                const command: SlashCommand = dynamicImport.default;

                if ('data' in command && 'execute' in command) {
                    const commandObject: CommandList = {
                        commandName: (command.data.name as string).replace('-', '_'),
                        declaration: ({
                            data: command.data,
                            execute: command.execute,
                        } as SlashCommand),
                    };
                    commandsList.push(commandObject);
                    globalCommandList.commandList.push(commandObject);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

    return Promise.resolve(commandsList);
}