import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID, TRANSLATOR_URL } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !GUILD_ID || !TRANSLATOR_URL) {
    throw new Error("Missing environment variables");
}

const BOT_BASE_DIR = __dirname;

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    GUILD_ID,
    TRANSLATOR_URL,
    BOT_BASE_DIR,
};
