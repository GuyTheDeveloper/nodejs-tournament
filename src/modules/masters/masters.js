const getMasters = async (pool, offset, searchQuery, itemPerPage) => {
  try {
    const master_per_page = 10;
    const response = await pool.query(
      `select * from masters where name ilike '%${$1}%' limit $2 offset $3`,
      [searchQuery, itemPerPage, offset]
    );

    return response.rows;
  } catch (error) {
    console.log(error);
  }
};

export default { getMasters };
