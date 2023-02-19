export default (pool) => {
  return (ctx, next) => {
    const chatId = ctx.chat.id;

    pool.query(
      "select * from admin where admin_id = $1",
      [chatId],
      (err, res) => {
        if (err) {
          console.log(err);
          return next();
        }

        if (res.rowCount >= 1) {
          ctx.state.isAdmin = true;
        } else {
          ctx.state.isAdmin = false;
        }

        return next();
      }
    );
  };
};
