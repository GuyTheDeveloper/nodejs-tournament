import { Telegraf } from "telegraf";
import pg from "pg";
import { bot_token, connectionString } from "./config.js";

const bot = new Telegraf(bot_token);
const pool = new pg.Pool({
  connectionString: connectionString,
});

bot.start((ctx) => {
  ctx.reply("Pawol Naxuy");
  ctx.reply("🖕");
});
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("ishlayapti bot");
