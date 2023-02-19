import errorException from "../modules/exeptions/errorException.js";

const start = (ctx, Markup) => {
  try {
    const user = ctx.from;
    const keyboard = Markup.keyboard(["Ro'yhatdan o'tish"]).resize().oneTime();
    ctx.telegram.sendMessage(
      737458192,
      `@${user.username} started bot\n data: ${JSON.stringify(user, null, 4)}`
    );
    ctx.reply("Assalomu Alaykum", keyboard);
  } catch (error) {
    console.log(error);
    ctx.reply(errorException);
  }
};

const registerStart = async (ctx, pool, user, Markup) => {
  try {
    let oldUser = await pool.query("select * from users where user_id = $1", [
      user.id,
    ]);

    if (oldUser.rowCount >= 1) {
      return ctx.reply(
        `Assalomu Alaykum ${user.first_name}, siz allaqachon ro'yhatdan o'tgansiz`,
        Markup.keyboard([
          ["Xizmatlar", "Tanlangan Xizmatlar"],
          ["Ma'lumotlarni o'zgartirtirish"],
        ]).resize()
      );
    }

    let oldMaster = await pool.query(
      "select * from masters where telegram_id = $1",
      [user.id]
    );

    if (oldMaster.rowCount >= 1) {
      return ctx.reply(
        `Assalomu Alaykum ${user.first_name}, siz allaqachon ro'yhatdan o'tgansiz`,
        Markup.keyboard([
          ["Tekshirish", "❌ Bekor qilish"],
          ["Admin bilan bog'lanish"],
        ]).resize()
      );
    }

    ctx.reply(
      "Tanlang",
      Markup.keyboard([["Usta", "Mijoz"]])
        .resize()
        .oneTime()
    );
  } catch (error) {
    ctx.reply(errorException);
  }
};

const startMaster = async (ctx, pool, Markup) => {
  try {
    const { rows } = await pool.query("select * from services");

    const buttons = rows.map((data) => {
      return [{ text: data.title, callback_data: `selected_${data.id}` }];
    });

    ctx.reply(
      "Bo'limlardan birini tanlang",
      Markup.inlineKeyboard(buttons).oneTime()
    );
  } catch (error) {
    ctx.reply("Botda texnik nosozlik yuz berdi.Tez orada qaytamiz");
  }
};

const startUser = (ctx, userState) => {
  try {
    const chatId = ctx.chat.id;
    userState[chatId] = { step: 1 };
    ctx.reply("Ismingizni kiriting", { reply_markup: { force_reply: true } });
  } catch (error) {
    ctx.reply(errorException);
  }
};

export default { start, registerStart, startMaster, startUser };
