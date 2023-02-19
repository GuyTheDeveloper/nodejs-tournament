export default async (ctx, masterState) => {
  try {
    const itemId = ctx.callbackQuery.data.split("_")[1];
    masterState[ctx.chat.id] = { step: 2 };
    masterState[ctx.chat.id].service_id = itemId;
    return ctx.reply("Bo'lim tanlandi. Ismingizni kiriting", {
      reply_markup: { force_reply: true },
    });
  } catch (error) {
    console.log(error);
    ctx.reply("Botda texnik nosozlik yuz berdi.Tez orada qaytamiz");
  }
};
