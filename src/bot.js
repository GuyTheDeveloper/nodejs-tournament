import { Markup, Telegraf } from "telegraf";
import pg from "pg";
import { bot_token, connectionString } from "./config.js";

const bot = new Telegraf(bot_token);
const pool = new pg.Pool({
  connectionString: connectionString,
});

bot.start(async (ctx) => {
  try {
    const user = ctx.from;
    const keyboard = Markup.keyboard(["Ro'yhatdan o'tish"]).resize();
    ctx.reply("Assalomu Alaykum", keyboard);
  } catch (error) {
    ctx.reply("Aka uzur users relations yo'q");
  }
});

bot.hears("Ro'yhatdan o'tish", async (ctx) => {
  const user = ctx.from;

  let oldUser = await pool.query("select * from users where user_id = $1", [
    user.id,
  ]);

  if (oldUser.rowCount > 1) {
    return ctx.reply(
      `Assalomu Alaykum ${user.first_name}, siz allaqachon ro'yhatdan o'tgansiz`
    );
  }

  ctx.reply("Tanlang", Markup.keyboard([["Usta", "Mijoz"]]).resize());
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("ishlayapti bot");
