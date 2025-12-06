import { pool } from "../../config/db";

const getUser = async() => {
    const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
    return result.rows;
};

const getSingleUser = async(userId: string)=>{
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users WHERE id = $1`, [userId]);
  return result.rows[0];
}

const updateUser = async (name: string, email: string, userId: string) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, email = $2 
     WHERE id = $3 
     RETURNING id, name, email, phone, role`,
    [name, email, userId]
  );

  return result.rows[0];
};

const deleteUser = async(userId: string)=> {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  return result.rowCount;
}

export const userServices = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};