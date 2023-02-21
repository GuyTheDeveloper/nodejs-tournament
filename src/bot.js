import { Markup, Telegraf } from "telegraf";
import pg from "pg";
import { bot_token, connectionString } from "./config.js";
import { commands, userSteps, handleService } from "./helpers/index.js";
import checkAdmin from "./middlewares/checkAdmin.js";

const bot = new Telegraf(bot_token);
const pool = new pg.Pool({
  connectionString: connectionString,
});

bot.use(checkAdmin(pool));

bot.start((ctx) => commands.start(ctx, Markup));

bot.hears("Ro'yhatdan o'tish", (ctx) =>
  commands.registerStart(ctx, pool, ctx.from, Markup)
);

let masterState = {};
let userState = {};
bot.hears("Usta", (ctx) => commands.startMaster(ctx, pool, Markup));

bot.action(/selected_[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}/i, async (ctx) =>
  handleService(ctx, masterState)
);

bot.hears("Mijoz", (ctx) => commands.startUser(ctx, userState));

bot.command("admin", async (ctx) => {
  if (ctx.state.isAdmin) {
    return ctx.reply(
      "Assalomu Alaykum admin brat",
      Markup.keyboard([
        ["Xizmatlar", "Ustalar", "Mijozlar", "Pending masters"],
      ]).resize()
    );
  }
  ctx.reply("Pishding uka");
});

bot.hears("Pending masters", async (ctx) => {
  try {
    if (ctx.state.isAdmin) {
      let allMasters = await pool.query("select * from masters");
      allMasters.rows?.map((master) =>
        ctx.reply(
          `Name: ${master.name}`,
          Markup.inlineKeyboard([
            [
              { text: "✅ approve", callback_data: `approve_${master.id}` },
              { text: "❌ reject", callback_data: `reject_${master.id}` },
            ],
          ])
        )
      );
    }
  } catch (error) {
    console.log(error);
    ctx.reply("something went wrong");
  }
});

bot.action(/approve_[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}/i, async (ctx) => {
  if (ctx.state.isAdmin) {
    const itemId = ctx.callbackQuery.data.split("_")[1];

    let data = await pool.query(
      "update masters set status = 'active' where id = $1 returning *",
      [itemId]
    );

    if (data.rowCount >= 1) {
      ctx.telegram.sendMessage(
        737458192,
        `@${ctx.from.username}, ro'yxatdan o'tkazdi, admin approved ${
          data.rows[0].name
        } qabul qilindi ${JSON.stringify(data.rows[0], null, 4)})`
      );
      ctx.reply(`Ro'yxatdan o'tkazildi`);
    }
  }
});

bot.action(/reject_[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}/i, async (ctx) => {
  if (ctx.state.isAdmin) {
    console.log(ctx.callbackQuery.data);
  }
});

async function searchUsers(searchTerm, page) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const query = `
      SELECT *
      FROM masters
      WHERE name ILIKE '%${searchTerm}%'
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
  const result = await pool.query(query);
  const users = result.rows;
  const hasNext = users.length === pageSize;
  const hasPrev = page > 1;
  return { users, hasNext, hasPrev };
}

bot.hears("Ustalar", (ctx) => {
  if (ctx.state.isAdmin) {
    ctx.reply("Ustalar", Markup.keyboard([["Ism", "Telefon raqami"]]).resize());
  }
});

bot.hears("Ism", (ctx) => {
  if (ctx.state.isAdmin) {
    ctx.reply("Ism kiriting", { reply_markup: { force_reply: true } });
  }
});

//obshiy handle steplarni registerni
bot.on("message", async (ctx) =>
  userSteps(ctx, Markup, pool, userState, masterState)
);

// bot.on("message", (ctx) => {
//   ctx.reply("ctx bu");
//   console.log(ctx.update.message.reply_to_message);
// });

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("ishlayapti bot");
