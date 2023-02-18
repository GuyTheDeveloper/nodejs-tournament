import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const bot_token = process.env.BOT_TOKEN;

export { connectionString, bot_token };
