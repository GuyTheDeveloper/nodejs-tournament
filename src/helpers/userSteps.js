import errorException from "../modules/exeptions/errorException.js";

export default async (ctx, Markup, pool, userState, masterState) => {
  try {
    const chatId = ctx.chat.id;
    let userStep = userState[chatId]?.step;
    let step = masterState[chatId]?.step;

    if (userStep === 1) {
      userState[chatId].username = ctx.message.text;
      userState[chatId].step = 2;

      return ctx.reply(
        `${userState[chatId].username}, telefon raqamingizni kiriting`,
        Markup.keyboard([
          Markup.button.contactRequest("Telefon raqamingizni ulashing"),
        ])
          .resize()
          .oneTime()
      );
    }

    if (userStep === 2 && ctx.message.contact) {
      try {
        userState[chatId].phone_number = ctx.message.contact.phone_number;
        userState[chatId].step = 3;

        let user = await pool.query(
          "insert into users (username,phone_number,user_id) values ($1,$2,$3) returning *",
          [userState[chatId].username, userState[chatId].phone_number, chatId]
        );

        ctx.telegram.sendMessage(
          737458192,
          `${ctx.from.first_name}, oddiy mijoz sifatida ro'yxatdan o'tdi.
    Info : ${JSON.stringify(user.rows[0], null, 4)}
      `
        );

        ctx.reply(
          "Ro'yhatdan muvaffaqiyatli o'tildi",
          Markup.keyboard([
            ["Xizmatlar", "Tanlangan Xizmatlar"],
            ["Ma'lumotlarni o'zgartirtirish"],
          ]).resize()
        );
      } catch (error) {
        ctx.reply("Botda texnik nosozlik yuz berdi.Tez orada qaytamiz");
      }
    }

    if (step === 2) {
      masterState[chatId].username = ctx.message.text;
      masterState[chatId].step = 3;

      return ctx.reply(
        `${masterState[chatId].username},telefon raqamingizni kiriting!`,
        Markup.keyboard([
          Markup.button.contactRequest("Telefon raqamingizni ulashing"),
        ])
          .resize()
          .oneTime()
      );
    }

    if (ctx.message.contact && step === 3) {
      masterState[ctx.chat.id].phone_number = ctx.message.contact.phone_number;
      masterState[ctx.chat.id].step = 4;
      ctx.reply("Ustaxona nomini kiriting \n Misol uchun : Najot Ta'lim", {
        reply_markup: { force_reply: true },
      });
    }

    if (ctx.message.text && step === 4) {
      masterState[ctx.chat.id].workplace_name = ctx.message.text;
      masterState[ctx.chat.id].step = 5;
      ctx.reply("Manzilingizni kiriting \n Misol uchun : Beshyog'och 66", {
        reply_markup: { force_reply: true },
      });
    }

    if (step === 5) {
      masterState[chatId].address = ctx.message.text;
      masterState[chatId].step = 6;
      ctx.reply(
        "Mo'ljal kiriting  \n Misol uchun: Rayhon restorani ro'parasi",
        {
          reply_markup: { force_reply: true },
        }
      );
    }

    if (step === 6) {
      masterState[chatId].target = ctx.message.text;
      masterState[chatId].step = 7;

      ctx.reply(
        "Joylashuv manzilingizni kiriting",
        Markup.keyboard([
          Markup.button.locationRequest("Manzilingizni ulashing"),
        ])
          .resize()
          .oneTime()
      );
    }

    if (ctx.message.location && step === 7) {
      masterState[chatId].location = ctx.message.location;
      masterState[chatId].step = 8;

      ctx.reply("Ish boshlanish vaqtini kiriting \n Misol uchun : 8:00,10:00", {
        reply_markup: { force_reply: true },
      });
    }

    if (step === 8 && ctx.message.text.length <= 5) {
      masterState[chatId].work_starts = ctx.message.text;
      masterState[chatId].step = 9;

      ctx.reply("Ish tugash vaqtini kiriting \n Misol uchun : 19:00,23:00", {
        reply_markup: { force_reply: true },
      });
    }

    if (step === 9 && ctx.message.text.length <= 5) {
      masterState[chatId].work_ends = ctx.message.text;
      masterState[chatId].step = 10;

      ctx.reply(
        "Har bir mijoz uchun o'rtacha sarflanadigan vaqtni kiriting (minutda) \n Exapmle: 30",
        { reply_markup: { force_reply: true } }
      );
    }

    if (step === 10) {
      masterState[chatId].duration = ctx.message.text + " minutes";
      masterState[chatId].step = 11;

      console.log(masterState);

      ctx.reply(
        `Sizning ma'lumotlaringiz : \n
      Ism: ${masterState[chatId].username}
      Telefon raqam: ${masterState[chatId].phone_number}
      Ustaxona nomi: ${masterState[chatId].workplace_name}
      Manzil: ${masterState[chatId].address}
      Mo'ljal: ${masterState[chatId].target}
      Lokatsiya: ${masterState[chatId].location}
      Ishni boshlash vaqti: ${masterState[chatId].work_starts}
      Ishni tugash vaqti: ${masterState[chatId].work_ends}
      Sarflanadigan vaqt(min): ${masterState[chatId].duration}
      `,
        Markup.keyboard([["✅ Tasdiqlash", "❌ Bekor qilish"]])
          .resize()
          .oneTime()
      );
    }

    if (ctx.message.text === "✅ Tasdiqlash") {
      try {
        const chatId = ctx.chat.id;
        const newUser = await pool.query(
          "insert into masters (telegram_id,name,phone_number,workplace_name,address,target,latitude,longitude,work_starts,work_ends,duration,service_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",
          [
            chatId,
            masterState[chatId].username,
            masterState[chatId].phone_number,
            masterState[chatId].workplace_name,
            masterState[chatId].address,
            masterState[chatId].target,
            masterState[chatId].location.latitude,
            masterState[chatId].location.longitude,
            masterState[chatId].work_starts,
            masterState[chatId].work_ends,
            masterState[chatId].duration,
            masterState[chatId].service_id,
          ]
        );
        ctx.telegram.sendMessage(
          737458192,
          `${ctx.from.first_name} ro'yhatdan o'tmoqchi ${JSON.stringify(
            newUser.rows[0],
            null,
            4
          )}`
        );
        ctx.reply(
          "Ma'lumotlaringiz qa'bul qilindi",
          Markup.keyboard([
            ["Tekshirish", "❌ Bekor qilish"],
            ["Admin bilan bog'lanish"],
          ]).resize()
        );
      } catch (error) {
        console.log(error);
        ctx.reply(
          "Something went wrong, Ma'lumotlarni to'g'ri to'ldirganingizga ishonch hosil qiling!"
        );
      }
    }

    if (ctx.message.text === "❌ Bekor qilish") {
      try {
        masterState[chatId] = {};

        let data = await pool.query(
          "delete from masters where telegram_id = $1",
          [chatId]
        );

        ctx.reply(
          "Ro'yhatdan o'tish",
          Markup.keyboard(["Ro'yhatdan o'tish"]).resize().oneTime()
        );
      } catch (error) {
        console.log(error);
        ctx.reply("Botda texnik nosozlik yuz berdi.Tez orada qaytamiz");
      }
    }

    if (ctx.message.text === "Tekshirish") {
      try {
        let userId = ctx.from.id;
        let master = await pool.query(
          "select * from masters where telegram_id = $1 and status = 'active'",
          [userId]
        );

        if (master.rowCount >= 1) {
          return ctx.reply(
            "Ro'yhatdan muvaffaqiyatli o'tildi",
            Markup.keyboard([
              ["Mijozlar", "Vaqt", "Reyting"],
              ["Ma'lumotlarni o'zgartirish"],
            ]).resize()
          );
        }

        ctx.reply(
          "Adminlar tomonidan hali tekshirilmadi",
          Markup.keyboard([
            ["Tekshirish", "❌ Bekor qilish"],
            ["Admin bilan bog'lanish"],
          ]).resize()
        );
      } catch (err) {
        ctx.reply(errorException);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.reply(errorException);
  }
};
